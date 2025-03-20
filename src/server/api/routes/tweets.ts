import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { tweetInfo, tweetUsers, watchlist } from "@/server/db/schema";
import { and, count, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { getUserProfile } from "./auth";

/**
 * 分页获取推特信息
 *
 * @param page 页码
 * @param filter 过滤条件
 * @param filter.tweetUid 推特uid 筛选某个kol的推文
 * @param filter.followed 是否关注 筛选关注用户的推文
 * @param filter.hasContractAddress 是否包含合约地址 筛选包含合约地址的推文
 * @returns 推特信息
 */
export async function getTweetsByPaginated(
  page = 1,
  filter: {
    tweetUid?: string;
    followed?: boolean;
    hasContractAddress?: boolean;
  },
) {
  return withServerResult(async () => {
    // 构建查询条件
    const conditions = [];
    const user = await getUserProfile();

    if (filter.tweetUid) {
      conditions.push(eq(tweetInfo.tweetUserId, filter.tweetUid));
    }

    if (filter.followed) {
      if (user) {
        const myFollowing = await db.query.watchlist.findMany({
          where: eq(watchlist.profilesId, user.id),
          columns: {
            tweetUser: true,
          },
        });
        conditions.push(
          inArray(
            tweetInfo.tweetUserId,
            myFollowing.map((item) => item.tweetUser),
          ),
        );
      }
    }

    if (filter.hasContractAddress) {
      conditions.push(isNotNull(tweetInfo.contractAddress));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 并行执行分页查询和计数查询
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const [items, countResult] = await Promise.all([
      // 获取分页数据
      db.query.tweetInfo.findMany({
        where: whereClause,
        with: {
          tweetUser: {
            extras: {
              isFollowed: sql<boolean>`EXISTS (
                SELECT 1
                FROM ${watchlist} w
                WHERE w.profiles_id = ${user ? sql`${user.id}` : sql`NULL`}
                AND w.tweet_user = ${tweetUsers.id}
              )`.as("isFollowed"),
            },
          },
          project: true,
        },
        orderBy: (tweetInfo, { desc }) => [desc(tweetInfo.tweetCreatedAt)],
        limit: ITEMS_PER_PAGE,
        offset,
      }),
      // 使用 count() 直接获取总数
      db.select({ value: count() }).from(tweetInfo).where(whereClause),
    ]);

    const totalCount = countResult[0]?.value ?? 0;
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
 * 添加推特关注
 *
 * @param tweetUid 推特uid
 * @returns 推特关注
 */
export async function addTweetFollowed(tweetUid: string) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    const [result] = await db
      .insert(watchlist)
      .values({
        profilesId: user.id,
        tweetUser: tweetUid,
      })
      .onConflictDoUpdate({
        target: [watchlist.profilesId, watchlist.tweetUser],
        set: {
          dateUpdated: new Date(),
          notifyOnNewTweet: true,
          notifyOnNewFollowing: true,
        },
      })
      .returning();
    return result;
  });
}

/**
 * 删除推特关注
 *
 * @param tweetUid 推特uid
 * @returns 推特关注
 */
export async function deleteTweetFollowed(tweetUid: string) {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    const [result] = await db
      .delete(watchlist)
      .where(
        and(
          eq(watchlist.profilesId, user.id),
          eq(watchlist.tweetUser, tweetUid),
        ),
      )
      .returning();
    return result;
  });
}

/**
 * 获取推特关注列表
 *
 * @returns 推特关注列表
 */
export async function getTweetFollowedList() {
  return withServerResult(async () => {
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    const result = await db.query.watchlist.findMany({
      where: eq(watchlist.profilesId, user.id),
      with: {
        tweetUser: true,
      },
    });
    return result;
  });
}
