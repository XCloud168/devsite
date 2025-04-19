"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { KolInfo } from "@/app/dashboard/[id]/_components/kol-info";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trend } from "@/app/dashboard/[id]/_components/trend";
import { BubbleChat } from "@/app/dashboard/[id]/_components/bubble-chat";
import { History } from "@/app/dashboard/[id]/_components/history";
import { type ServerResult } from "@/lib/server-result";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeaturedCard,
  type SignalItems,
} from "@/app/signal-catcher/_components/featured-card";
import { useTranslations } from "next-intl";
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
// interface UserInfo {
//   dailyWinRate: {
//     date: string;
//     tweetsCount: number;
//     winRate: string;
//   }[]; //柱状图
//   projectStats: {
//     firstPrice: string;
//     highestPrice: string;
//     highestRate: string;
//     logo: string;
//     mentionCount: number;
//     projectId: string;
//     symbol: string;
//   }[];
//   projectsPerformance: {
//     content: string;
//     highRate24H: string;
//     id: string;
//     lowRate24H: string;
//     projectId: string;
//     projectLogo: string;
//     projectSymbol: string;
//     tweetCreatedAt: Date;
//   }[];
//   tweets: SignalItems[];
//   userInfo: {
//     name: string;
//     avatar: string;
//     description: string;
//     followersCount: string;
//     screenName: string;
//     maxHighRate: string;
//     maxHighRateProject: {
//       id: string;
//       logo: string;
//       symbol: string;
//     };
//     maxLowRate: string;
//     maxLowRateProject: {
//       id: string;
//       logo: string;
//       symbol: string;
//     };
//     projectsCount: string;
//   };
// }
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
export function DetailComponent({
  id,
  getUserInfoAction,
  getUserStatsAction,
  getUserProjectsPerformanceAction,
  getUserDailyWinRateAction,
  getUserProjectStatsAction,
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
          {/*</div>*/}
          {/*<div className="w-2/5 p-5">*/}
          {/*  {pageLoading && userInfo ? (*/}
          {/*    <div className="space-y-5 px-5">*/}
          {/*      {[1, 2].map((item) => (*/}
          {/*        <div className="flex w-full gap-3" key={item}>*/}
          {/*          <Skeleton className="h-9 w-9 min-w-9 rounded-full bg-secondary" />*/}
          {/*          <div className="w-full space-y-2">*/}
          {/*            <Skeleton className="h-4 w-1/5 bg-secondary" />*/}
          {/*            <Skeleton className="h-4 w-2/5 bg-secondary" />*/}
          {/*            <Skeleton className="h-20 w-full bg-secondary" />*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  ) : (*/}
          {/*    userInfo?.tweets.map((signal) => (*/}
          {/*      <FeaturedCard signal={signal} key={signal.id} />*/}
          {/*    ))*/}
          {/*  )}*/}
        </div>
      </div>
    </div>
  );
}
