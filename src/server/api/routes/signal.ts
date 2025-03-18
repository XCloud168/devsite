import { ITEMS_PER_PAGE, SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import {
  announcement,
  exchange,
  signals,
  tweetInfo,
  tweetUsers,
} from "@/server/db/schema";
import { and, count, eq, inArray, isNotNull, lte, sql } from "drizzle-orm";
import { getUserProfile } from "./auth";
/**
 * 分页获取信号列表
 * @param page 页码
 * @param filter 过滤条件
 * @param filter.providerType 提供者类型
 * @param filter.providerId 提供者ID
 * @returns 信号列表
 */
export async function getSignalsByPaginated(
  page = 1,
  filter: {
    providerType: SIGNAL_PROVIDER_TYPE;
    providerId?: string;
  },
) {
  return withServerResult(async () => {
    let filterTimestamp;
    const user = await getUserProfile();
    if (!user) {
      // 未登录用户返回24h前的信号
      filterTimestamp = new Date().getTime() - 24 * 60 * 60 * 1000;
    }

    // 构建查询条件
    const conditions = [];

    // 时间戳条件
    if (filterTimestamp) {
      conditions.push(lte(signals.signalTime, new Date(filterTimestamp)));
    }

    // 提供者类型条件
    conditions.push(eq(signals.providerType, filter.providerType));

    // 提供者ID条件
    if (filter.providerId) {
      conditions.push(eq(signals.providerId, filter.providerId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 并行执行分页查询和计数查询
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const [items, countResult] = await Promise.all([
      // 获取分页数据
      db.query.signals.findMany({
        where: whereClause,
        with: {
          project: true,
          signalsTag: true,
        },
        extras: {
          times: sql<number>`(SELECT COUNT(*)
            FROM ${signals} si
            WHERE si.project_id = ${signals.projectId}
            AND si.entity_id = ${signals.entityId}
            AND si.signal_time >= NOW() - INTERVAL '7 days')`.as("times"),
          hitKOLs: sql<any[]>`(SELECT jsonb_agg(DISTINCT jsonb_build_object(
              'id', tu.id,
              'name', tu.name,
              'avatar', tu.avatar
            ))
            FROM ${tweetInfo} ti
            JOIN ${tweetUsers} tu ON ti.tweet_user_id = tu.id
            WHERE ti.project_id = ${signals.projectId}
            AND ti.signal_time >= NOW() - INTERVAL '7 days')`.as("hitKOLs"),
        },
        orderBy: (signals, { desc }) => [desc(signals.signalTime)],
        limit: ITEMS_PER_PAGE,
        offset,
      }),
      // 使用 count() 直接获取总数
      db.select({ value: count() }).from(signals).where(whereClause),
    ]);

    // 分组信号
    const groupedByProviderType = items.reduce(
      (acc, signal) => {
        if (signal.providerType && signal.providerId) {
          if (!acc[signal.providerType]) {
            acc[signal.providerType] = [];
          }
          acc[signal.providerType].push(signal.providerId);
        }
        return acc;
      },
      {} as Record<SIGNAL_PROVIDER_TYPE, string[]>,
    );

    const itemsWithContent = [];

    // 组装信号内容
    if (groupedByProviderType.twitter) {
      const tweetDetails = await db.query.tweetInfo.findMany({
        where: inArray(tweetInfo.id, groupedByProviderType.twitter),
        with: {
          project: true,
          tweetUser: true,
        },
      });
      const tweetDetailsMap = tweetDetails.reduce(
        (acc, detail) => {
          acc[detail.id] = detail;
          return acc;
        },
        {} as Record<string, any>,
      );

      itemsWithContent.push(
        ...items.map((item) => ({
          ...item,
          source:
            item.providerType === SIGNAL_PROVIDER_TYPE.TWITTER &&
            item.providerId
              ? tweetDetailsMap[item.providerId]
              : null,
        })),
      );
    }

    // 如果有其他 providerType，比如 announcement
    if (groupedByProviderType.announcement) {
      const announcementDetails = await db.query.announcement.findMany({
        where: inArray(announcement.id, groupedByProviderType.announcement),
        with: {
          project: true,
          exchange: true,
        },
      });
      const announcementDetailsMap = announcementDetails.reduce(
        (acc, detail) => {
          acc[detail.id] = detail;
          return acc;
        },
        {} as Record<string, any>,
      );

      itemsWithContent.push(
        ...items.map((item) => ({
          ...item,
          source:
            item.providerType === SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT &&
            item.providerId
              ? announcementDetailsMap[item.providerId]
              : null,
        })),
      );
    }

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return {
      items: itemsWithContent,
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
 * 根据信号类别获取信号标签
 * @param type 信号类型
 * @returns 信号标签
 */
export async function getSignalTagsByType(type: SIGNAL_PROVIDER_TYPE) {
  return withServerResult(async () => {
    if (type === SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT) {
      const tags = await db.query.exchange.findMany({});
      return tags;
    }
  });
}

/**
 * 获取信号标签统计
 *
 * 返回示例：
 * [{
      id: '820ba08c-351f-43b3-b7e2-a75acd4666bc',
      name: 'Okx',
      logo: 'https://www.okx.com/static/images/logo/logo_okx.png',
      signalsCount: 6,
      riseCount: 6,
      fallCount: 6,
      avgRiseRate: '0.00',
      avgFallRate: '0.00'
    }]
 *
 * @param type 信号类型
 * @param filter 过滤条件
 * @param filter.entityId 实体ID
 * @returns 信号标签统计
 */
export async function getTagStatistics(
  type: SIGNAL_PROVIDER_TYPE,
  filter: {
    entityId?: string;
  },
) {
  return withServerResult(async () => {
    const conditions = [];
    let tags = [];

    switch (type) {
      case SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT:
        if (filter.entityId) {
          conditions.push(eq(announcement.exchangeId, filter.entityId));
        }
        conditions.push(isNotNull(announcement.exchangeId));
        conditions.push(isNotNull(announcement.projectId));

        const whereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        tags = await db
          .select({
            id: announcement.exchangeId,
            name: exchange.name,
            logo: exchange.logo,
            signalsCount: count(),
            riseCount: count(sql`${announcement.highRate24H}::numeric > 0`),
            fallCount: count(sql`${announcement.lowRate24H}::numeric < 0`),
            avgRiseRate: sql`ROUND(AVG(${announcement.highRate24H}), 2)`,
            avgFallRate: sql`ROUND(AVG(${announcement.lowRate24H}), 2)`,
            projectIds: sql`COALESCE(jsonb_agg(DISTINCT ${announcement.projectId}) FILTER (WHERE ${announcement.highRate24H}::numeric > 0), jsonb '[]')`,
          })
          .from(announcement)
          .leftJoin(exchange, eq(announcement.exchangeId, exchange.id))
          .where(whereClause)
          .groupBy(announcement.exchangeId, exchange.name, exchange.logo);
        break;
      case SIGNAL_PROVIDER_TYPE.TWITTER:
      default:
        if (filter.entityId) {
          conditions.push(eq(tweetInfo.projectId, filter.entityId));
        }
        conditions.push(isNotNull(tweetInfo.projectId));

        const tweetWhereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        tags = await db
          .select({
            id: tweetUsers.id,
            name: tweetUsers.name,
            logo: tweetUsers.avatar,
            signalsCount: count(),
            riseCount: count(sql`${tweetInfo.highRate24H}::numeric > 0`),
            fallCount: count(sql`${tweetInfo.lowRate24H}::numeric < 0`),
            avgRiseRate: sql`ROUND(AVG(${tweetInfo.highRate24H}), 2)`,
            avgFallRate: sql`ROUND(AVG(${tweetInfo.lowRate24H}), 2)`,
          })
          .from(tweetInfo)
          .leftJoin(tweetUsers, eq(tweetInfo.tweetUserId, tweetUsers.id))
          .where(tweetWhereClause)
          .groupBy(tweetUsers.id, tweetUsers.name, tweetUsers.avatar);
        break;
    }

    return tags;
  });
}
