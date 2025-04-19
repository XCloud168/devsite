"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { KolInfo } from "@/app/dashboard/[id]/_components/kol-info";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trend } from "@/app/dashboard/[id]/_components/trend";
import { BubbleChat } from "@/app/dashboard/[id]/_components/bubble-chat";
import { History } from "@/app/dashboard/[id]/_components/history";
import { type ServerResult } from "@/lib/server-result";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import TranslationComponent from "@/components/translation-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
interface DetailComponentProps {
  id: string;
  getUserStatsAction: (userId: string, period: string) => Promise<ServerResult>;
  getUserInfoAction: (userId: string) => Promise<ServerResult>;
  getUserDailyWinRateAction: (
    userId: string,
    period: string,
  ) => Promise<ServerResult>;
  getUserProjectsPerformanceAction: (
    userId: string,
    period: string,
  ) => Promise<ServerResult>;
  getUserProjectStatsAction: (
    userId: string,
    period: string,
  ) => Promise<ServerResult>;
  getUserUserTweetsAction: (
    userId: string,
    period: string,
    page: number,
    pageSize: number,
  ) => Promise<ServerResult>;
}

interface UserInfo {
  avatar: string;
  description: string;
  followersCount: number;
  id: string;
  name: string;
  screenName: string;
}
interface UserState {
  maxHighRate: string;
  maxHighRateProject: {
    id: string;
    logo: string;
    symbol: string;
  };
  maxLowRate: string;
  maxLowRateProject: {
    id: string;
    logo: string;
    symbol: string;
  };
  projectsCount: string;
}
interface ProjectsPerformance {
  content: string;
  highRate24H: string;
  id: string;
  lowRate24H: string;
  projectId: string;
  projectLogo: string;
  projectSymbol: string;
  tweetCreatedAt: Date;
}

