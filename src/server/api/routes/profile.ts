"use server";

import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { and, count, eq, ne, or } from "drizzle-orm";
import { getUserProfile } from "./auth";

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
