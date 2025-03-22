"use client";

import { type ServerResult } from "@/lib/server-result";

import React, { useEffect, useState } from "react";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { type SetState } from "@/app/signal-catcher/_components/my-followed";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { FeaturedCard } from "@/app/signal-catcher/_components/featured-card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  getSignalListAction: (
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
  const fetchSignalList = async (
    refresh: boolean,
    page: number,
    categoryId: string,
    setSignalList: SetState<SignalItems[]>,
    setHasNext: SetState<boolean>,
    setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getSignalListAction: FetchSignalListAction,
    providerType?: SIGNAL_PROVIDER_TYPE,
    entityId?: string,
  ) => {
    setPageLoading(true);
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
    setPageLoading(false);
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
  return (
    <div className="scroll-container relative z-[5] h-[calc(100vh-300px)] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
      {pageLoading && signalList.length === 0 ? (
        <div className="space-y-5 px-5">
          {[1, 2, 3, 4].map((item) => (
            <div className="flex w-full gap-3" key={item}>
              <Skeleton className="h-9 w-9 min-w-9 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        signalList.map((signal) => (
          <FeaturedCard signal={signal} key={signal.id} showLine />
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