interface DailyWinRate {
  date: string;
  tweetsCount: number;
  winRate: string;
} //柱状图
interface ProjectStats {
  firstPrice: string;
  highestPrice: string;
  highestRate: string;
  logo: string;
  mentionCount: number;
  projectId: string;
  symbol: string;
}
interface TweetItem {
  content: string;
  contentSummary: string;
  highRate24H: string;
  id: string;
  likes: number;
  lowRate24H: string;
  projectInfo: { id: string; logo: string; symbol: string };
  replies: number;
  retweets: number;
  signalPrice: string;
  tweetCreatedAt: Date;
  tweetUrl: string;
}
export function DetailComponent({
  id,
  getUserInfoAction,
  getUserStatsAction,
  getUserProjectsPerformanceAction,
  getUserDailyWinRateAction,
  getUserProjectStatsAction,
  getUserUserTweetsAction,
}: DetailComponentProps) {
  const t = useTranslations();
  const [selectedRange, setSelectedRange] = useState("7d");
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    const fetchData = async () => {
      setUserInfoLoading(true);
      const response = await getUserInfoAction(id);
      setUserInfo(response.data);
      setUserInfoLoading(false);
    };
    fetchData();
  }, [getUserInfoAction, id]);

  const [userStateLoading, setUserStateLoading] = useState(false);
  const [userState, setUserState] = useState<UserState>();
  useEffect(() => {
    const fetchData = async () => {
      setUserStateLoading(true);
      const response = await getUserStatsAction(id, selectedRange);
      setUserState(response.data);
      setUserStateLoading(false);
    };
    fetchData();
  }, [getUserStatsAction, id, selectedRange]);

  const [userProjectStatsLoading, setUserProjectStatsLoading] = useState(false);
  const [userProjectStats, setUserProjectStats] = useState<ProjectStats[]>();
  useEffect(() => {
    const fetchData = async () => {
      setUserProjectStatsLoading(true);
      const response = await getUserProjectStatsAction(id, selectedRange);
      setUserProjectStats(response.data);
      setUserProjectStatsLoading(false);
    };
    fetchData();
  }, [getUserProjectStatsAction, id, selectedRange]);

  const [userDailyLoading, setUserDailyLoading] = useState(false);
  const [userDaily, setUserDaily] = useState<DailyWinRate[]>();
  useEffect(() => {
    const fetchData = async () => {
      setUserDailyLoading(true);
      const response = await getUserDailyWinRateAction(id, selectedRange);
      setUserDaily(response.data);
      setUserDailyLoading(false);
    };
    fetchData();
  }, [getUserDailyWinRateAction, id, selectedRange]);

  const [userPerformanceLoading, setUserPerformanceLoading] = useState(false);
  const [userPerformance, setUserPerformance] =
    useState<ProjectsPerformance[]>();
  useEffect(() => {
    const fetchData = async () => {
      setUserPerformanceLoading(true);
      const response = await getUserProjectsPerformanceAction(
        id,
        selectedRange,
      );
      setUserPerformance(response.data);
      setUserPerformanceLoading(false);
    };
    fetchData();
  }, [getUserProjectsPerformanceAction, id, selectedRange]);

  const [userUserTweetLoading, setUserUserTweetLoading] = useState(false);
  const [userUserTweet, setUserUserTweet] = useState<TweetItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setUserUserTweetLoading(true);
      const response = await getUserUserTweetsAction(
        id,
        selectedRange,
        page,
        5,
      );
      setUserUserTweet(response.data.data);
      console.log();
      setHasNext(page !== response.data.pagination.totalPage);
      setPage(response.data.pagination.currentPage);
      setUserUserTweetLoading(false);
    };
    fetchData();
  }, [
    getUserProjectsPerformanceAction,
    getUserUserTweetsAction,
    id,
    page,
    selectedRange,
  ]);

  return (
    <div className="">
      <Link
        className="flex cursor-pointer items-center gap-1 p-5"
        href={"/dashboard"}
      >
        <ChevronLeft size={20} />
        <p>{t("dashboard.details.kolDetails")}</p>
      </Link>
      <div className="h-[1px] w-full bg-border"></div>
      <div className="flex w-full">
        <div className="w-3/5 border-r p-5">
          {!userInfoLoading && !userStateLoading && userInfo && userState ? (
            <KolInfo userInfo={userInfo} userState={userState} />
          ) : (
            <Skeleton className="mt-6 h-40 w-full bg-secondary" />
          )}
          <div className="my-3 flex w-full items-center justify-center">
            <Tabs
              defaultValue="7d"
              className="w-fit"
              onValueChange={(e) => {
                setSelectedRange(e);
                // setPageLoading(true);
                // getTwitterUserInfoAction(id, e).then((res) => {
                //   setUserInfo(res.data);
                //   setPageLoading(false);
                // });
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="">
            <p className="text-xs">{t("dashboard.details.trend")}</p>
            {!userDailyLoading && userDaily ? (
              <Trend dailyWinRate={userDaily} />
            ) : (
              <Skeleton className="mt-3 h-48 w-full bg-secondary" />
            )}
          </div>
          <div className="mt-3">
            <p className="text-xs">{t("dashboard.details.analysis")}</p>
            {!userPerformanceLoading && userPerformance ? (
              <BubbleChat chartData={userPerformance} />
            ) : (
              <Skeleton className="mt-3 h-96 w-full bg-secondary" />
            )}
          </div>
          <div className="mt-3">
            <p className="text-xs">{t("dashboard.details.gainDetails")}</p>
            {!userProjectStatsLoading && userProjectStats ? (
              <History projectStats={userProjectStats} />
            ) : (
              <Skeleton className="h-40 w-full bg-secondary" />
            )}
          </div>
        </div>
        <div className="w-2/5 p-5">
          <div className="space-y-5 px-5">
            {!userUserTweetLoading && userUserTweet
              ? userUserTweet.map((tweet) => (
                  <div key={tweet.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={tweet.projectInfo.logo ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <p>{tweet.projectInfo.symbol}</p>
                      <p className="text-xs text-black/60">
                        {dayjs(tweet.tweetCreatedAt).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#4949493a] p-3">
                      <TranslationComponent content={tweet.content ?? ""} />
                    </div>
                  </div>
                ))
              : [1, 2].map((item) => (
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
          <LoadingMoreBtn
            pageLoading={userUserTweetLoading}
            hasNext={hasNext}
            onNextAction={() => {
              getUserUserTweetsAction(id, selectedRange, page, 5).then(
                (res) => {
                  setUserUserTweet((prev) => prev.concat(res.data.data));
                  setHasNext(page !== res.data.pagination.currentPage);
                  setPage(res.data.pagination.currentPage);
                },
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
