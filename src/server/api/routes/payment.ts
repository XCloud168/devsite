"use server";

import { eq } from "drizzle-orm";

import { PRICING_PLANS } from "@/lib/constants";
import { db } from "@/server/db";
import { payments } from "@/server/db/schema";
import { PLAN_TYPE, SUPPORTED_CHAIN } from "@/types/constants";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "./auth";

/**
 * Checkout a plan
 * @param planType - The type of the plan to checkout
 * @param chain - The chain to checkout
 * @returns The checkout url
 */
export async function checkout(planType: PLAN_TYPE, chain: SUPPORTED_CHAIN) {
  try {
    const user = await getUserProfile();

    if (!user) {
      throw new Error("Please login first");
    }

    const plan = PRICING_PLANS[planType as keyof typeof PRICING_PLANS];

    if (!plan) {
      throw new Error("Plan not found");
    }

    // 创建一个支付订单
    const payment = await _createPayment(user.id, planType, chain, plan.price);

    return { data: payment, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

/**
 * 确认付款流程： 用户支付后，调用此方法确认付款，后台根据订单号查询订单，如果订单状态为待付款，则更新订单状态为已付款待确认，
 *
 * @param paymentId - 订单id
 */
export async function confirmPayment(paymentId: string) {
  try {
    const user = await getUserProfile();
    if (!user) {
      throw new Error("Please login first");
    }

    const payment = await db.query.payments.findFirst({
      where: (payments, { eq, and }) =>
        and(eq(payments.id, paymentId), eq(payments.userId, user.id)),
    });
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "pending") {
      throw new Error("Payment is not pending");
    }

    // 更新订单状态为已付款
    const updatedPayment = await db
      .update(payments)
      .set({ status: "paid" })
      .where(eq(payments.id, paymentId));

    return { data: updatedPayment, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

/**
 * 创建一个支付记录
 * @param userId - 用户id
 * @param planType - 计划类型
 * @param chain - 链
 * @param amount - 金额
 */
async function _createPayment(
  userId: string,
  planType: PLAN_TYPE,
  chain: SUPPORTED_CHAIN,
  amount: number,
) {
  // 检查该用户是否有最近未支付的订单，如果有相同套餐+价格+chain的订单，则复用该payment，如果有未支付+chain的订单，则复用该地址
  const lastPayment = await db.query.payments.findFirst({
    where: (payments, { eq, and, gte }) =>
      and(
        eq(payments.userId, userId),
        eq(payments.status, "pending"),
        eq(payments.chain, chain),
        eq(payments.planType, planType),
        eq(payments.amount, amount.toString()),
        gte(payments.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)),
      ),
  });
  if (lastPayment) {
    // If exact same payment exists, just return it
    return lastPayment;
  }

  // Check for any pending payment with same chain to reuse address
  const lastChainPayment = await db.query.payments.findFirst({
    where: (payments, { eq, and, gte }) =>
      and(
        eq(payments.userId, userId),
        eq(payments.status, "pending"),
        eq(payments.chain, chain),
        gte(payments.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)),
      ),
  });

  if (lastChainPayment) {
    // Create new payment with reused address
    const [newPayment] = await db
      .insert(payments)
      .values({
        userId: userId,
        chain: chain,
        planType: planType,
        receiverAddress: lastChainPayment.receiverAddress,
        amount: amount.toString(),
        status: "pending",
      })
      .returning();
    return newPayment;
  }

  // 从收款地址池中获取一个可用的地址
  const availableAddress = await _getAvailableAddress(chain);
  if (!availableAddress) {
    throw new Error("No available address found");
  }
  const receiverAddress = availableAddress.address;

  if (!receiverAddress) {
    throw new Error("No available address found");
  }

  type NewPayment = typeof payments.$inferInsert;

  const data: NewPayment = {
    userId: userId,
    chain: chain,
    planType: planType,
    receiverAddress: receiverAddress,
    amount: amount.toString(),
    txHash: null,
    status: "pending",
  };
  const [payment] = await db.insert(payments).values(data).returning();

  return payment;
}

/**
 * 获取一个可用的收款地址
 * 1. 根据chain获取一个可用的收款地址: 查询地址池中enabled的地址，并且该地址在最近24小时内没有被使用过（payments中未找到该地址的记录）
 * 2. 如果找到，则返回该地址
 * 3. 如果找不到，则返回null
 * 4. 如果提供了address 和userid，则优先检查该地址是否可用，如果可用，则返回该地址，否则从地址池中获取
 *
 * @param chain - 链
 * @param address - 地址
 * @param userId - 用户id
 * @returns 收款地址
 */
async function _getAvailableAddress(
  chain: SUPPORTED_CHAIN,
  address?: string | null,
  userId?: string | null,
) {
  let availableAddress;
  if (address && userId) {
    availableAddress = await db.query.paymentAddresses.findFirst({
      where: (paymentAddresses, { eq, and, notExists, gte, ne }) =>
        and(
          eq(paymentAddresses.address, address),
          eq(paymentAddresses.chain, chain),
          eq(paymentAddresses.enabled, true),
          notExists(
            db
              .select()
              .from(payments)
              .where(
                and(
                  eq(payments.receiverAddress, paymentAddresses.address),
                  eq(payments.status, "pending"),
                  ne(payments.userId, userId),
                  gte(
                    payments.updatedAt,
                    new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时内没有用过
                  ),
                ),
              ),
          ),
        ),
    });
    if (availableAddress) {
      return availableAddress;
    }
  }

  availableAddress = await db.query.paymentAddresses.findFirst({
    where: (paymentAddresses, { eq, and, gte, notExists }) =>
      and(
        eq(paymentAddresses.enabled, true),
        eq(paymentAddresses.chain, chain),
        notExists(
          db
            .select()
            .from(payments)
            .where(
              and(
                eq(payments.receiverAddress, paymentAddresses.address),
                eq(payments.status, "pending"),
                gte(
                  payments.updatedAt,
                  new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时内没有用过
                ),
              ),
            ),
        ),
      ),
  });

  return availableAddress;
}
