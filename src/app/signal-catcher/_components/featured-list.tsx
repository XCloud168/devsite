"use client";

import { type ServerResult } from "@/lib/server-result";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { type SetState } from "@/app/signal-catcher/_components/my-followed";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { FeaturedCard } from "@/app/signal-catcher/_components/featured-card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  getSignalListAction?: (
    page: number,
    filter: {
      categoryId: string;
      providerType?: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
  ) => Promise<ServerResult>;
  menuInfo: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  };
};
interface SignalItems extends Signals {
  source: TweetInfo & {
    imagesUrls: string[];
    videoUrls: string[];
    exchange: {
      name: string;
      logo: string;
    };
    tweetUser: { name: string; avatar: string; tweetUrl: string };
    source: string;
    newsEntity: {
      logo: string;
    };
    mediaUrls: {
      images?: string[];
      videos?: string[];
    };
  };
  project: Projects;
  times: string;
  hitKOLs: {
    avatar: string;
    id: string;
    name: string;
  }[];
}

export type FetchSignalListAction = (
  page: number,
  options: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  },
) => Promise<ServerResult>;

export function FeaturedList({ getSignalListAction, menuInfo }: Props) {
  const [signalList, setSignalList] = useState<SignalItems[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchSignalList = async (
    refresh: boolean,
    page: number,
    categoryId: string,
    setSignalList: SetState<SignalItems[]>,
    setHasNext: SetState<boolean>,
    setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getSignalListAction?: FetchSignalListAction,
    providerType?: SIGNAL_PROVIDER_TYPE,
    entityId?: string,
    showPageLoading = true,
  ) => {
    if (showPageLoading) setPageLoading(true);
    if (getSignalListAction) {
      const response = await getSignalListAction(page, {
        categoryId,
        ...(providerType !== undefined && { providerType }),
        ...(entityId !== undefined && { entityId }),
      });
      setSignalList((prev) =>
        refresh ? response.data.items : prev.concat(response.data.items),
      );
      setHasNext(response.data.pagination.hasNextPage);
      setCurrentPage(response.data.pagination.currentPage);
      if (showPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    setSignalList([]);
    setCurrentPage(1);
    fetchSignalList(
      true,
      1,
      menuInfo.categoryId,
      setSignalList,
      setHasNext,
      setCurrentPage,
      setPageLoading,
      getSignalListAction,
      menuInfo.providerType,
      menuInfo.entityId,
    );
  }, [menuInfo]);

  const handleNextPage = () => {
    if (hasNext) {
      fetchSignalList(
        false,
        currentPage + 1,
        menuInfo.categoryId,
        setSignalList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getSignalListAction,
        menuInfo.providerType,
        menuInfo.entityId,
      );
    }
  };

  useEffect(() => {
    const interval = 60 * 1000;
    const checkNewSignals = async () => {
      if (getSignalListAction) {
        const response = await getSignalListAction(1, {
          categoryId: menuInfo.categoryId,
          ...(menuInfo.providerType !== undefined && {
            providerType: menuInfo.providerType,
          }),
          ...(menuInfo.entityId !== undefined && {
            entityId: menuInfo.entityId,
          }),
        });
        const newItems = response.data.items;
        const currentIds = signalList.map((item) => item.id);
        const differentItems = newItems.filter(
          (item: SignalItems) => !currentIds.includes(item.id),
        );
        if (differentItems.length > 0) {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }
    };

    const timer = setInterval(() => {
      void checkNewSignals();
    }, interval);
    return () => clearInterval(timer);
  }, [
    getSignalListAction,
    menuInfo.categoryId,
    menuInfo.entityId,
    menuInfo.providerType,
    signalList,
  ]);

  const dynamicHeight: number = useMemo(() => {
    if (menuInfo.entityId) return 330;
    return 260;
  }, [menuInfo]);
  return (
    <div
      ref={scrollRef}
      style={{ height: `calc(100vh - ${dynamicHeight}px)` }}
      className="relative z-[5] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary"
    >
      {pageLoading && signalList.length === 0 ? (
        <div className="space-y-5 px-5">
          {[1, 2, 3, 4].map((item) => (
            <div className="flex w-full gap-3" key={item}>
              <Skeleton className="h-9 w-9 min-w-9 rounded-full bg-secondary" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/5 bg-secondary" />
                <Skeleton className="h-4 w-2/5 bg-secondary" />
                <Skeleton className="h-20 w-full bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        signalList.map((signal) => (
          <FeaturedCard signal={signal} key={signal.id} />
        ))
      )}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={hasNext}
        onNextAction={handleNextPage}
      />
    </div>
  );
}
