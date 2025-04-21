"use server";

import { db } from "@/server/db";
import { tweetInfo, tweetUsers } from "@/server/db/schemas/tweet";
import { and, count, desc, eq, inArray, isNotNull, sql, asc } from "drizzle-orm";
import { withServerResult } from "@/lib/server-result";
import { type USER_TYPE } from "@/types/constants";
import { projects } from "@/server/db/schemas/signal";

/**
 * 获取Twitter用户涨幅排行榜
 *
 * @param period 统计周期，默认为"24h"，可选"7d"或"30d"
 * @returns Twitter用户涨幅统计
 */
export async function getTwitterUserGains(period = "24h") {
  return withServerResult(async () => {
    const timeAgo = new Date();
    let highRateFieldName: string;

    // 根据period选择不同的字段和时间范围
    if (period === "24h") {
      timeAgo.setHours(timeAgo.getHours() - 24);
      highRateFieldName = "high_rate_24h";
    } else if (period === "7d") {
      timeAgo.setDate(timeAgo.getDate() - 7);
      highRateFieldName = "high_rate_7d";
    } else if (period === "30d") {
      timeAgo.setDate(timeAgo.getDate() - 30);
      highRateFieldName = "high_rate_30d";
    } else {
      throw new Error("Invalid period specified");
    }

    const allowedUserTypes = [
      "user_follow",
      "kol_opinions",
      "institution_projects",
      "super_influencer",
    ] as USER_TYPE[];

    // 查询并统计数据
    const stats = await db
      .select({
        id: tweetUsers.id,
        name: tweetUsers.name,
        screenName: tweetUsers.screenName,
        avatar: tweetUsers.avatar,
        followersCount: tweetUsers.followersCount,
        signalsCount: count(tweetInfo.id),
        maxHighRate: sql`MAX(${sql.raw(highRateFieldName)})`,
        maxHighRateProject: sql`(
          SELECT jsonb_build_object(
            'symbol', p.symbol,
            'logo', p.logo,
            'id', p.id
          )
          FROM ${projects} p
          WHERE p.id = (
            SELECT ti.project_id
            FROM ${tweetInfo} ti
            WHERE ti.tweet_user_id = ${tweetUsers.id}
            AND ti.date_created > ${timeAgo.toISOString()}
            AND ti.project_id IS NOT NULL
            ORDER BY ${sql.raw(highRateFieldName)} DESC
            LIMIT 1
          )
        )`,
        positiveRatePercentage: sql`ROUND(
          COUNT(CASE WHEN ${sql.raw(highRateFieldName)}::numeric > 0 THEN 1 ELSE NULL END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN ${sql.raw(highRateFieldName)} IS NOT NULL THEN 1 ELSE NULL END), 0),
          2
        )`,
      })
      .from(tweetInfo)
      .leftJoin(tweetUsers, eq(tweetInfo.tweetUserId, tweetUsers.id))
      .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
      .where(
        and(
          inArray(tweetUsers.userType, allowedUserTypes),
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
        ),
      )
      .groupBy(
        tweetUsers.id,
        tweetUsers.name,
        tweetUsers.screenName,
        tweetUsers.avatar,
        tweetUsers.followersCount,
      )
      .orderBy(sql`MAX(${sql.raw(highRateFieldName)})::numeric DESC`)
      .limit(50)
      .execute();
       // 按照胜率排序
    const sortedStats = stats.sort((a, b) => {
      const winRateA = parseFloat(a.positiveRatePercentage as string);
      const winRateB = parseFloat(b.positiveRatePercentage as string);
      return winRateB - winRateA;
    });

    return stats;
  });
}

// type ProjectStats = {
//   projectId: string;
//   symbol: string;
//   logo: string;
//   mentionCount: number;
//   firstPrice: number;
//   highestPrice: number;
//   highestRate: number;
// };

/**
 * 计算分析时间范围
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns {timeAgo: Date, days: number} 开始时间和天数
 */
function calculateTimeRange(period = "7d") {
  const timeAgo = new Date();
  const days = period === "30d" ? 30 : 7; // 默认7天
  timeAgo.setDate(timeAgo.getDate() - days);
  return { timeAgo, days };
}

/**
 * 1. 获取用户基本信息
 *
 * @param userId Twitter用户ID
 * @returns 用户基本信息
 */
