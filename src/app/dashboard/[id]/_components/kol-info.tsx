"use client";

import React from "react";
import { formatNumber } from "@/components/formatNumber";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

interface Props {
  userInfo: {
    avatar: string;
    description: string;
    followersCount: number;
    id: string;
    name: string;
    screenName: string;
  };
  userState: {
    positiveRatePercentage: string;
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
  };
}

export function KolInfo({ userInfo, userState }: Props) {
  const t = useTranslations();
  return (
    <div className="mt-3 rounded-xl bg-[#4949493a] p-3">
      <div className="flex items-center gap-2">
        <div className="h-16 w-16 rounded-full ring-1">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userInfo.avatar ?? ""} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-xl font-semibold">{userInfo.name}</p>
          <p className="text-sm text-white/60">
            @{userInfo.screenName} {formatNumber(userInfo.followersCount)}{" "}
            {t("dashboard.winRanking.followers")}
          </p>
        </div>
      </div>
      <p className="mt-5 text-xs">{userInfo.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-y-3 md:grid-cols-4 md:gap-y-0">
        <div className="flex flex-col justify-center">
          <p className="text-xs">{t("dashboard.winRanking.winRate")}</p>
          <p className="text-[#FFB41D] dark:text-[#FFFFA7]">
            {userState.positiveRatePercentage}%
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs">{t("dashboard.winRanking.record")}</p>
          {userState.maxHighRateProject ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={userState.maxHighRateProject.logo ?? ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p>{userState.maxHighRateProject.symbol}</p>
              <p className="text-primary">+{userState.maxHighRate}%</p>
            </div>
          ) : (
            "--"
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs">{t("dashboard.details.drawDown")}</p>
          {userState.maxLowRateProject ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={userState.maxLowRateProject.logo ?? ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p>{userState.maxLowRateProject.symbol}</p>
              <p className="text-[#FF5151]">{userState.maxLowRate}%</p>
            </div>
          ) : (
            "--"
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs">{t("dashboard.details.tokensSignaled")}</p>
          <p className="text-primary">{userState.projectsCount}</p>
        </div>
      </div>
    </div>
  );
}
