"use server";

import { db } from "@/server/db";
import { tweetInfo, tweetUsers } from "@/server/db/schemas/tweet";
import { and, count, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { withServerResult } from "@/lib/server-result";
import { type USER_TYPE } from "@/types/constants";

/**
 * 获取Twitter用户24小时涨幅排行榜
 * 
 * @param period 统计周期，默认为24小时，可选7天或30天
 * @returns Twitter用户涨幅统计
 */
export async function getTwitterUserGains(period: number = 24) {
  return withServerResult(async () => {
    // 确定要使用的时间周期和对应的字段
    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - period);
    
    // 根据period选择不同的字段
    let highRateField, lowRateField;
    let dateRangeCondition = and(
      isNotNull(tweetInfo.projectId),
      gt(tweetInfo.dateCreated, timeAgo)
    );
    
    if (period <= 24) {
      // 24小时内的数据
      highRateField = tweetInfo.highRate24H;
      lowRateField = tweetInfo.lowRate24H;
    } else if (period <= 7 * 24) {
      // 7天内的数据
      //highRateField = tweetInfo.highRate7D;
      //lowRateField = tweetInfo.lowRate7D;
      highRateField = tweetInfo.highRate24H;
      lowRateField = tweetInfo.lowRate24H;
    } else {
      // 30天内的数据
      //highRateField = tweetInfo.highRate30D;
      // lowRateField = tweetInfo.lowRate30D;
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
        followersCount: tweetUsers.followersCount,
        // 统计数据
        signalsCount: count(tweetInfo.id),
        maxHighRate: sql`MAX(${highRateField})`,
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
          gt(tweetInfo.dateCreated, timeAgo)
        )
      )
      .groupBy(
        tweetUsers.id, 
        tweetUsers.name, 
        tweetUsers.screenName, 
        tweetUsers.followersCount
      )
      .orderBy(sql`MAX(${highRateField})::numeric DESC`)
      .limit(50);

    return stats;
  });
}
