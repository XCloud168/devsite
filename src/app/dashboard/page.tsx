import React from "react";
import { DashboardComponent } from "@/app/dashboard/_components/dashboard-component";
import {
  getTop24hGainTweets,
  getTwitterUserGains,
} from "@/server/api/routes/dashboard";

export default async function DashboardPage() {
  const getWinRankingList = async (period: string) => {
    "use server";
    return await getTwitterUserGains(period);
  };
  const get24hRankingList = async () => {
    "use server";
    return await getTop24hGainTweets();
  };

  return (
    <>
      <DashboardComponent
        getWinRankingListAction={getWinRankingList}
        get24hRankingListAction={get24hRankingList}
      />
    </>
  );
}
