"use client";

import type { PaginatedBlogs } from "@/types/blogs";
import { Pagination } from "./pagination";

interface BlogsListProps {
  data: PaginatedBlogs;
}

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
