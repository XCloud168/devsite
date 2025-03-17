"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type ServerResult } from "@/lib/server-result";
import { type SIGNAL_PROVIDER_TYPE } from "@/types/constants";
import React, { useEffect, useState } from "react";
import { type FeaturedMenu } from "@/app/signal-catcher/_components/featured-banner";
import { type signals } from "@/server/db/schemas/signal";
import dayjs from "dayjs";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { type SetState } from "@/app/signal-catcher/_components/kolPanel3";

type Props = {
  getSignalListAction: (
    page: number,
    filter: {
      providerType: SIGNAL_PROVIDER_TYPE;
      providerId?: string;
    },
  ) => Promise<ServerResult>;
  menu: FeaturedMenu;
};
interface signalItems extends signals {
  source: TweetInfo;
}
export type FetchSignalListAction = (
  page: number,
  options: { providerType: SIGNAL_PROVIDER_TYPE },
) => Promise<ServerResult>;

export function FeaturedList({ getSignalListAction, menu }: Props) {
  const [signalList, setSignalList] = useState<signalItems[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchSignalList = async (
    page: number,
    providerType: SIGNAL_PROVIDER_TYPE,
    setSignalList: SetState<signalItems[]>,
    setHasNext: SetState<boolean>,
    setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getSignalListAction: FetchSignalListAction,
  ) => {
    setPageLoading(true);
    const response = await getSignalListAction(page, {
      providerType: providerType,
    });
    console.log(response);
    setSignalList((prev) =>
      page === 1 ? response.data.items : prev.concat(response.data.items),
    );
    setHasNext(response.data.pagination.hasNextPage);
    setCurrentPage(response.data.pagination.currentPage);
    setPageLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSignalList(
      1,
      menu.label,
      setSignalList,
      setHasNext,
      setCurrentPage,
      setPageLoading,
      getSignalListAction,
    );
  }, [menu]);

  const handleNextPage = () => {
    if (hasNext) {
      fetchSignalList(
        currentPage + 1,
        menu.label,
        setSignalList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getSignalListAction,
      );
    }
  };
  return (
    <>
      {signalList.map((signal) => (
        <div
          className="grid grid-cols-[48px_1fr] gap-1 overflow-hidden px-5"
          key={signal.id}
        >
          <div className="h-full">
            <div className="h-10 w-10 rounded-full border border-white"></div>
            <div className="h-full w-[20px] border-r border-dashed"></div>
          </div>
          <div className="min-h-20">
            <p className="font-bold leading-5">Binance</p>
            <p className="leading-5 text-[#FFFFA7]">
              {dayjs(signal.signalTime).format("YYYY/MM/DD HH:mm:ss")}
            </p>
            <div className="relative h-fit w-full bg-transparent">
              <p className="py-2 text-white/90">123</p>
            </div>
            <div className="mb-2 flex items-center bg-[#1E2229] p-6">
              <div className="border-spin-image ml-3 flex h-9 w-9 items-center justify-center">
                <div className="z-10 h-8 w-8 overflow-hidden rounded-full ring-1 ring-[#6CFFE9]">
                  <div className="flex h-full w-full items-center justify-center bg-black">
                    1
                  </div>
                </div>
              </div>
              <p className="ml-4 font-bold">KAITO</p>
              <p className="ml-10 text-xs">24h max pnl%</p>
              <p className="ml-2 font-extrabold text-[#00FFAB]">+21.78%</p>
              <div className="ml-10 h-4 w-4 bg-[url(/images/signal/positive.svg)] bg-cover"></div>
              <p className="ml-1.5">POSITIVE</p>
              <Button variant="default" className="ml-auto">
                购买代币
              </Button>
            </div>
            <div className="mt-8 flex gap-6 px-3 pb-5">
              <Link
                className="flex items-center gap-1 text-xs text-[#617178]"
                href={"/"}
              >
                <div className="h-3 w-3 bg-[url(/images/signal/link.svg)] bg-contain"></div>
                <p className="text-xs text-[#B0DDEF]">View Original Link</p>
              </Link>
              <Link
                className="flex items-center gap-1 text-xs text-[#617178]"
                href="/"
              >
                <div className="h-2.5 w-2.5 bg-[url(/images/signal/share.svg)] bg-contain"></div>
                <p className="text-xs text-[#B0DDEF]">Share</p>
              </Link>
            </div>
          </div>
        </div>
      ))}
      {hasNext ? (
        <div className="mt-4 flex justify-center">
          {pageLoading ? (
            <div className="flex items-center justify-center text-primary">
              加载中
              <span className="animate-dots inline-block w-2 text-center text-primary">
                .
              </span>
              <span className="animate-dots animation-delay-200 inline-block w-2 text-center text-primary">
                .
              </span>
              <span className="animate-dots animation-delay-400 inline-block w-2 text-center text-primary">
                .
              </span>
            </div>
          ) : (
            <Button onClick={() => handleNextPage()}>加载更多</Button>
          )}
        </div>
      ) : null}
    </>
  );
}
