import { Button } from "@/components/ui/button";
import { getPaginatedBlogs } from "@/services/blogs";
import Link from "next/link";
import { BlogsList } from "./_components/blogs-list";

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const data = await getPaginatedBlogs(currentPage);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/new">
          <Button>Create Post</Button>
        </Link>
      </div>

      <BlogsList data={data} />
    </div>
  );
}
