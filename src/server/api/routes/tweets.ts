import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { tweetInfo, watchlist } from "@/server/db/schema";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { getUserProfile } from "./auth";
import { ITEMS_PER_PAGE } from "@/lib/constants";

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
  page: number = 1,
  filter: {
    tweetUid?: string;
    followed?: boolean;
    hasContractAddress?: boolean;
  },
) {
  return withServerResult(async () => {
    // 构建查询条件
    const conditions = [];

    if (filter.tweetUid) {
      conditions.push(eq(tweetInfo.tweetUser, filter.tweetUid));
    }

    if (filter.followed) {
      const user = await getUserProfile();
      if (user) {
        const myFollowing = await db.query.watchlist.findMany({
          where: eq(watchlist.profilesId, user.id),
          columns: {
            tweetUser: true,
          },
        });
        conditions.push(
          inArray(
            tweetInfo.tweetUser,
            myFollowing.map((item) => item.tweetUser),
          ),
        );
      }
    }

    if (filter.hasContractAddress) {
      conditions.push(isNotNull(tweetInfo.contractAddress));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const tweets = await db.query.tweetInfo.findMany({
      where: whereClause,
      orderBy: (tweetInfo, { desc }) => [desc(tweetInfo.tweetCreatedAt)],
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    });
    return tweets;
  });
}
