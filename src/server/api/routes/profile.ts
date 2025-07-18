"use server";

import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { and, count, eq, ne, or, not } from "drizzle-orm";
import { getUserProfile } from "./auth";
import { payments,configs } from "@/server/db/schemas/payment";
import { withdrawalRecords } from "@/server/db/schemas/payment";

/**
 * 获取我的邀请记录
 * @param page - 页码
 * @returns 邀请记录
 */
export async function getMyInviteRecordsByPaginated(page = 1) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    // 并行执行分页查询和计数查询
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const [items, countResult] = await Promise.all([
      // 获取分页数据
      db.query.profiles.findMany({
        where: (profiles, { eq }) => eq(profiles.inviterId, user.id),
        orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
        limit: ITEMS_PER_PAGE,
        offset,
      }),
      // 使用 count() 直接获取总数
      db
        .select({ count: count() })
        .from(profiles)
        .where(eq(profiles.inviterId, user.id)),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return {
      items: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  });
}

/**
 * 更新用户通知设置
 * @param enableNotification - 是否启用通知
 * @param notificationSound - 通知声音
 * @returns 更新后的用户通知设置
 */
export async function updateUserNotificationSettings(
  enableNotification: boolean,
  notificationSound: string,
) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    await db
      .update(profiles)
      .set({
        enableNotification,
        notificationSound,
      })
      .where(eq(profiles.id, user.id));

    return {
      success: true,
    };
  });
}

/**
 * 更新用户个人信息
 * @param username - 用户名
 * @param email - 邮箱
 * @param bio - 个人简介
 * @returns 更新后的用户个人信息
 */

export async function updateUserProfile(
  username: string,
  email: string,
  bio: string,
) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    if (user.email && user.email !== email) {
      throw createError.invalidParams("Email cannot be changed");
    }

    // 验证用户名和邮箱唯一
    const existingUser = await db.query.profiles.findFirst({
      where: (profiles, { eq }) =>
        and(
          ne(profiles.id, user.id),
          or(eq(profiles.username, username), eq(profiles.email, email)),
        ),
    });

    if (existingUser) {
      throw createError.invalidParams("Username or email already exists");
    }

    const [result] = await db
      .update(profiles)
      .set({ username, email, bio })
      .where(eq(profiles.id, user.id))
      .returning();

    return {
      success: true,
      data: result,
    };
  });
}

/**
 * 获取用户资料
 * @param userId - 用户ID
 * @returns 用户资料
 */
export async function getUserProfileById(userId: string) {
  return withServerResult(async () => {
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.id, userId),
      columns: {
        id: true,
        email: true,
        username: true,
        bio: true,
        membershipExpiredAt: true,
        inviteCode: true,
        inviterId: true,
        inviterSkipped: true,
        enableNotification: true,
        notificationSound: true,
        rewardPoints: true,
        agentCode: true,
        referrerCode: true,
        evmAddress: true,
        total: true,
        balance: true,
      }
    });
    
    if (!profile) {
      throw createError.notFound("User profile not found");
    }

    return profile;
  });
}

/**
 * 更新用户的推荐代理商代码
 * @param referrerCode - 代理商代码
 * @returns 更新结果
 */
export async function updateUserReferrerCode(referrerCode: string) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    // 检查代理商代码是否存在且不是用户自己
    const agent = await db.query.profiles.findFirst({
      where: and(
        eq(profiles.agentCode, referrerCode),
        not(eq(profiles.id, user.id))
      ),
    });
    if (!agent) {
      throw createError.invalidParams("Invalid referrer code");
    }

    await db
      .update(profiles)
      .set({
        referrerCode,
      })
      .where(eq(profiles.id, user.id));

    return {
      success: true,
    };
  });
}

/**
 * 绑定用户的 EVM 钱包地址，一旦绑定不可更改
 * @param evmAddress - EVM 钱包地址
 * @returns 更新结果
 */
export async function bindUserEvmAddress(evmAddress: string) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    // 检查用户是否已经绑定过钱包地址
    if (user.evmAddress) {
      throw createError.invalidParams("Wallet address already bound");
    }

    // 检查钱包地址格式是否正确 (0x开头的42位十六进制字符串)
    if (!/^0x[0-9a-fA-F]{40}$/.test(evmAddress)) {
      throw createError.invalidParams("Invalid EVM address format");
    }

    // 检查该钱包地址是否已被其他用户绑定
    const existingBind = await db.query.profiles.findFirst({
      where: eq(profiles.evmAddress, evmAddress),
    });
    if (existingBind) {
      throw createError.invalidParams("This wallet address is already bound to another account");
    }

    await db
      .update(profiles)
      .set({
        evmAddress,
      })
      .where(eq(profiles.id, user.id));

    return {
      success: true,
    };
  });
}

/**
 * 获取我的邀请信息
 * @returns 邀请信息
 */
export async function getMyInviteInfo() {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    // 1. 返佣比例
    const config = await db.select().from(configs).limit(1);
    const commissionRate = config[0]?.commissionRate ?? "--";

    // 2. 我邀请的所有用户
    const invitedUsers = await db
      .select()
      .from(profiles)
      .where(eq(profiles.inviterId, user.id));

    const invitedUserCount = invitedUsers.length;

    // 3. 一付费用户数（有效会员）
    const now = new Date();
    const paidUsers = invitedUsers.filter(u => u.membershipExpiredAt && u.membershipExpiredAt > now);
    const paidUserCount = paidUsers.length;


    // 5. 邀请明细列表
    // 可根据需要返回更多字段
    const inviteDetails = invitedUsers;

    return {
      commissionRate,
      invitedUserCount,
      paidUserCount,
      inviteDetails,
    };
  });
}

/**
 * 提交提现申请
 * @param amount - 提现金额
 * @returns 提现申请结果
 */
export async function submitWithdrawalRequest(amount: number) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }

    // 验证提现金额
    if (amount <= 0) {
      throw createError.invalidParams("Withdrawal amount must be positive");
    }

    // 检查余额是否足够
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      columns: {
        balance: true,
      },
    });

    if (!profile || Number(profile.balance ?? 0) < amount) {
      throw createError.invalidParams("Insufficient balance");
    }

    // 创建提现记录
    await db.insert(withdrawalRecords).values({
      userId: user.id,
      amount: String(amount),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Withdrawal request submitted successfully.",
    };
  });
}

