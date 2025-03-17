import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { count, eq } from "drizzle-orm";
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
