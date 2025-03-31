import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizeable";
import { KolComponent } from "@/app/signal-catcher/_components/kol-component";
import {
  addTweetFollowed,
  deleteTweetFollowed,
  getTweetFollowedList,
  getTweetsByPaginated,
  getTweetUserByScreenName,
} from "@/server/api/routes/tweets";
import {
  getSignalCategories,
  getSignalsByPaginated,
  getSignalEntitiesByCategory,
  getTagStatistics,
} from "@/server/api/routes/signal";

import { FeaturedComponent } from "@/app/signal-catcher/_components/featured-component";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import React from "react";
import RealtimeSignal from "@/components/signals/realtime-signal";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { getUserProfile } from "@/server/api/routes/auth";

export default async function SignalPage() {
  //获取推特列表
  const getTweetList = async (
    page: number,
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
  ) => {
    "use server";
    return await getTweetsByPaginated(page, filter);
  };
  //获取信号列表
  const getSignalList = async (
    page: number,
    filter: {
      categoryId: string;
      providerType?: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
  ) => {
    "use server";
    return await getSignalsByPaginated(page, filter);
  };
  //获取关注列表
  const getFollowedList = async () => {
    "use server";
    return await getTweetFollowedList();
  };
  //添加监控
  const addFollow = async (tweetUid: string) => {
    "use server";
    return await addTweetFollowed(tweetUid);
  };
  //取消监控
  const removeFollow = async (tweetUid: string) => {
    "use server";
    return await deleteTweetFollowed(tweetUid);
  };
  //获取标签统计数据
  const getTagData = async (type: SIGNAL_PROVIDER_TYPE, entityId: string) => {
    "use server";
    return await getTagStatistics(type, { entityId: entityId });
  };
  //信号类别
  const getSignalCategory = async () => {
    "use server";
    return await getSignalCategories();
  };
  //查询标签
  const getSignalTagsByCode = async (CategoryId: string) => {
    "use server";
    return await getSignalEntitiesByCategory(CategoryId);
  };
  //搜索用户
  const searchTweetUser = async (name: string) => {
    "use server";
    return await getTweetUserByScreenName(name);
  };

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const { device } = UAParser(userAgent);
  // 判断是否是移动设备
  const isMobile = device.type === "mobile" || device.type === "tablet";
  //获取用户信息
  const user = await getUserProfile();
  const isMember =
    user?.membershipExpiredAt &&
    new Date(user?.membershipExpiredAt) > new Date();
  if (isMobile) {
    return (
      <>
        <KolComponent
          searchTweetUserAction={searchTweetUser}
          getTweetListAction={getTweetList}
          getFollowedListAction={getFollowedList}
          addFollowAction={addFollow}
          removeFollowAction={removeFollow}
          getSignalListAction={getSignalList}
          getTagListAction={getSignalTagsByCode}
          getSignalCategoryAction={getSignalCategory}
          getTagDataAction={getTagData}
          isMobile={isMobile}
          isMember={isMember}
        />
        <RealtimeSignal />
      </>
    );
  }
  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={55}>
          <div className="block items-center justify-center">
            <KolComponent
              getTweetListAction={getTweetList}
              getFollowedListAction={getFollowedList}
              addFollowAction={addFollow}
              removeFollowAction={removeFollow}
              searchTweetUserAction={searchTweetUser}
              isMember={isMember}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-primary/20" withHandle />
        <ResizablePanel
          defaultSize={45}
          minSize={35}
          maxSize={50}
          className="relative"
        >
          <div className="absolute h-svh w-full bg-gradient-to-b from-[#DEECFF80] to-[#FFFFFF] dark:from-[#0A132580] dark:to-[#050911]"></div>
          <div className="relative block items-center justify-center overflow-hidden">
            <FeaturedComponent
              getSignalListAction={getSignalList}
              getTagListAction={getSignalTagsByCode}
              getSignalCategoryAction={getSignalCategory}
              getTagDataAction={getTagData}
            />
            <div className="fixed bottom-0 z-[1] h-[438px] w-full bg-[url(/images/signal/featured-bg.svg)] bg-contain bg-no-repeat"></div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <RealtimeSignal />
    </>
  );
}
