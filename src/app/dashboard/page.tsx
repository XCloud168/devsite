import React from "react";
import { DashboardComponent } from "@/app/dashboard/_components/dashboard-component";
import {
  getTop24hGainTweets,
  getTwitterUserGains,
} from "@/server/api/routes/dashboard";
import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const getWinRankingList = async (period: string) => {
    "use server";
    return await getTwitterUserGains(period);
  };
  const get24hRankingList = async () => {
    "use server";
    return await getTop24hGainTweets();
  };
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const { device } = UAParser(userAgent);
  // 判断是否是移动设备
  const isMobile = device.type === "mobile" || device.type === "tablet";
  return (
    <>
      <DashboardComponent
        getWinRankingListAction={getWinRankingList}
        get24hRankingListAction={get24hRankingList}
        isMobile={isMobile}
      />
    </>
  );
}
