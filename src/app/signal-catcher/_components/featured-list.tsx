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
import SwapModal from "@/components/swap/modal";

type Props = {
  getSignalListAction?: (
    filter: {
      categoryId: string;
      providerType?: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
    cursor?: string,
  ) => Promise<ServerResult>;
  menuInfo: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  };
  isMobile?: boolean;
  onFinishFetchAction: () => void;
};
interface SignalItems extends Signals {
  source: TweetInfo & {
    isAccurate: boolean;
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
  options: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  },
  cursor?: string,
) => Promise<ServerResult>;

export function FeaturedList({
  getSignalListAction,
  menuInfo,
  isMobile,
  onFinishFetchAction,
}: Props) {
  const [signalList, setSignalList] = useState<SignalItems[]>([]);
  // const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchSignalList = async (
    refresh: boolean,
    cursor: string | undefined,
    categoryId: string,
    setSignalList: SetState<SignalItems[]>,
    setNextCursor: SetState<string | undefined>,
    // setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getSignalListAction?: FetchSignalListAction,
    providerType?: SIGNAL_PROVIDER_TYPE,
    entityId?: string,
    onFinish?: () => void,
    showPageLoading = true,
  ) => {
    if (categoryId === "") return;
    if (showPageLoading) setPageLoading(true);
    if (getSignalListAction) {
      const response = await getSignalListAction(
        {
          categoryId,
          ...(providerType !== undefined && { providerType }),
          ...(entityId !== undefined && { entityId }),
        },
        cursor,
      );
      setSignalList((prev) =>
        refresh ? response.data.items : prev.concat(response.data.items),
      );
      setNextCursor(response.data.pagination.nextCursor);
      setCurrentPage(response.data.pagination.currentPage);
      if (showPageLoading) setPageLoading(false);
      if (refresh && onFinish) onFinish();
    }
  };

  useEffect(() => {
    setSignalList([]);
    setCurrentPage(1);
    fetchSignalList(
      true,
      undefined,
      menuInfo.categoryId,
      setSignalList,
      setNextCursor,
      // setCurrentPage,
      setPageLoading,
      getSignalListAction,
      menuInfo.providerType,
      menuInfo.entityId,
      onFinishFetchAction,
    );
  }, [menuInfo]);

  const handleNextPage = () => {
    if (nextCursor !== undefined) {
      fetchSignalList(
        false,
        nextCursor,
        menuInfo.categoryId,
        setSignalList,
        setNextCursor,
        // setCurrentPage,
        setPageLoading,
        getSignalListAction,
        menuInfo.providerType,
        menuInfo.entityId,
        onFinishFetchAction,
      );
    }
  };

  useEffect(() => {
    const interval = 60 * 1000;
    const checkNewSignals = async () => {
      if (getSignalListAction) {
        const response = await getSignalListAction({
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
          if (scrollRef.current && scrollRef.current.scrollTop === 0) {
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
    if (isMobile) return 0;
    if (menuInfo.entityId) return 330;
    return 260;
  }, [isMobile, menuInfo.entityId]);
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapConfig, setSwapConfig] = useState<
    | {
        chain: string;
        address: string | null;
        chainId?: string | null;
      }
    | undefined
  >({
    chain: "",
    address: "",
    chainId: "",
  });
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
          <FeaturedCard
            signal={signal}
            key={signal.id}
            onSwap={(open, payload) => {
              setSwapOpen(open);
              setSwapConfig(payload);
            }}
          />
        ))
      )}
      {swapConfig && (
        <SwapModal
          isOpen={swapOpen}
          onClose={() => setSwapOpen(false)}
          fromChain={swapConfig.chainId ?? ""}
          toChain={swapConfig.chainId ?? ""}
          toToken={swapConfig.address ?? ""}
        />
      )}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={nextCursor !== undefined}
        onNextAction={handleNextPage}
      />
    </div>
  );
}
