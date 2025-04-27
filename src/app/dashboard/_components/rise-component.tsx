"use client";
import Clock from "@/components/Clock";
import RandomShapes from "@/components/random-shapes";
import type { ServerResult } from "@/lib/server-result";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import RankingSharePoster from "@/components/poster/ranking-share-poster";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
interface Props {
  get24hRankingListAction: () => Promise<ServerResult>;
  isMobile?: boolean;
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
export function RiseComponent({ get24hRankingListAction, isMobile }: Props) {
  const router = useRouter();
  const t = useTranslations();
  const [pageLoading, setPageLoading] = useState(false);
  const [itemList, setItemList] = useState<Item[]>([]);
  useEffect(() => {
    setPageLoading(true);
    const fetchData = async () => {
      const response = await get24hRankingListAction();
      setPageLoading(false);
      setItemList(response.data);
    };
    fetchData();
  }, [get24hRankingListAction]);
  return (
    <div className="relative flex h-full justify-center overflow-hidden pb-10">
      <div className="absolute h-svh w-svw bg-[url(/images/dashboard/ranking-bg.svg)] bg-center"></div>
      <RandomShapes />
      <div className="mt-10 flex flex-col items-center justify-center">
        <div className="mb-5 flex items-center">
          <div className="h-16 w-16 bg-[url(/images/dashboard/ranking-icon.png)] bg-contain"></div>
          <p className="text-xl font-semibold md:text-2xl">
            {t("dashboard.riseRanking.gainRanking")}
          </p>
        </div>
        <Clock />
        <div className="z-10 mt-5 space-y-3">
          {pageLoading
            ? [1, 2, 3, 4, 5].map((item) => (
                <Skeleton
                  className="mx-auto h-[116px] w-full min-w-[90vw] bg-secondary md:min-w-[776px]"
                  key={item}
                />
              ))
            : itemList.map((item, index) => (
                <div
                  key={`24ranking_${index}`}
                  className="relative mx-auto grid w-[96%] grid-cols-2 items-center gap-4 overflow-hidden rounded-lg border bg-white px-4 pb-3 pt-10 dark:border-none dark:bg-[#18191A] md:w-full md:grid-cols-[repeat(4,_1fr)_40px] md:gap-10 md:px-5 md:pb-6"
                >
                  <div className="absolute left-0 top-0 h-6 w-20 rounded-br-lg bg-gradient-to-r from-[#4DFFC4] to-[#F2DA18] text-center text-sm font-semibold leading-6 text-black">
                    Top{index + 1}
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => router.push(`/dashboard/${item.user.id}`)}
                  >
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
                      <p className="text-black/40 dark:text-white/60">
                        @{item.user.screenName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#949C9E]">
                      {t("dashboard.riseRanking.kolMentions")}
                    </p>

                    <div className="mt-1 flex space-x-1">
                      {item.mentions.users.length > 0
                        ? item.mentions.users.slice(0, 5).map((user) => (
                            <div
                              className="h-5 w-5 rounded-full ring-1"
                              key={user.id}
                            >
                              <Avatar className="h-5 w-5">
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
                  <div className="absolute right-4 top-4 cursor-pointer items-center justify-center md:relative md:right-0 md:top-0 md:flex">
                    <RankingSharePoster isMobile={isMobile}>
                      <div className="items-center py-5">
                        <p className="w-80 text-4xl font-bold">
                          {t("dashboard.share.slogan")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-5 border-b border-t">
                        <div className="flex flex-col space-y-8 border-r p-3">
                          <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10 rounded-full ring-1">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={item.project.logo ?? ""} />
                                <AvatarFallback></AvatarFallback>
                              </Avatar>
                            </div>
                            <p
                              className="max-w-32 truncate text-lg font-semibold"
                              title={item.project.symbol}
                            >
                              {item.project.symbol}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-[#949C9E]">
                              {t("dashboard.riseRanking.kolMentions")}
                            </p>
                            <div className="flex space-x-1">
                              {item.mentions.users.length > 0
                                ? item.mentions.users
                                    .slice(0, 5)
                                    .map((user) => (
                                      <div
                                        className="h-4 w-4 rounded-full ring-1"
                                        key={user.id}
                                      >
                                        <Avatar className="h-4 w-4">
                                          <AvatarImage
                                            src={user.avatar ?? ""}
                                          />
                                          <AvatarFallback></AvatarFallback>
                                        </Avatar>
                                      </div>
                                    ))
                                : "--"}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 p-3">
                          <div className="space-y-2">
                            <p className="text-xs">
                              {t("dashboard.share.KolRecords")}
                            </p>
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
                                <p className="text-white/60">
                                  @{item.user.screenName}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-[url(/images/dashboard/rise-green.svg)] bg-contain bg-no-repeat"></div>
                            <p className="text-4xl font-semibold text-primary">
                              {item.tweet.highRate24H}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex">
                        <p className="scale-[88%] text-xs">
                          {dayjs().format("YYYY-MM-DD")}
                        </p>
                        <p className="scale-[88%] text-xs text-white/60">
                          {t("dashboard.share.footer")}
                        </p>
                        <p className="scale-[88%] text-xs text-white/60">
                          www.masbate.xyz
                        </p>
                        <p className="scale-[88%] text-xs text-white/60">
                          @masbateofficial
                        </p>
                      </div>
                    </RankingSharePoster>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
