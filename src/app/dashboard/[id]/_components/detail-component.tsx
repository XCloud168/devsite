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
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { TweetList } from "@/app/dashboard/[id]/_components/tweet-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  isMobile?: boolean;
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
  positiveRatePercentage: string;
}
interface ProjectsPerformance {
  content: string;
  highRate: string;
  id: string;
  lowRate: string;
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
  signalPrice: string;
  highPrice: string;
  highRate: string;
  logo: string;
  mentionCount: number;
  projectId: string;
  symbol: string;
}
export interface TweetItem {
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
  isMobile,
}: DetailComponentProps) {
  const t = useTranslations();
  const [selectedRange, setSelectedRange] = useState("7d");
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [buttonLoading, setButtonLoading] = useState(false);
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

  const [userTweetLoading, setUserTweetLoading] = useState(false);
  const [userTweet, setUserTweet] = useState<TweetItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setUserTweetLoading(true);
      const response = await getUserUserTweetsAction(id, "30d", page, 5);
      setUserTweet(response.data.data);
      setHasNext(page !== response.data.pagination.totalPage);
      setPage(response.data.pagination.currentPage);
      setUserTweetLoading(false);
    };
    fetchData();
  }, []);
  const [selectedType, setSelectedType] = useState("kolDetails");
  const Left = (
    <div className="h-full w-full overflow-y-scroll border-r p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary md:h-[calc(100vh-132px)] md:w-3/5 md:p-5">
      {!userInfoLoading && !userStateLoading && userInfo && userState ? (
        <KolInfo userInfo={userInfo} userState={userState} />
      ) : (
        <Skeleton className="mt-3 h-56 w-full bg-secondary md:h-40" />
      )}
      <div className="my-3 flex w-full items-center justify-center">
        <Tabs
          defaultValue="7d"
          className="w-fit"
          onValueChange={(e) => {
            setSelectedRange(e);
          }}
        >
          <TabsList className="grid w-full grid-cols-2 px-1">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="">
        <p className="">{t("dashboard.details.trend")}</p>
        {!userDailyLoading && userDaily ? (
          <Trend dailyWinRate={userDaily} />
        ) : (
          <Skeleton className="mt-3 h-48 w-full bg-secondary" />
        )}
      </div>
      <div className="mt-3 w-[96vw] overflow-x-scroll md:w-full md:overflow-x-hidden">
        <div className="w-[800px] md:w-full">
          <p className="">{t("dashboard.details.analysis")}</p>
          {!userPerformanceLoading && userPerformance ? (
            <BubbleChat chartData={userPerformance} />
          ) : (
            <Skeleton className="mt-3 h-96 w-full bg-secondary" />
          )}
        </div>
      </div>
      <div className="mt-3 w-[96vw] overflow-x-scroll md:w-full md:overflow-x-hidden">
        <p className="">{t("dashboard.details.gainDetails")}</p>
        {!userProjectStatsLoading && userProjectStats ? (
          <History projectStats={userProjectStats} />
        ) : (
          <Skeleton className="h-40 w-full bg-secondary" />
        )}
      </div>
    </div>
  );
  const Right = (
    <div className="mt-2 h-full w-full space-y-3 overflow-y-scroll border-r p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary md:mt-0 md:h-[calc(100vh-132px)] md:w-2/5 md:p-5">
      {userInfo && (
        <div className="flex justify-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userInfo.avatar ?? ""} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
      )}
      <p className="text-center">
        {userInfo?.name}&nbsp;
        {t("dashboard.details.tokenMentions")}
      </p>
      <div className="space-y-5 px-5">
        {!userTweetLoading && userTweet ? (
          <TweetList userTweet={userTweet} />
        ) : (
          [1, 2, 3, 4].map((item) => (
            <div className="flex w-full gap-3" key={item}>
              <div className="w-full space-y-2">
                <Skeleton className="h-5 w-3/5 bg-secondary" />
                <Skeleton className="h-20 w-full bg-secondary" />
              </div>
            </div>
          ))
        )}
      </div>
      <LoadingMoreBtn
        pageLoading={buttonLoading}
        hasNext={hasNext}
        onNextAction={() => {
          setButtonLoading(true);
          getUserUserTweetsAction(id, "30d", page + 1, 5).then((res) => {
            setUserTweet((prev) => prev.concat(res.data.data));
            setHasNext(page !== res.data.pagination.currentPage);
            setPage(res.data.pagination.currentPage + 1);
            setButtonLoading(false);
          });
        }}
      />
    </div>
  );
  if (isMobile) {
    return (
      <div className="">
        <div className="cursor-pointe sticky top-0 z-50 border-b bg-background p-3 md:top-14 md:p-5">
          <Link className="sticky flex items-center gap-1" href={"/dashboard"}>
            <ChevronLeft size={20} />
            <p>{t("dashboard.details.kolDetails")}</p>
          </Link>
          <div className="mt-3 flex justify-center gap-3 md:hidden">
            {["kolDetails", "tweet"].map((item) => (
              <div
                key={item}
                onClick={() => setSelectedType(item)}
                className={`relative ${
                  selectedType === item
                    ? "font-bold text-primary after:absolute after:-bottom-3 after:left-1 after:right-1 after:h-[2px] after:bg-primary after:content-['']"
                    : "font-normal text-black dark:text-foreground/80"
                }`}
              >
                {t("dashboard.details." + item)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full">
          {selectedType === "kolDetails" && Left}
          {selectedType === "tweet" && Right}
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="cursor-pointe sticky top-0 z-50 border-b bg-background p-3 md:top-14 md:p-5">
        <Link className="sticky flex items-center gap-1" href={"/dashboard"}>
          <ChevronLeft size={20} />
          <p>{t("dashboard.details.kolDetails")}</p>
        </Link>
        <div className="mt-3 flex gap-3 md:hidden">
          {["detail", "tweet"].map((item) => (
            <div
              key={item}
              onClick={() => setSelectedType(item)}
              className={`relative ${
                selectedType === item
                  ? "font-bold text-primary after:absolute after:-bottom-3 after:left-1 after:right-1 after:h-[2px] after:bg-primary after:content-['']"
                  : "font-normal text-black dark:text-foreground/80"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full">
        {Left}
        {Right}
      </div>
    </div>
  );
}