export async function getTwitterUserBasicInfo(userId: string) {
  return withServerResult(async () => {
    // 获取用户基本信息
    const user = await db.query.tweetUsers.findFirst({
      columns: {
        id: true,
        name: true,
        screenName: true,
        avatar: true,
        followersCount: true,
        description: true,
      },
      where: eq(tweetUsers.id, userId),
    });

    if (!user) {
      throw new Error("用户不存在");
    }

    return user;
  });
}

/**
 * 2. 获取用户统计数据
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 用户统计数据
 */
export async function getTwitterUserStats(userId: string, period = "7d") {
  return withServerResult(async () => {
    const { timeAgo } = calculateTimeRange(period);

    // 定义明确的类型
    interface UserStats {
      tweetsCount: number;
      positiveRatePercentage: string | number | null;
      maxHighRate: string | number | null;
      maxHighRateProject?: any;
      maxLowRate?: string | number | null;
      maxLowRateProject?: any;
      projectsCount?: number;
    }

    // 首先查询基本统计数据和项目数量
    const basicStats = await db
      .select({
        tweetsCount: count(tweetInfo.id),
        positiveRatePercentage: sql`ROUND(
          COUNT(CASE WHEN ${tweetInfo.highRate24H}::numeric > 0 THEN 1 ELSE NULL END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN ${tweetInfo.highRate24H} IS NOT NULL THEN 1 ELSE NULL END), 0),
          2
        )`,
        maxHighRate: sql`MAX(${tweetInfo.highRate24H})`,
        projectsCount: sql`COUNT(DISTINCT ${tweetInfo.projectId})`,
      })
      .from(tweetInfo)
      .where(
        and(
          eq(tweetInfo.tweetUserId, userId),
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
        ),
      )
      .execute()
      .then((rows) => rows[0]);

    // 创建用户统计对象，确保包含所有需要的属性
    const userStats: UserStats = {
      tweetsCount: basicStats?.tweetsCount ?? 0,
      positiveRatePercentage:
        (basicStats?.positiveRatePercentage as string | number | null) ?? 0,
      maxHighRate: (basicStats?.maxHighRate as string | number | null) ?? 0,
      projectsCount: (basicStats?.projectsCount as number) ?? 0,
    };

    // 如果有统计数据，查询最高涨幅对应的项目
    if (userStats.maxHighRate && Number(userStats.maxHighRate) !== 0) {
      // 查询最高涨幅对应的项目
      const highRateTweet = await db
        .select({
          projectId: tweetInfo.projectId,
        })
        .from(tweetInfo)
        .where(
          and(
            eq(tweetInfo.tweetUserId, userId),
            isNotNull(tweetInfo.projectId),
            sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
            sql`${tweetInfo.highRate24H} = ${userStats.maxHighRate}`,
          ),
        )
        .limit(1)
        .execute()
        .then((rows) => rows[0]?.projectId);

      if (highRateTweet) {
        const projectInfo = await db
          .select({
            symbol: projects.symbol,
            logo: projects.logo,
            id: projects.id,
          })
          .from(projects)
          .where(eq(projects.id, highRateTweet))
          .limit(1)
          .execute()
          .then((rows) => rows[0]);

        userStats.maxHighRateProject = projectInfo;
      }

      // 查询最低涨幅
      const lowRate = await db
        .select({
          minRate: sql`MIN(${tweetInfo.lowRate24H})`,
        })
        .from(tweetInfo)
        .where(
          and(
            eq(tweetInfo.tweetUserId, userId),
            isNotNull(tweetInfo.projectId),
            sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
          ),
        )
        .execute()
        .then((rows) => (rows[0]?.minRate as string | number | null) ?? null);

      userStats.maxLowRate = lowRate;

      // 查询最低涨幅对应的项目
      if (lowRate && Number(lowRate) !== 0) {
        const lowRateTweet = await db
          .select({
            projectId: tweetInfo.projectId,
          })
          .from(tweetInfo)
          .where(
            and(
              eq(tweetInfo.tweetUserId, userId),
              isNotNull(tweetInfo.projectId),
              sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
              sql`${tweetInfo.lowRate24H} = ${lowRate}`,
            ),
          )
          .limit(1)
          .execute()
          .then((rows) => rows[0]?.projectId);

        if (lowRateTweet) {
          const projectInfo = await db
            .select({
              symbol: projects.symbol,
              logo: projects.logo,
              id: projects.id,
            })
            .from(projects)
            .where(eq(projects.id, lowRateTweet))
            .limit(1)
            .execute()
            .then((rows) => rows[0]);

          userStats.maxLowRateProject = projectInfo;
        }
      }
    }

    return userStats;
  });
}

