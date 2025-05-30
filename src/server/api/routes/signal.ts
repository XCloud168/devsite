"use server";

import { ITEMS_PER_PAGE, SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import {
  announcement,
  exchange,
  news,
  newsEntity,
  projects,
  signals,
  signalsCategory,
  tweetInfo,
  tweetUsers,
} from "@/server/db/schema";
import { and, count, eq, inArray, lte, sql } from "drizzle-orm";
import { getUserProfile } from "./auth";

/**
 * 获取信号类别
 * @returns 信号类别
 */
export async function getSignalCategories() {
  return withServerResult(async () => {
    const categories = await db.query.signalsCategory.findMany({
      orderBy: (signalsCategory, { asc }) => [asc(signalsCategory.sort)],
    });
    return categories;
  });
}

/**
 * 分页获取信号列表
 * @param page 页码
 * @param filter 过滤条件
 * @param filter.providerType 提供者类型
 * @param filter.entityId 实体ID
 * @param filter.providerId 提供者ID
 * @param filter.signalId 信号ID
 * @returns 信号列表
 */
export async function getSignalsByPaginated(
  page = 1,
  filter: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
    providerId?: string;
    signalId?: string;
  },
) {
  return withServerResult(async () => {
    let filterTimestamp;
    const user = await getUserProfile();
    // 检查三种情况：未登录、非会员、会员过期
    if (
      !user?.membershipExpiredAt ||
      new Date(user?.membershipExpiredAt) < new Date()
    ) {
      // 未登录用户、非会员用户或会员过期用户返回24h前的信号
      filterTimestamp = new Date().getTime() - 24 * 60 * 60 * 1000;
    }

    // 构建查询条件
    const conditions = [];

    // 类别ID条件
    if (filter.categoryId) {
      conditions.push(eq(signals.categoryId, filter.categoryId));
    }

    // 时间戳条件
    if (filterTimestamp) {
      conditions.push(lte(signals.signalTime, new Date(filterTimestamp)));
    }

    // 提供者类型条件
    if (filter.providerType) {
      conditions.push(eq(signals.providerType, filter.providerType));
    }

    // 提供者ID条件
    if (filter.providerId) {
      conditions.push(eq(signals.providerId, filter.providerId));
    }

    // 信号ID条件
    if (filter.signalId) {
      conditions.push(eq(signals.id, filter.signalId));
    }

    // 实体ID条件
    if (filter.entityId) {
      conditions.push(eq(signals.entityId, filter.entityId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 并行执行分页查询和计数查询
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // 明确列出所有字段，避免类型问题
    const pagedSignals = db.$with("paged_signals").as(
      db
        .select({
          id: signals.id,
          status: signals.status,
          dateCreated: signals.dateCreated,
          notifyContent: signals.notifyContent,
          aiSummary: signals.aiSummary,
          signalTime: signals.signalTime,
          projectId: signals.projectId,
          categoryId: signals.categoryId,
          mediaUrls: signals.mediaUrls,
          tags: signals.tags,
          providerId: signals.providerId,
          entityId: signals.entityId,
          isAccurate: signals.isAccurate,
          accuracy_rate: signals.accuracy_rate,
          providerType: signals.providerType,
        })
        .from(signals)
        .where(whereClause)
        .orderBy(sql`signal_time DESC`)
        .limit(ITEMS_PER_PAGE)
        .offset(offset),
    );

    // 查询 project、category 详情
    const [items, countResult] = await Promise.all([
      db
        .with(pagedSignals)
        .select({
          id: pagedSignals.id,
          status: pagedSignals.status,
          dateCreated: pagedSignals.dateCreated,
          notifyContent: pagedSignals.notifyContent,
          aiSummary: pagedSignals.aiSummary,
          signalTime: pagedSignals.signalTime,
          projectId: pagedSignals.projectId,
          categoryId: pagedSignals.categoryId,
          mediaUrls: pagedSignals.mediaUrls,
          tags: pagedSignals.tags,
          providerId: pagedSignals.providerId,
          entityId: pagedSignals.entityId,
          isAccurate: pagedSignals.isAccurate,
          accuracy_rate: pagedSignals.accuracy_rate,
          providerType: pagedSignals.providerType,
          times: sql<number>`(
            SELECT COUNT(*)
            FROM ${signals} si
            WHERE si.project_id = paged_signals.project_id
              AND si.entity_id = paged_signals.entity_id
              AND si.signal_time BETWEEN paged_signals.signal_time - INTERVAL '7 days' AND paged_signals.signal_time
          )`,
          hitKOLs: sql<any[]>`(
            SELECT jsonb_agg(DISTINCT jsonb_build_object(
              'id', tu.id, 'name', tu.name, 'avatar', tu.avatar
            ))
            FROM ${tweetInfo} ti
            JOIN ${tweetUsers} tu ON ti.tweet_user_id = tu.id
            WHERE ti.project_id = paged_signals.project_id
              AND ti.signal_time BETWEEN paged_signals.signal_time - INTERVAL '7 days' AND paged_signals.signal_time
          )`,
          project: sql<any>`(
            SELECT json_build_object(
              'id', id,
              'name', name,
              'symbol', symbol,
              'logo', logo
            )
            FROM site_projects
            WHERE id = paged_signals.project_id
            LIMIT 1
          )`,
          category: sql<any>`(
            SELECT json_build_object(
              'id', id,
              'name', name,
              'code', code,
              'sort', sort
            )
            FROM site_signals_category
            WHERE id = paged_signals.category_id
            LIMIT 1
          )`,
        })
        .from(pagedSignals)
        .execute(),
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

    // 定义每种类型需要查询的字段
    const contentQueries = [];

    if (groupedByProviderType.twitter?.length) {
      contentQueries.push(
        db
          .select({
            id: tweetInfo.id,
            content: tweetInfo.content,
            contentSummary: tweetInfo.contentSummary,
            signalTime: tweetInfo.signalTime,
            projectId: tweetInfo.projectId,
            tweetUserId: tweetInfo.tweetUserId,
            tweetUrl: tweetInfo.tweetUrl,
            sentiment: tweetInfo.sentiment,
            imagesUrls: tweetInfo.imagesUrls,
            videoUrls: tweetInfo.videoUrls,
            highRate24H: tweetInfo.highRate24H,
            lowRate24H: tweetInfo.lowRate24H,
            highRate7D: tweetInfo.highRate7D,
            lowRate7D: tweetInfo.lowRate7D,
            highRate30D: tweetInfo.highRate30D,
            lowRate30D: tweetInfo.lowRate30D,
            isAccurate: tweetInfo.isAccurate,
            accuracy_rate: tweetInfo.accuracy_rate,
            project: sql<any>`json_build_object(
              'id', ${projects.id},
              'name', ${projects.name},
              'symbol', ${projects.symbol},
              'logo', ${projects.logo}
            )`,
            tweetUser: sql<any>`json_build_object(
              'id', ${tweetUsers.id},
              'name', ${tweetUsers.name},
              'avatar', ${tweetUsers.avatar}
            )`,
            replyTweet: sql<any>`(
              SELECT json_build_object(
                'id', rt.id,
                'content', rt.content,
                'tweetUser', json_build_object(
                  'id', rtu.id,
                  'name', rtu.name,
                  'avatar', rtu.avatar
                )
              )
              FROM ${tweetInfo} rt
              JOIN ${tweetUsers} rtu ON rt.tweet_user_id = rtu.id
              WHERE rt.id = ${tweetInfo.replyTweetId}
              LIMIT 1
            )`,
            quotedTweet: sql<any>`(
              SELECT json_build_object(
                'id', qt.id,
                'content', qt.content,
                'tweetUser', json_build_object(
                  'id', qtu.id,
                  'name', qtu.name,
                  'avatar', qtu.avatar
                )
              )
              FROM ${tweetInfo} qt
              JOIN ${tweetUsers} qtu ON qt.tweet_user_id = qtu.id
              WHERE qt.id = ${tweetInfo.quotedTweet}
              LIMIT 1
            )`,
            retweetTweet: sql<any>`(
              SELECT json_build_object(
                'id', rtt.id,
                'content', rtt.content,
                'tweetUser', json_build_object(
                  'id', rttu.id,
                  'name', rttu.name,
                  'avatar', rttu.avatar
                )
              )
              FROM ${tweetInfo} rtt
              JOIN ${tweetUsers} rttu ON rtt.tweet_user_id = rttu.id
              WHERE rtt.id = ${tweetInfo.retweetTweetId}
              LIMIT 1
            )`,
          })
          .from(tweetInfo)
          .leftJoin(tweetUsers, eq(tweetInfo.tweetUserId, tweetUsers.id))
          .leftJoin(projects, eq(tweetInfo.projectId, projects.id))
          .where(inArray(tweetInfo.id, groupedByProviderType.twitter))
          .then((results) => ({
            type: SIGNAL_PROVIDER_TYPE.TWITTER,
            details: results.reduce(
              (acc, detail) => {
                acc[detail.id] = {
                  ...detail,
                  id: detail.id,
                  projectId: detail.projectId,
                  tweetUserId: detail.tweetUserId,
                  tweetUrl: detail.tweetUrl || "/",
                  project: detail.project || null,
                  tweetUser: detail.tweetUser || null,
                  replyTweet: detail.replyTweet || null,
                  quotedTweet: detail.quotedTweet || null,
                  retweetTweet: detail.retweetTweet || null,
                };
                return acc;
              },
              {} as Record<string, any>,
            ),
          })),
      );
    }

    if (groupedByProviderType.announcement?.length) {
      contentQueries.push(
        db
          .select({
            id: announcement.id,
            content: announcement.content,
            contentSummary: announcement.contentSummary,
            signalTime: announcement.signalTime,
            projectId: announcement.projectId,
            exchangeId: announcement.exchangeId,
            source: announcement.source,
            highRate24H: announcement.highRate24H,
            lowRate24H: announcement.lowRate24H,
            highRate7D: announcement.highRate7D,
            lowRate7D: announcement.lowRate7D,
            highRate30D: announcement.highRate30D,
            lowRate30D: announcement.lowRate30D,
            isAccurate: announcement.isAccurate,
            accuracy_rate: announcement.accuracy_rate,
            project: sql<any>`json_build_object(
              'id', ${projects.id},
              'name', ${projects.name},
              'symbol', ${projects.symbol},
              'logo', ${projects.logo}
            )`,
            exchange: sql<any>`json_build_object(
              'id', ${exchange.id},
              'name', ${exchange.name},
              'logo', ${exchange.logo}
            )`,
          })
          .from(announcement)
          .leftJoin(projects, eq(announcement.projectId, projects.id))
          .leftJoin(exchange, eq(announcement.exchangeId, exchange.id))
          .where(inArray(announcement.id, groupedByProviderType.announcement))
          .then((results) => ({
            type: SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT,
            details: results.reduce(
              (acc, detail) => {
                acc[detail.id] = {
                  ...detail,
                  id: detail.id,
                  projectId: detail.projectId,
                  exchangeId: detail.exchangeId,
                  source: detail.source || "/",
                  project: detail.project || null,
                  exchange: detail.exchange || null,
                };
                return acc;
              },
              {} as Record<string, any>,
            ),
          })),
      );
    }

    if (groupedByProviderType.news?.length) {
      contentQueries.push(
        db
          .select({
            id: news.id,
            content: news.content,
            contentSummary: news.contentSummary,
            signalTime: news.signalTime,
            projectId: news.projectId,
            newsEntityId: news.newsEntityId,
            source: news.source,
            highRate24H: news.highRate24H,
            lowRate24H: news.lowRate24H,
            highRate7D: news.highRate7D,
            lowRate7D: news.lowRate7D,
            highRate30D: news.highRate30D,
            lowRate30D: news.lowRate30D,
            isAccurate: news.isAccurate,
            accuracy_rate: news.accuracy_rate,
            project: sql<any>`json_build_object(
              'id', ${projects.id},
              'name', ${projects.name},
              'symbol', ${projects.symbol},
              'logo', ${projects.logo}
            )`,
            newsEntity: sql<any>`json_build_object(
              'id', ${newsEntity.id},
              'name', ${newsEntity.name},
              'logo', ${newsEntity.logo}
            )`,
          })
          .from(news)
          .leftJoin(projects, eq(news.projectId, projects.id))
          .leftJoin(newsEntity, eq(news.newsEntityId, newsEntity.id))
          .where(inArray(news.id, groupedByProviderType.news))
          .then((results) => ({
            type: SIGNAL_PROVIDER_TYPE.NEWS,
            details: results.reduce(
              (acc, detail) => {
                acc[detail.id] = {
                  ...detail,
                  id: detail.id,
                  projectId: detail.projectId,
                  newsEntityId: detail.newsEntityId,
                  source: detail.source || "/",
                  project: detail.project || null,
                  newsEntity: detail.newsEntity || null,
                };
                return acc;
              },
              {} as Record<string, any>,
            ),
          })),
      );
    }

    // 并行执行所有查询
    const contentResults = await Promise.all(contentQueries);

    // 创建内容映射
    const contentMap = contentResults.reduce(
      (acc, result) => {
        acc[result.type] = result.details;
        return acc;
      },
      {} as Record<SIGNAL_PROVIDER_TYPE, Record<string, any>>,
    );

    // 一次性组装所有内容
    const itemsWithContent = items.map((item) => {
      const source =
        item.providerType && item.providerId
          ? contentMap[item.providerType]?.[item.providerId]
          : undefined;
      // 保证关联字段结构完整
      return {
        ...item,
        source: {
          ...source,
          // project 结构兜底
          project: source?.project ?? {
            id: "",
            name: "",
            symbol: "",
            logo: "",
          },
          // tweetUser 结构兜底
          tweetUser: source?.tweetUser ?? { id: "", name: "", avatar: "" },
          // exchange 结构兜底
          exchange: source?.exchange ?? { id: "", name: "", logo: "" },
          // newsEntity 结构兜底
          newsEntity: source?.newsEntity ?? { id: "", name: "", logo: "" },
        },
      };
    });

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
 * 根据信号类别获取信号实体
 * @param categoryId 信号类别ID
 * @returns 信号实体
 */
export async function getSignalEntitiesByCategory(categoryId: string) {
  return withServerResult(async () => {
    const category = await db.query.signalsCategory.findFirst({
      where: eq(signalsCategory.id, categoryId),
    });

    if (!category) {
      return [];
    }

    // 从信号中获取所有的providerType
    const providers = await db
      .selectDistinct({
        providerType: signals.providerType,
        entityId: signals.entityId,
      })
      .from(signals)
      .where(eq(signals.categoryId, category.id));

    // 按类型分组收集 entityId
    const announcementIds: string[] = [];
    const newsIds: string[] = [];
    const twitterIds: string[] = [];
    for (const provider of providers) {
      if (provider.providerType === SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT) {
        announcementIds.push(provider.entityId);
      } else if (provider.providerType === SIGNAL_PROVIDER_TYPE.NEWS) {
        newsIds.push(provider.entityId);
      } else if (provider.providerType === SIGNAL_PROVIDER_TYPE.TWITTER) {
        twitterIds.push(provider.entityId);
      }
    }

    const [announcementTags, newsTags, twitterTags] = await Promise.all([
      announcementIds.length
        ? db
            .select({
              id: exchange.id,
              name: exchange.name,
              logo: exchange.logo,
              providerType: sql`${SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT}`,
            })
            .from(exchange)
            .where(inArray(exchange.id, announcementIds))
        : [],
      newsIds.length
        ? db
            .select({
              id: newsEntity.id,
              name: newsEntity.name,
              logo: newsEntity.logo,
              providerType: sql`${SIGNAL_PROVIDER_TYPE.NEWS}`,
            })
            .from(newsEntity)
            .where(inArray(newsEntity.id, newsIds))
        : [],
      twitterIds.length
        ? db
            .select({
              id: tweetUsers.id,
              name: tweetUsers.name,
              logo: tweetUsers.avatar,
              providerType: sql`${SIGNAL_PROVIDER_TYPE.TWITTER}`,
            })
            .from(tweetUsers)
            .where(inArray(tweetUsers.id, twitterIds))
        : [],
    ]);

    let tags = [...announcementTags, ...newsTags, ...twitterTags];
    tags = tags.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return tags;
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
    entityId: string;
  },
) {
  return withServerResult(async () => {
    const conditions = [];
    let tags = [];

    switch (type) {
      case SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT:
        if (filter.entityId) {
          conditions.push(eq(signals.entityId, filter.entityId));
        }
        conditions.push(
          eq(signals.providerType, SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT),
        );

        const whereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        tags = await db
          .select({
            id: signals.entityId,
            name: exchange.name,
            logo: exchange.logo,
            signalsCount: count(
              sql`CASE WHEN ${announcement.projectId} IS NOT NULL THEN 1 ELSE NULL END`,
            ),
            riseCount: count(
              sql`CASE WHEN ${announcement.highRate24H}::numeric > 0 THEN 1 ELSE NULL END`,
            ),
            fallCount: count(
              sql`CASE WHEN ${announcement.lowRate24H}::numeric < 0 THEN 1 ELSE NULL END`,
            ),
            avgRiseRate: sql`ROUND(AVG(${announcement.highRate24H}), 2)`,
            avgFallRate: sql`ROUND(AVG(${announcement.lowRate24H}), 2)`,
            projectIds: sql`COALESCE(jsonb_agg(DISTINCT ${signals.projectId}) FILTER (WHERE ${announcement.highRate24H}::numeric > 0), jsonb '[]')`,
          })
          .from(signals)
          .leftJoin(announcement, eq(signals.providerId, announcement.id))
          .leftJoin(exchange, eq(signals.entityId, exchange.id))
          .where(whereClause)
          .groupBy(signals.entityId, exchange.name, exchange.logo);
        break;

      case SIGNAL_PROVIDER_TYPE.NEWS:
        if (filter.entityId) {
          conditions.push(eq(signals.entityId, filter.entityId));
        }
        conditions.push(eq(signals.providerType, SIGNAL_PROVIDER_TYPE.NEWS));

        const newsWhereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        tags = await db
          .select({
            id: signals.entityId,
            name: newsEntity.name,
            logo: newsEntity.logo,
            signalsCount: count(
              sql`CASE WHEN ${news.projectId} IS NOT NULL THEN 1 ELSE NULL END`,
            ),
            riseCount: count(
              sql`CASE WHEN ${news.highRate24H}::numeric > 0 THEN 1 ELSE NULL END`,
            ),
            fallCount: count(
              sql`CASE WHEN ${news.lowRate24H}::numeric < 0 THEN 1 ELSE NULL END`,
            ),
            avgRiseRate: sql`ROUND(AVG(${news.highRate24H}), 2)`,
            avgFallRate: sql`ROUND(AVG(${news.lowRate24H}), 2)`,
            projectIds: sql`COALESCE(jsonb_agg(DISTINCT ${signals.projectId}) FILTER (WHERE ${news.highRate24H}::numeric > 0), jsonb '[]')`,
          })
          .from(signals)
          .leftJoin(news, eq(signals.providerId, news.id))
          .leftJoin(newsEntity, eq(signals.entityId, newsEntity.id))
          .where(newsWhereClause)
          .groupBy(signals.entityId, newsEntity.name, newsEntity.logo);
        break;

      case SIGNAL_PROVIDER_TYPE.TWITTER:
      default:
        if (filter.entityId) {
          conditions.push(eq(signals.entityId, filter.entityId));
        }
        conditions.push(eq(signals.providerType, SIGNAL_PROVIDER_TYPE.TWITTER));

        const tweetWhereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        tags = await db
          .select({
            id: signals.entityId,
            name: tweetUsers.name,
            logo: tweetUsers.avatar,
            signalsCount: count(
              sql`CASE WHEN ${tweetInfo.projectId} IS NOT NULL THEN 1 ELSE NULL END`,
            ),
            riseCount: count(
              sql`CASE WHEN ${tweetInfo.highRate24H}::numeric > 0 THEN 1 ELSE NULL END`,
            ),
            fallCount: count(
              sql`CASE WHEN ${tweetInfo.lowRate24H}::numeric < 0 THEN 1 ELSE NULL END`,
            ),
            avgRiseRate: sql`ROUND(AVG(${tweetInfo.highRate24H}), 2)`,
            avgFallRate: sql`ROUND(AVG(${tweetInfo.lowRate24H}), 2)`,
          })
          .from(signals)
          .leftJoin(tweetInfo, eq(signals.providerId, tweetInfo.id))
          .leftJoin(tweetUsers, eq(signals.entityId, tweetUsers.id))
          .where(tweetWhereClause)
          .groupBy(signals.entityId, tweetUsers.name, tweetUsers.avatar);
        break;
    }

    return tags;
  });
}
