"use server";

import { and, desc, eq, gte } from "drizzle-orm";
import { Erc20Transaction } from "moralis/common-evm-utils";

import {
  PRICING_PLANS,
  SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { createError } from "@/lib/errors";
import { getERC20Transfers } from "@/lib/moralis";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { payments, profiles } from "@/server/db/schema";
import { type PLAN_TYPE, type SUPPORTED_CHAIN } from "@/types/constants";
import assert from "assert";
import { getUserProfile } from "./auth";
import dayjs from "dayjs";

/**
 * Checkout a plan
 * @param planType - The type of the plan to checkout
 * @param chain - The chain to checkout
 * @returns The checkout url
 */
export async function checkout(planType: PLAN_TYPE, chain: SUPPORTED_CHAIN) {
  return withServerResult(async () => {
    const user = await getUserProfile();

    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    const plan = PRICING_PLANS[planType as keyof typeof PRICING_PLANS];

    if (!plan) {
      throw createError.invalidParams("Plan not found");
    }

    // 创建一个支付订单
    const payment = await _createPayment(user.id, planType, chain, plan.price);
    return payment;
  });
}

/**
 * 确认付款流程： 用户支付后，调用此方法确认付款，后台根据订单号查询订单，如果订单状态为待付款，则更新订单状态为已付款待确认，
 *
 * @param paymentId - 订单id
 */
export async function confirmPayment(paymentId: string) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    const payment = await db.query.payments.findFirst({
      where: (payments, { eq, and }) =>
        and(eq(payments.id, paymentId), eq(payments.userId, user.id)),
    });
    if (!payment) {
      throw createError.notFound("Payment not found");
    }

    if (payment.status !== "pending") {
      throw createError.invalidParams("Payment is not pending");
    }

    // 更新订单状态为已付款
    const [updatedPayment] = await db
      .update(payments)
      .set({ status: "paid" })
      .where(eq(payments.id, paymentId))
      .returning();

    return updatedPayment;
  });
}

/**
 * 检查支付状态, 如果paymentId为空，则检查最近周期内所有未确认的订单
 * 默认周期：30分钟
 *
 * @param paymentId - 订单id
 * @returns 订单
 */
export async function checkPayment(paymentId?: string) {
  return withServerResult(async () => {
    const conditions = [];
    conditions.push(eq(payments.status, "pending"));

    if (paymentId) {
      conditions.push(eq(payments.id, paymentId));
    } else {
      conditions.push(
        gte(payments.createdAt, new Date(Date.now() - 30 * 60 * 1000)),
      );
    }

    const whereConditions =
      conditions.length > 0 ? and(...conditions) : undefined;

    const paymentsRecords = await db.query.payments.findMany({
      where: whereConditions,
    });

    const checkAddresses: { address: string; chain: SUPPORTED_CHAIN }[] = [];
    paymentsRecords.forEach((record) => {
      // 去重
      if (
        !checkAddresses.find(
          (item) =>
            item.address === record.receiverAddress &&
            item.chain === record.chain,
        )
      ) {
        checkAddresses.push({
          address: record.receiverAddress,
          chain: record.chain,
        });
      }
    });

    checkAddresses.forEach(async ({ address, chain }) => {
      if (!SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[chain]) {
        throw createError.invalidParams("Unsupported chain");
      }
      const transfers = await getERC20Transfers(
        address,
        SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[chain].address,
        SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[chain].chainId,
      );

      const newOrders = [];

      transfers.result.forEach((transaction: Erc20Transaction) => {
        try {
          const order = _transferUsdtCallback(chain, address, transaction);
          newOrders.push(order);
        } catch (error) {
          console.error(error);
        }
      });
    });

    return { status: "success" };
  });
}

/**
 * 检查usdt交易金额，匹配payment订单，如果匹配，则更新payment订单状态为已确认，并更新会员订阅状态，以及更新返佣
 *
 * @param chain - 链
 * @param receiverAddress - 收款地址
 * @param transaction - 交易
 */
async function _transferUsdtCallback(
  chain: SUPPORTED_CHAIN,
  receiverAddress: string,
  transaction: Erc20Transaction,
) {
  // 如果是发送交易，不是接收，则不处理
  if (transaction.fromAddress.lowercase === receiverAddress.toLowerCase()) {
    return;
  }
  // 如果不是交易USDT ，则不处理
  if (
    transaction.address.lowercase !==
    SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[chain].address.toLowerCase()
  ) {
    return;
  }
  // 如果交易接收者不是当前地址，则不处理
  if (transaction.toAddress.lowercase !== receiverAddress.toLowerCase()) {
    return;
  }

  // 如果交易是spam，则不处理
  if (transaction.possibleSpam) {
    return;
  }

  const payment = await db.query.payments.findFirst({
    where: (payments, { eq, and }) =>
      and(
        eq(payments.receiverAddress, receiverAddress),
        eq(payments.chain, chain),
      ),
    orderBy: (payments) => [desc(payments.createdAt)],
  });

  assert(
    payment,
    `Payment not found: receiverAddress: ${receiverAddress} chain: ${chain}`,
  );
  if (payment.status === "confirmed") {
    console.log("Payment is confirmed");
    return;
  }

  assert(
    Number(payment.amount) *
      10 ** SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[chain].decimals ===
      Number(transaction.value),
    `Payment amount is not equal to transaction amount: paymentId: ${payment.id} paymentAmount: ${payment.amount} transactionValue: ${transaction.value}`,
  );

  console.log(
    `核查到交易，开始更新payment状态。 交易hash: ${transaction.transactionHash} paymentId: ${payment.id}`,
  );
  // 在同一个事务中更新payment状态为已确认，并更新会员订阅状态，以及更新返佣
  await db.transaction(async (tx) => {
    // 更新payment状态为已确认
    await tx
      .update(payments)
      .set({ status: "confirmed", txHash: transaction.transactionHash })
      .where(eq(payments.id, payment.id));

    // 更新会员订阅状态
    await _updateSubscriptionStatus(payment.userId, payment.planType);

    // // 更新返佣
    // await _updateReferral(tx, payment.userId, payment.planType);
  });
}

/**
 * 更新会员订阅状态
 * @param userId - 用户id
 * @param planType - 计划类型
 */
async function _updateSubscriptionStatus(userId: string, planType: PLAN_TYPE) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, userId),
    columns: {
      membershipExpiredAt: true,
    },
  });
  let startDate = dayjs();

  if (profile?.membershipExpiredAt) {
    startDate = dayjs(profile.membershipExpiredAt);
  }

  // 更新会员订阅状态
  let newExpiredAt = startDate;
  if (planType === "monthly") {
    newExpiredAt = startDate.add(1, "month"); // 30天
  } else if (planType === "quarterly") {
    newExpiredAt = startDate.add(3, "month"); // 90天
  } else if (planType === "yearly") {
    newExpiredAt = startDate.add(1, "year"); // 1年
  }

  await db
    .update(profiles)
    .set({
      membershipExpiredAt: newExpiredAt.toDate(),
    })
    .where(eq(profiles.id, userId));
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
    throw createError.notFound("No available address found");
  }
  const receiverAddress = availableAddress.address;

  if (!receiverAddress) {
    throw createError.notFound("No available address found");
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