/**
 * 3. 获取用户每日胜率趋势数据
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 每日胜率趋势数据
 */
export async function getTwitterUserDailyWinRate(
  userId: string,
  period = "7d",
) {
  return withServerResult(async () => {
    const { days } = calculateTimeRange(period);

    // 胜率趋势数据（每日胜率）
    const dailyWinRate = await getDailyWinRate(userId, days);

    return dailyWinRate;
  });
}

/**
 * 4. 获取用户项目表现数据
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 项目表现数据
 */
export async function getTwitterUserProjectsPerformance(
  userId: string,
  period = "7d",
) {
  return withServerResult(async () => {

    // 获取周期内推文对应的所有项目的涨跌幅数据
    const projectsPerformance = await getProjectsPerformance(userId, period);

    return projectsPerformance;
  });
}

/**
 * 5. 获取用户代币维度统计
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 代币维度统计
 */
export async function getTwitterUserProjectStats(
  userId: string,
  period = "7d",
) {
  return withServerResult(async () => {
    // const { timeAgo } = calculateTimeRange(period);

    // 代币维度统计 - 按提及次数统计，包含代币符号、logo、提及次数、首次提及价格、最高点价格、最高收益率
    const projectStats = await getProjectStats(userId, period);

    return projectStats;
  });
}

/**
 * 6. 获取用户所有推文（带分页功能）
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @param page 页码，默认为1
 * @param pageSize 每页数量，默认为10
 * @returns 用户推文及分页信息
 */
export async function getTwitterUserTweets(
  userId: string,
  period = "7d",
  page = 1,
  pageSize = 10,
) {
  return withServerResult(async () => {
    const { timeAgo } = calculateTimeRange(period);

    // 获取用户的所有推文（周期内的）
    const tweetsWithPagination = await getAllTweets(
      userId,
      timeAgo,
      page,
      pageSize,
    );

    return tweetsWithPagination;
  });
}

/**
 * 整合所有数据的原始函数（保留但不推荐使用，因为可能会导致加载时间长）
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 完整用户数据
 */
export async function getTwitterUserAllData(userId: string, period = "7d") {
  return withServerResult(async () => {
    const { timeAgo, days } = calculateTimeRange(period);

    // 获取用户基本信息
    const user = await db.query.tweetUsers.findFirst({
      columns: {
        id: true,
        name: true,
        screenName: true,
        avatar: true,
        followersCount: true,
        description: true,
      },
      where: eq(tweetUsers.id, userId),
    });

    if (!user) {
      throw new Error("用户不存在");
    }

    // 1. 用户基本统计数据
    const userStats = await db
      .select({
        // 用户基本信息
        id: tweetUsers.id,
        name: tweetUsers.name,
        screenName: tweetUsers.screenName,
        avatar: tweetUsers.avatar,
        followersCount: tweetUsers.followersCount,
        description: tweetUsers.description,

        // 统计数据
        tweetsCount: count(tweetInfo.id),

        // 周期内涨幅大于0的胜率
        positiveRatePercentage: sql`ROUND(
          COUNT(CASE WHEN ${tweetInfo.highRate24H}::numeric > 0 THEN 1 ELSE NULL END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN ${tweetInfo.highRate24H} IS NOT NULL THEN 1 ELSE NULL END), 0),
          2
        )`,

        // 最高涨幅及对应项目
        maxHighRate: sql`MAX(${tweetInfo.highRate24H})`,
        maxHighRateProject: sql`(
          SELECT jsonb_build_object(
            'symbol', p.symbol,
            'logo', p.logo,
            'id', p.id
          )
          FROM ${projects} p
          WHERE p.id = (
            SELECT ti.project_id
            FROM ${tweetInfo} ti
            WHERE ti.tweet_user_id = ${tweetUsers.id}
            AND ti.date_created > ${timeAgo.toISOString()}
            AND ti.project_id IS NOT NULL
            ORDER BY ti.high_rate_24h DESC
            LIMIT 1
          )
        )`,

        // 最大跌幅及对应项目
        maxLowRate: sql`MIN(${tweetInfo.lowRate24H})`,
        maxLowRateProject: sql`(
          SELECT jsonb_build_object(
            'symbol', p.symbol,
            'logo', p.logo,
            'id', p.id
          )
          FROM ${tweetInfo} ti
          JOIN ${projects} p ON ti.project_id = p.id
          WHERE ti.low_rate_24h = (
            SELECT MIN(ti2.low_rate_24h)
            FROM ${tweetInfo} ti2
            WHERE ti2.tweet_user_id = ${tweetUsers.id}
            AND ti2.date_created > ${timeAgo.toISOString()}
            AND ti2.project_id IS NOT NULL
          )
          LIMIT 1
        )`,

        // 周期内的代币总数
        projectsCount: sql`COUNT(DISTINCT ${tweetInfo.projectId})`,
      })
      .from(tweetUsers)
      .leftJoin(tweetInfo, eq(tweetUsers.id, tweetInfo.tweetUserId))
      .where(
        and(
          eq(tweetUsers.id, userId),
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
        ),
      )
      .groupBy(
        tweetUsers.id,
        tweetUsers.name,
        tweetUsers.screenName,
        tweetUsers.avatar,
        tweetUsers.followersCount,
        tweetUsers.description,
      )
      .execute()
      .then((rows) => rows[0]);

    // 2. 胜率趋势数据（每日胜率）
    const dailyWinRate = await getDailyWinRate(userId, days);

    // 3. 获取周期内推文对应的所有项目的涨跌幅数据
    const projectsPerformance = await getProjectsPerformance(userId, period);

    // 4. 代币维度统计 - 按提及次数统计，包含代币符号、logo、提及次数、首次提及价格、最高点价格、最高收益率
    const projectStats = await getProjectStats(userId, period);

    // 5. 获取用户的所有推文（周期内的）
    const tweets = await getAllTweets(userId, timeAgo);

    return {
      userInfo: userStats,
      dailyWinRate,
      projectsPerformance,
      projectStats,
      tweets,
    };
  });
}

