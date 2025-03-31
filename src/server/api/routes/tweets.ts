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
      conditions.push(sql`json_array_length(${tweetInfo.contractAddress}) > 0`);
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
          replyTweet: {
            with: {
              tweetUser: true,
            },
          },
          quotedTweet: {
            with: {
              tweetUser: true,
            },
          },
          retweetTweet: {
            with: {
              tweetUser: true,
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

/**
 * 获取推特用户信息
 * @param screenName 推特用户名
 * @returns 推特用户信息
 */
export async function getTweetUserByScreenName(screenName: string) {
  return withServerResult(async () => {
    // 清理用户名，移除 @ 符号和链接前缀
    const regex = new RegExp(/^((https:\/\/(x|twitter)\.com\/)|@)?(\w+).*/);
    const match = screenName.match(regex);
    
    if (!match || !match[4]) {
      throw createError.invalidParams("无效的推特用户名");
    }

    const cleanScreenName = match[4];

    // 从数据库查询用户信息
    const existingUser = await db.query.tweetUsers.findFirst({
      where: eq(tweetUsers.screenName, cleanScreenName),
    });

    // 检查用户信息是否需要更新
    const needsUpdate = existingUser 
      ? shouldUpdateUserInfo(existingUser)
      : true;

    if (!existingUser || needsUpdate) {
      // 调用第三方API获取用户信息
      const apiUserData = await fetchUserFromScraperTech(cleanScreenName);
      
      if (!apiUserData) {
        throw createError.server("无法从API获取用户信息");
      }

      // 更新或创建用户信息
      const userData = {
        screenName: cleanScreenName,
        name: apiUserData.name,
        avatar: apiUserData.avatar,
        restId: apiUserData.rest_id,
        description: apiUserData.description,
        followersCount: apiUserData.followers_count,
        followingCount: apiUserData.following_count,
        dateUpdated: new Date(),
        // 其他需要的字段...
      };

      const [updatedUser] = await db
        .insert(tweetUsers)
        .values(userData)
        .onConflictDoUpdate({
          target: [tweetUsers.screenName],
          set: userData,
        })
        .returning();

      return updatedUser;
    }

    return existingUser;
  });
}

/**
 * 检查用户信息是否需要更新
 */
function shouldUpdateUserInfo(user: any) {
  // 检查必需字段是否完整
  const requiredFields = ['screenName', 'name', 'avatar', 'restId'];
  const isComplete = requiredFields.every(field => Boolean(user[field]));

  // 检查更新时间是否超过15天
  const currentTime = new Date();
  const lastUpdated = new Date(user.dateUpdated);
  const daysSinceUpdate = (currentTime.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  const needsUpdate = daysSinceUpdate > 15;

  return !isComplete || needsUpdate;
}

/**
 * 从ScraperTech API获取用户信息
 */
async function fetchUserFromScraperTech(screenName: string, restId?: string) {
  const baseUrl = process.env.SCRAPER_TECH_API_URL;
  const apiKey = process.env.SCRAPER_TECH_API_KEY;
  
  const url = new URL(`${baseUrl}/screenname.php`);
  url.searchParams.append('screenname', screenName);
  if (restId) {
    url.searchParams.append('rest_id', restId);
  }
  
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

