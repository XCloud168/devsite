import { ITEMS_PER_PAGE } from "@/lib/constants";
import { withServerResult } from "@/lib/server-result";
import { db } from "@/server/db";
import { announcement, signals, tweetInfo } from "@/server/db/schema";
import { type SIGNAL_PROVIDER_TYPE } from "@/types/constants";
import { and, count, eq, inArray, lte } from "drizzle-orm";
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
            item.providerType === "twitter" && item.providerId
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
            item.providerType === "announcement" && item.providerId
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
