"use client";

import { Pagination } from "../../../components/pagination";
import type { Blog } from "@/types/blogs";
import type { Paginated } from "@/types/pagination";

// 假设有一个获取博客数据的函数返回值可以用来推导类型
type BlogsListProps = {
  data: Paginated<Blog>;
};

export function BlogsList({ data }: BlogsListProps) {
  const { data: allBlogs, pagination } = data;

  return (
    <>
      <div className="grid gap-6">
        {allBlogs.map((blog) => (
          <article key={blog.id} className="rounded-lg bg-card p-6 shadow">
            <h2 className="mb-2 text-2xl font-semibold">
              {blog.title || "Untitled"}
            </h2>
            <div className="text-sm text-muted-foreground">
              By {blog.author?.username || "Unknown"} on{" "}
              {blog.createdAt.toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Pagination {...pagination} />
      </div>
    </>
  );
}