/**
 * 获取每日胜率趋势数据
 */
async function getDailyWinRate(userId: string, days: number) {
  // 定义返回结果的类型
  interface DailyWinRateResult {
    date: string;
    winRate: number;
    tweetsCount: number;
  }

  const results: DailyWinRateResult[] = [];

  for (let i = 0; i < days; i++) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayResult = await db
      .select({
        date: sql<string>`TO_CHAR(${tweetInfo.dateCreated}, 'YYYY-MM-DD')`,
        winRate: sql<number>`ROUND(
          COUNT(CASE WHEN ${tweetInfo.highRate24H}::numeric > 0 THEN 1 ELSE NULL END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN ${tweetInfo.highRate24H} IS NOT NULL THEN 1 ELSE NULL END), 0),
          2
        )`,
        tweetsCount: count(tweetInfo.id),
      })
      .from(tweetInfo)
      .where(
        and(
          eq(tweetInfo.tweetUserId, userId),
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} >= ${dayStart.toISOString()}`,
          sql`${tweetInfo.dateCreated} <= ${dayEnd.toISOString()}`,
        ),
      )
      .groupBy(sql`TO_CHAR(${tweetInfo.dateCreated}, 'YYYY-MM-DD')`)
      .execute()
      .then(
        (rows) =>
          rows[0] || {
            date: dayStart.toISOString().split("T")[0] ?? "",
            winRate: Number(0),
            tweetsCount: Number(0),
          },
      );

    results.push(dayResult);
  }

  // 按日期排序
  return results.sort((a, b) => {
    const dateA = String(a.date);
    const dateB = String(b.date);
    return dateA > dateB ? 1 : -1;
  });
}

/**
 * 获取项目表现数据
 * 针对用户在指定时间段内提到的每个项目，只返回涨幅最高的那条推文
 *
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 按项目分组后每个项目涨幅最高的推文，最多20条
 */
async function getProjectsPerformance(userId: string, period = '7d') {
  // 根据period计算timeAgo和选择涨幅、跌幅字段
  const now = new Date();
  let timeAgo: Date;
  let highRateField: any;
  let lowRateField: any;

  if (period === '7d') {
    timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7天前
    highRateField = tweetInfo.highRate7D;
    lowRateField = tweetInfo.lowRate7D;
  } else if (period === '30d') {
    timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
    highRateField = tweetInfo.highRate30D;
    lowRateField = tweetInfo.lowRate30D;
  } else {
    throw new Error('Invalid period specified');
  }

  // 查询用户在时间周期内的所有含项目ID的推文
  const allTweets = await db
    .select({
      id: tweetInfo.id,
      tweetCreatedAt: tweetInfo.tweetCreatedAt,
      highRate: highRateField,
      lowRate: lowRateField,
      projectId: projects.id,
      projectSymbol: projects.symbol,
      projectLogo: projects.logo,
    })
    .from(tweetInfo)
    .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
      ),
    )
    .orderBy(desc(highRateField)) // 按涨幅降序排序
    .execute();

  // 在内存中对数据进行处理
  // 用Map保存每个项目ID对应的最高涨幅推文
  const projectMap = new Map();

  for (const tweet of allTweets) {
    const projectId = tweet.projectId;

    // 如果这个项目还没有被处理过，或者当前推文的涨幅高于已有的
    if (
      !projectMap.has(projectId) ||
      parseFloat(String(tweet.highRate)) >
        parseFloat(String(projectMap.get(projectId).highRate))
    ) {
      projectMap.set(projectId, tweet);
    }
  }

  // 将Map中的值转换成数组并按涨幅排序
  const result = Array.from(projectMap.values())
    .sort(
      (a, b) =>
        parseFloat(String(b.highRate)) - parseFloat(String(a.highRate)),
    )
    .slice(0, 20); // 只取前20条

  return result;
}

/**
 * 获取项目统计数据
 */
async function getProjectStats(userId: string, period = '7d') {
  // 根据period计算timeAgo
  const now = new Date();
  let timeAgo: Date;
  let highPriceField: any;
  let highRateField: any;

  if (period === '7d') {
    timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7天前
    highPriceField = tweetInfo.highPrice7D;
    highRateField = tweetInfo.highRate7D;
  } else if (period === '30d') {
    timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
    highPriceField = tweetInfo.highPrice30D;
    highRateField = tweetInfo.highRate30D;
  } else {
    throw new Error('Invalid period specified');
  }

  // 从数据库中按时间正序查询所有符合条件的数据
  const tweetInfos = await db
    .select({
      projectId: tweetInfo.projectId,
      symbol: projects.symbol,
      logo: projects.logo,
      signalPrice: tweetInfo.signalPrice,
      highPrice: highPriceField,
      highRate: highRateField,
      dateCreated: tweetInfo.dateCreated,
    })
    .from(tweetInfo)
    .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
      ),
    )
    .orderBy(asc(tweetInfo.dateCreated))
    .execute();

  // 在内存中去重，只保留每个project_id的第一个tweet_info，并计算mentionCount
  const uniqueProjectStats = new Map<string, any>();

  for (const info of tweetInfos) {
    const projectId = info.projectId ?? '';
    if (!uniqueProjectStats.has(projectId)) {
      uniqueProjectStats.set(projectId, {
        projectId: info.projectId,
        symbol: info.symbol,
        logo: info.logo,
        firstPrice: info.signalPrice,
        highestPrice: info.highPrice,
        highestRate: info.highRate,
        mentionCount: 1, // 初始化mentionCount为1
      });
    } else {
      // 如果项目已经存在，增加mentionCount
      const projectStat = uniqueProjectStats.get(projectId);
      projectStat.mentionCount += 1;
    }
  }

  // 将Map转换为数组返回
  return Array.from(uniqueProjectStats.values());
}

/**
 * 获取所有推文（带分页功能）
 *
 * @param userId Twitter用户ID
 * @param timeAgo 起始时间
 * @param page 页码，默认为1
 * @param pageSize 每页数量，默认为10
 * @returns 用户推文及分页信息
 */
async function getAllTweets(
  userId: string,
  timeAgo: Date,
  page = 1,
  pageSize = 10,
) {
  // 计算分页偏移量
  const offset = (page - 1) * pageSize;

  // 查询推文总数
  const countResult = await db
    .select({
      count: sql`COUNT(*)`,
    })
    .from(tweetInfo)
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
      ),
    )
    .execute()
    .then((rows) => Number(rows[0]?.count || 0));

  // 查询分页数据
  const tweets = await db
    .select({
      id: tweetInfo.id,
      content: tweetInfo.content,
      contentSummary: tweetInfo.contentSummary,
      tweetCreatedAt: tweetInfo.tweetCreatedAt,
      tweetUrl: tweetInfo.tweetUrl,
      likes: tweetInfo.likes,
      retweets: tweetInfo.retweets,
      replies: tweetInfo.replies,
      highRate24H: tweetInfo.highRate24H,
      lowRate24H: tweetInfo.lowRate24H,
      signalPrice: tweetInfo.signalPrice,
      projectInfo: sql`(
        SELECT jsonb_build_object(
          'id', p.id,
          'symbol', p.symbol,
          'logo', p.logo
        )
        FROM ${projects} p
        WHERE p.id = ${tweetInfo.projectId}
      )`,
    })
    .from(tweetInfo)
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
      ),
    )
    .orderBy(desc(tweetInfo.dateCreated))
    .limit(pageSize)
    .offset(offset)
    .execute();

  // 计算总页数
  const totalPages = Math.ceil(countResult / pageSize);

  // 返回分页数据和分页信息
  return {
    data: tweets,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: countResult,
      totalPages,
    },
  };
}

/**
 * 获取最近24小时涨幅最高的5条推文及相关信息
 *
 * @returns 涨幅最高的推文信息、用户信息、项目信息及提及统计
 */
export async function getTop24hGainTweets() {
  return withServerResult(async () => {
    // 设置24小时前的时间点
    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - 24);

    // 设置7天前的时间点（用于查找提及的用户）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 查询涨幅最高的推文，获取多于5条以确保去重后仍有5条
    const allTweets = await db
      .select({
        // 推文信息
        id: tweetInfo.id,
        tweetCreatedAt: tweetInfo.tweetCreatedAt,
        tweetUrl: tweetInfo.tweetUrl,
        highRate24H: tweetInfo.highRate24H,
        signalPrice: tweetInfo.signalPrice,

        // 用户信息
        userId: tweetUsers.id,
        userName: tweetUsers.name,
        userScreenName: tweetUsers.screenName,
        userAvatar: tweetUsers.avatar,

        // 项目信息
        projectId: projects.id,
        projectSymbol: projects.symbol,
        projectLogo: projects.logo,

        // 统计7天内提及该项目的用户数量（排除当前用户）
        mentionUserCount: sql`(
          SELECT COUNT(DISTINCT ti.tweet_user_id)
          FROM ${tweetInfo} ti
          WHERE ti.project_id = ${tweetInfo.projectId}
          AND ti.tweet_created_at BETWEEN ${timeAgo.toISOString()} AND NOW()
          AND ti.tweet_user_id != ${tweetInfo.tweetUserId}
        )`.as("mentionUserCount"),

        // 7天内提及该项目的用户信息（头像和ID）（排除当前用户）
        mentionUsers: sql`(
          SELECT jsonb_agg(DISTINCT jsonb_build_object(
            'id', tu.id,
            'avatar', tu.avatar
          ))
          FROM ${tweetInfo} ti
          JOIN ${tweetUsers} tu ON ti.tweet_user_id = tu.id
          WHERE ti.project_id = ${tweetInfo.projectId}
          AND ti.tweet_created_at BETWEEN ${timeAgo.toISOString()} AND NOW()
          AND ti.tweet_user_id != ${tweetInfo.tweetUserId}
        )`.as("mentionUsers"),
      })
      .from(tweetInfo)
      .leftJoin(tweetUsers, eq(tweetInfo.tweetUserId, tweetUsers.id))
      .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
      .where(
        and(
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
          // 确保涨幅为正数
          sql`${tweetInfo.highRate24H}::numeric > 0`
        )
      )
      .orderBy(desc(tweetInfo.highRate24H)) // 按涨幅降序排序
      .limit(15) // 获取多于5条以确保去重后仍有5条
      .execute();

    // 在内存中对数据进行去重处理
    const tweetMap = new Map();

    for (const tweet of allTweets) {
      const key = `${tweet.userId}-${tweet.projectId}`; // 使用用户ID和项目ID组合作为键

      // 如果这个组合还没有被处理过，或者当前推文的涨幅高于已有的
      if (
        !tweetMap.has(key) ||
        parseFloat(String(tweet.highRate24H)) >
          parseFloat(String(tweetMap.get(key).highRate24H))
      ) {
        tweetMap.set(key, tweet);
      }
    }

    // 将Map中的值转换成数组并截取前5条
    const uniqueTweets = Array.from(tweetMap.values()).slice(0, 5);

    // 处理结果，将用户信息和项目信息格式化为更易于前端使用的结构
    const formattedResults = uniqueTweets.map((tweet) => ({
      tweet: {
        id: tweet.id,
        createdAt: tweet.tweetCreatedAt,
        url: tweet.tweetUrl,
        highRate24H: tweet.highRate24H,
        signalPrice: tweet.signalPrice,
      },
      user: {
        id: tweet.userId,
        name: tweet.userName,
        screenName: tweet.userScreenName,
        avatar: tweet.userAvatar,
      },
      project: {
        id: tweet.projectId,
        symbol: tweet.projectSymbol,
        logo: tweet.projectLogo,
      },
      mentions: {
        count: tweet.mentionUserCount,
        users: tweet.mentionUsers || [],
      },
    }));

    return formattedResults;
  });
}
