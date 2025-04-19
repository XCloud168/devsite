"use client";
import Clock from "@/components/Clock";
import RandomShapes from "@/components/random-shapes";
import type { ServerResult } from "@/lib/server-result";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
interface Props {
  get24hRankingListAction: () => Promise<ServerResult>;
}
interface Item {
  mentions: {
    count: number;
    users: {
      avatar: string;
      id: string;
    }[];
  };
  project: {
    id: string;
    logo: string;
    symbol: string;
  };
  user: {
    avatar: string;
    id: string;
    name: string;
    screenName: string;
  };
  tweet: {
    content: string;
    createdAt: Date;
    highRate24H: string;
    id: string;
    signalPrice: string;
    url: string;
  };
}
export function RiseComponent({ get24hRankingListAction }: Props) {
  const t = useTranslations();
  const [pageLoading, setPageLoading] = useState(false);
  const [itemList, setItemList] = useState<Item[]>([]);
  useEffect(() => {
    setPageLoading(true);
    const fetchData = async () => {
      const response = await get24hRankingListAction();
      setPageLoading(false);
      setItemList(response.data);
      console.log(response);
    };
    fetchData();
  }, [get24hRankingListAction]);
  return (
    <div className="relative mt-10 flex justify-center overflow-hidden">
      <RandomShapes />
      <div className="flex flex-col items-center justify-center">
        <div className="mb-5 flex items-center">
          <div className="h-16 w-16 bg-[url(/images/dashboard/ranking-icon.png)] bg-contain"></div>
          <p className="text-2xl font-semibold">
            {t("dashboard.riseRanking.gainRanking")}
          </p>
        </div>
        <Clock />
        <div className="z-10 mt-5 space-y-3">
          {pageLoading
            ? [1, 2, 3, 4, 5].map((item) => (
                <Skeleton
                  className="h-[116px] w-full min-w-[776px] bg-secondary"
                  key={item}
                />
              ))
            : itemList.map((item, index) => (
                <div
                  key={`24ranking_${index}`}
                  className="relative grid grid-cols-4 items-center gap-10 overflow-hidden rounded-lg bg-[#18191A] px-5 pb-6 pt-10"
                >
                  <div className="absolute left-0 top-0 h-6 w-20 rounded-br-lg bg-gradient-to-r from-[#4DFFC4] to-[#F2DA18] text-center text-sm font-semibold leading-6 text-black">
                    Top{index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 rounded-full ring-1 ring-[#FCBF28]">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.user.avatar ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div className="absolute -left-1.5 -top-2 h-5 w-5 bg-[url(/images/dashboard/crown.svg)] bg-contain"></div>
                    </div>
                    <div>
                      <p
                        className="max-w-32 truncate text-lg font-semibold"
                        title={item.user.name}
                      >
                        {item.user.name}
                      </p>
                      <p className="text-white/60">@{item.user.screenName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs">
                      {t("dashboard.riseRanking.kolMentions")}
                    </p>

                    <div className="mt-1 flex -space-x-1">
                      {item.mentions.users.length > 0
                        ? item.mentions.users.slice(0, 5).map((user) => (
                            <div
                              className="h-4 w-4 rounded-full ring-1"
                              key={user.id}
                            >
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={user.avatar ?? ""} />
                                <AvatarFallback></AvatarFallback>
                              </Avatar>
                            </div>
                          ))
                        : "--"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full ring-1">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={item.project.logo ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xl font-semibold">
                      {item.project.symbol}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 bg-[url(/images/dashboard/rise-green.svg)] bg-contain bg-no-repeat"></div>
                    <p className="text-xl font-semibold text-primary">
                      {item.tweet.highRate24H}%
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
