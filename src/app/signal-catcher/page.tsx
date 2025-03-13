import { Button } from "@/components/ui/button";
import { blogs } from "@/server/api";
import Link from "next/link";
import { FeaturedBanner } from "./_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizeable";
import { SignalBanner } from "@/app/signal-catcher/_components/signal-banner";
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
    <div className="w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={50}>
          <div className="block h-full items-center justify-center">
            <SignalBanner />
            <SignalList />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} maxSize={50} minSize={30}>
          <div className="block h-full items-center justify-center">
            <FeaturedBanner data={data} />
            <FeaturedList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
