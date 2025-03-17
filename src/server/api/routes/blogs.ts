import "server-only";

import { db } from "@/server/db";
import { blogs } from "@/server/db/schema";
import type { Blog } from "@/types/blogs";
import { type Paginated } from "@/types/pagination";
import { count, desc } from "drizzle-orm";

export const ITEMS_PER_PAGE = 10;

export async function getPaginatedBlogs(
  page = 1,
): Promise<Paginated<Blog>> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // 并行执行分页查询和计数查询
  const [items, countResult] = await Promise.all([
    // 获取分页数据
    db.query.blogs.findMany({
      with: {
        author: true,
      },
      orderBy: [desc(blogs.createdAt)],
      limit: ITEMS_PER_PAGE,
      offset,
    }),
    // 使用 count() 直接获取总数
    db.select({ count: count() }).from(blogs),
  ]);

  const totalCount = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    data: items,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
