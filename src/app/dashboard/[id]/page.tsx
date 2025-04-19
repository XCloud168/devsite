import { DetailComponent } from "@/app/dashboard/[id]/_components/detail-component";
import {
  getTwitterUserBasicInfo,
  getTwitterUserDailyWinRate,
  getTwitterUserProjectsPerformance,
  getTwitterUserProjectStats,
  getTwitterUserStats,
  getTwitterUserTweets,
} from "@/server/api/routes/dashboard";

type Params = Promise<{ id: string }>;
const getUserStats = async (userid: string, period: string) => {
  "use server";
  return await getTwitterUserStats(userid, period);
};

const getUserInfo = async (userid: string) => {
  "use server";
  return await getTwitterUserBasicInfo(userid);
};
const getUserDailyWinRate = async (userid: string, period: string) => {
  "use server";
  return await getTwitterUserDailyWinRate(userid, period);
};

const getUserProjectsPerformance = async (userid: string, period: string) => {
  "use server";
  return await getTwitterUserProjectsPerformance(userid, period);
};

const getUserProjectStats = async (userid: string, period: string) => {
  "use server";
  return await getTwitterUserProjectStats(userid, period);
};

const getUserUserTweets = async (
  userid: string,
  period: string,
  page: number,
  pageSize: number,
) => {
  "use server";
  return await getTwitterUserTweets(userid, period, page, pageSize);
};

export default async function UserPage(props: { params: Params }) {
  const params = await props.params;
  return (
    <DetailComponent
      id={params.id}
      getUserStatsAction={getUserStats}
      getUserInfoAction={getUserInfo}
      getUserDailyWinRateAction={getUserDailyWinRate}
      getUserProjectsPerformanceAction={getUserProjectsPerformance}
      getUserProjectStatsAction={getUserProjectStats}
      getUserUserTweetsAction={getUserUserTweets}
    />
  );
}
