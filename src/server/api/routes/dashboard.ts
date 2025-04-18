"use server";

import { db } from "@/server/db";
import { tweetInfo, tweetUsers } from "@/server/db/schemas/tweet";
import { and, count, desc, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { withServerResult } from "@/lib/server-result";
import { type USER_TYPE } from "@/types/constants";
import { projects } from "@/server/db/schemas/signal";

/**
 * 获取Twitter用户涨幅排行榜
 * 
 * @param period 统计周期，默认为"24h"，可选"7d"或"30d"
 * @returns Twitter用户涨幅统计
 */
export async function getTwitterUserGains(period: string = "24h") {
  return withServerResult(async () => {
    // 确定要使用的时间周期和对应的字段
    const timeAgo = new Date();
    
    // 根据period选择不同的字段和时间范围
    let highRateField, lowRateField;
    
    if (period === "24h") {
      // 24小时内的数据
      timeAgo.setHours(timeAgo.getHours() - 24);
      highRateField = tweetInfo.highRate24H;
      lowRateField = tweetInfo.lowRate24H;
    } else if (period === "7d") {
      // 7天内的数据
      timeAgo.setDate(timeAgo.getDate() - 7);
      highRateField = tweetInfo.highRate24H; // 仍使用24h的数据
      lowRateField = tweetInfo.lowRate24H;
    } else if (period === "30d") {
      // 30天内的数据
      timeAgo.setDate(timeAgo.getDate() - 30);
      highRateField = tweetInfo.highRate24H; // 仍使用24h的数据
      lowRateField = tweetInfo.lowRate24H;
    } else {
      // 默认使用24小时
      timeAgo.setHours(timeAgo.getHours() - 24);
      highRateField = tweetInfo.highRate24H;
      lowRateField = tweetInfo.lowRate24H;
    }

    // 只查询指定类型的用户
    const allowedUserTypes = ['user_follow', 'kol_opinions', 'institution_projects', 'super_influencer'] as USER_TYPE[];
    
    // 查询并统计数据
    const stats = await db
      .select({
        id: tweetUsers.id,
        name: tweetUsers.name,
        screenName: tweetUsers.screenName,
        avatar: tweetUsers.avatar,
        followersCount: tweetUsers.followersCount,
        // 统计数据
        signalsCount: count(tweetInfo.id),
        maxHighRate: sql`MAX(${highRateField})`,
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
        positiveRatePercentage: sql`ROUND(
          COUNT(CASE WHEN ${highRateField}::numeric > 0 THEN 1 ELSE NULL END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN ${highRateField} IS NOT NULL THEN 1 ELSE NULL END), 0),
          2
        )`,
      })
      .from(tweetUsers)
      .leftJoin(tweetInfo, eq(tweetUsers.id, tweetInfo.tweetUserId))
      .where(
        and(
          inArray(tweetUsers.userType, allowedUserTypes),
          isNotNull(tweetInfo.projectId),
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`
        )
      )
      .groupBy(
        tweetUsers.id, 
        tweetUsers.name, 
        tweetUsers.screenName,
        tweetUsers.avatar,
        tweetUsers.followersCount
      )
      .orderBy(sql`MAX(${highRateField})::numeric DESC`)
      .limit(50);

    return stats;
  });
}

type ProjectStats = {
  projectId: string;
  symbol: string;
  logo: string;
  mentionCount: number;
  firstPrice: number;
  highestPrice: number;
  highestRate: number;
};

/**
 * 获取单个Twitter用户的详细统计数据
 * 
 * @param userId Twitter用户ID
 * @param period 统计周期，默认为"7d"，可选"30d"
 * @returns 用户统计数据
 */
export async function getTwitterUserStats(userId: string, period: string = "7d") {
  return withServerResult(async () => {
    // 确定要使用的时间周期
    const timeAgo = new Date();
    const days = period === "30d" ? 30 : 7; // 默认7天
    timeAgo.setDate(timeAgo.getDate() - days);
    
    // 获取用户基本信息
    const user = await db.query.tweetUsers.findFirst({
      where: eq(tweetUsers.id, userId)
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
          sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`
        )
      )
      .groupBy(
        tweetUsers.id,
        tweetUsers.name,
        tweetUsers.screenName,
        tweetUsers.avatar,
        tweetUsers.followersCount,
        tweetUsers.description
      )
      .execute()
      .then(rows => rows[0]);
      
    // 2. 胜率趋势数据（每日胜率）
    const dailyWinRate = await getDailyWinRate(userId, days);
    
    // 3. 获取周期内推文对应的所有项目的涨跌幅数据
    const projectsPerformance = await getProjectsPerformance(userId, timeAgo);
    
    // 4. 代币维度统计 - 按提及次数统计，包含代币符号、logo、提及次数、首次提及价格、最高点价格、最高收益率
    const projectStats = await getProjectStats(userId, timeAgo);
    
    // 5. 获取用户的所有推文（周期内的）
    const tweets = await getAllTweets(userId, timeAgo);
    
    return {
      userInfo: userStats,
      dailyWinRate,
      projectsPerformance,
      projectStats,
      tweets
    };
  });
}

/**
 * 获取每日胜率趋势数据
 */
async function getDailyWinRate(userId: string, days: number) {
  // 定义返回结果的类型
  interface DailyWinRateResult {
    date: string | unknown;
    winRate: number | unknown;
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
        date: sql`TO_CHAR(${tweetInfo.dateCreated}, 'YYYY-MM-DD')`,
        winRate: sql`ROUND(
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
          sql`${tweetInfo.dateCreated} <= ${dayEnd.toISOString()}`
        )
      )
      .groupBy(sql`TO_CHAR(${tweetInfo.dateCreated}, 'YYYY-MM-DD')`)
      .execute()
      .then(rows => rows[0] || {
        date: dayStart.toISOString().split('T')[0],
        winRate: 0,
        tweetsCount: 0
      });
      
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
 * 获取项目表现数据（按涨幅排序，每个项目只返回涨幅最高的那条推文）
 */
async function getProjectsPerformance(userId: string, timeAgo: Date) {
  // 先获取每个项目的最高涨幅推文ID
  const subQuery = db
    .select({
      projectId: tweetInfo.projectId,
      maxHighRate: sql`MAX(${tweetInfo.highRate24H})`.as("maxHighRate"),
    })
    .from(tweetInfo)
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`
      )
    )
    .groupBy(tweetInfo.projectId)
    .as('subquery');

  // 主查询：获取每个项目涨幅最高的推文详情
  return await db
    .select({
      id: tweetInfo.id,
      tweetCreatedAt: tweetInfo.tweetCreatedAt,
      content: tweetInfo.content,
      highRate24H: tweetInfo.highRate24H,
      lowRate24H: tweetInfo.lowRate24H,
      projectId: projects.id,
      projectSymbol: projects.symbol,
      projectLogo: projects.logo,
    })
    .from(tweetInfo)
    .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
    .leftJoin(subQuery, eq(tweetInfo.projectId, subQuery.projectId))
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`,
        sql`${tweetInfo.highRate24H} = ${subQuery.maxHighRate}`  // 只选择每个项目涨幅最高的推文
      )
    )
    .orderBy(desc(tweetInfo.highRate24H))  // 按涨幅降序排序
    .limit(20)  // 最多返回20条记录
    .execute();
}

/**
 * 获取项目统计数据
 */
async function getProjectStats(userId: string, timeAgo: Date) {
  return await db
    .select({
      projectId: projects.id,
      symbol: projects.symbol,
      logo: projects.logo,
      mentionCount: count(tweetInfo.id),
      firstPrice: sql`MIN(${tweetInfo.signalPrice})`,
      highestPrice: sql`MAX(${tweetInfo.highPrice24H})`,
      highestRate: sql`MAX(${tweetInfo.highRate24H})`,
    })
    .from(tweetInfo)
    .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
    .where(
      and(
        eq(tweetInfo.tweetUserId, userId),
        isNotNull(tweetInfo.projectId),
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`
      )
    )
    .groupBy(projects.id, projects.symbol, projects.logo)
    .orderBy(desc(sql`COUNT(${tweetInfo.id})`))
    .execute();
}

/**
 * 获取所有推文
 */
async function getAllTweets(userId: string, timeAgo: Date) {
  return await db
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
        sql`${tweetInfo.dateCreated} > ${timeAgo.toISOString()}`
      )
    )
    .orderBy(desc(tweetInfo.dateCreated))
    .execute();
}
