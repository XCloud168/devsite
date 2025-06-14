import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { tweetInfo, tweetUsers, watchlist } from "@/server/db/schema";
import { and, count, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { getUserProfile } from "./auth";

/**
 * 使用游标获取推特信息
 *
 * @param cursor 游标（上一页最后一条推文的创建时间）
 * @param filter 过滤条件
 * @param filter.tweetUid 推特uid 筛选某个kol的推文
 * @param filter.followed 是否关注 筛选关注用户的推文
 * @param filter.hasContractAddress 是否包含合约地址 筛选包含合约地址的推文
 * @returns 推特信息
 */
export async function getTweetsByPaginated(
  filter: {
    tweetUid?: string;
    followed?: boolean;
    hasContractAddress?: boolean;
  },
  cursor?: string,
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

    // 添加游标条件
    if (cursor) {
      conditions.push(sql`${tweetInfo.tweetCreatedAt} < ${cursor}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 并行执行查询和计数查询
    const [items, countResult] = await Promise.all([
      // 获取数据
      db.query.tweetInfo.findMany({
        where: whereClause,
        with: {
          tweetUser: {
            columns: {
              id: true,
              screenName: true,
              name: true,
              avatar: true,
            },
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
      }),
      // 使用 count() 直接获取总数
      db.select({ value: count() }).from(tweetInfo).where(whereClause),
    ]);

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // 获取下一页的游标
    const nextCursor = items.length > 0 ? items[items.length - 1]?.tweetCreatedAt?.toISOString() ?? null : null;

    return {
      items: items,
      pagination: {
        nextCursor,
        totalCount,
        hasNextPage: nextCursor !== null,
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

    if (!user.membershipExpiredAt || new Date(user.membershipExpiredAt) < new Date()) {
      throw createError.forbidden("Please upgrade your membership");
    }

    // 获取推特用户信息
    const tweetUser = await db.query.tweetUsers.findFirst({
      where: eq(tweetUsers.id, tweetUid),
    });
    
    // 只有在 user_type 为 null 或未设置时才更新为 user_follow
    if (!tweetUser?.userType) {
      await db
        .update(tweetUsers)
        .set({
          userType: "user_follow"
        })
        .where(eq(tweetUsers.id, tweetUid));
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
      
    // 获取推特用户信息
    const tweetUser = await db.query.tweetUsers.findFirst({
      where: eq(tweetUsers.id, tweetUid),
    });
  
    // 只有当 user_type 为 user_follow 时才进行后续处理
    if (tweetUser?.userType === "user_follow") {
      // 检查是否还有其他用户关注这个推特用户
      const remainingFollows = await db
        .select({ count: count() })
        .from(watchlist)
        .where(eq(watchlist.tweetUser, tweetUid));
        
      // 如果没有其他人关注，将 user_type 设置为 NULL
      if (remainingFollows[0]?.count === 0) {
        await db
          .update(tweetUsers)
          .set({
            userType: null
          })
          .where(eq(tweetUsers.id, tweetUid));
      }
    } 
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
    // 检查用户登录状态和会员资格
    const user = await getUserProfile();
    if (!user) {
      throw createError.unauthorized("Please login first");
    }
    
    // 清理用户名，移除 @ 符号和链接前缀
    const regex = /^((https:\/\/(x|twitter)\.com\/)|@)?(\w+).*/;
    const match = regex.exec(screenName);
    
    if (!match?.[4]) {
      throw createError.invalidParams("Invalid Twitter username");
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
      
      if (!apiUserData.rest_id) {
        throw createError.server("Failed to get user information from API");
      }

      const userData = {
        screenName: apiUserData.profile,
        name: apiUserData.name,
        avatar: apiUserData.avatar,
        restId: apiUserData.rest_id,
        description: apiUserData.desc,
        followersCount: apiUserData.sub_count || 0,
        followingCount: apiUserData.friends || 0,
        tweetCount: apiUserData.statuses_count || 0,
        banner: apiUserData.header_image,
        pinnedTweetIdsStr: apiUserData.pinned_tweet_ids_str || [],
        joinDate: apiUserData.created_at ? parseTwitterTime(apiUserData.created_at) : null,
        dateUpdated: new Date()
      };

      let updatedUser;
      if (existingUser) {
        // 如果用户存在，执行更新操作
        [updatedUser] = await db
          .update(tweetUsers)
          .set(userData)
          .where(eq(tweetUsers.screenName, cleanScreenName))
          .returning();
      } else {
        // 如果用户不存在，执行插入操作
        [updatedUser] = await db
          .insert(tweetUsers)
          .values(userData)
          .returning();
      }

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
      'scraper-key': `${apiKey}`,
      'Content-Type': 'application/json',
    },
    // 添加30秒超时
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}

/**
 * 将Twitter格式的时间字符串转换为Date对象
 * @param dateStr Twitter格式的时间字符串，如 "Thu Mar 13 06:33:14 +0000 2025"
 * @returns Date对象
 */
function parseTwitterTime(dateStr: string): Date | null {
  try {
    // Twitter时间格式的正则表达式
    const regex = /(\w{3}) (\w{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) ([+-]\d{4}) (\d{4})/;
    const match = regex.exec(dateStr);
    
    if (!match) {
      return null;
    }
    
    // 将月份名称转换为数字
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
      'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
      'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const [, , month, day, hours, minutes, seconds, timezone, year] = match;
    
    if (month && day && hours && minutes && seconds && year) {
      return new Date(Date.UTC(
        parseInt(year),
        months[month as keyof typeof months],
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      ));
    }
    return null;
  } catch (error) {
    return null;
  }
}

