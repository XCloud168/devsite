import { Button } from "@/components/ui/button";
import { blogs } from "@/server/api";
import Link from "next/link";
import { SignalBanner } from "./_components/signal-banner";
import { SignalList } from "@/app/signal-catcher/_components/signal-list";

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function SignalPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const data = await blogs.getPaginatedBlogs(currentPage);

  return (
    <div className="container py-8">
      {/*<div className="mb-8 flex items-center justify-between">*/}
      {/*  <h1 className="text-3xl font-bold">Posts</h1>*/}
      {/*  <Link href="/posts/new">*/}
      {/*    <Button>Create Post</Button>*/}
      {/*  </Link>*/}
      {/*</div>*/}

      <SignalBanner data={data} />
      <SignalList />
    </div>
  );
}
