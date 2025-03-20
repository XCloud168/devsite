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
} from "@/server/api/routes/tweets";
import {
  getSignalsByPaginated,
  getTagStatistics,
} from "@/server/api/routes/signal";

import { FeaturedComponent } from "@/app/signal-catcher/_components/featured-component";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import React from "react";

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
      providerType: SIGNAL_PROVIDER_TYPE;
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
  //获取标签列表
  const getTagList = async (type: SIGNAL_PROVIDER_TYPE) => {
    "use server";
    return await getTagStatistics(type, {});
  };
  return (
    <div className="w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={55}>
          <div className="block items-center justify-center">
            <KolComponent
              getTweetListAction={getTweetList}
              getFollowedListAction={getFollowedList}
              addFollowAction={addFollow}
              removeFollowAction={removeFollow}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-primary/60" withHandle />
        <ResizablePanel defaultSize={45} minSize={35} maxSize={50}>
          <div className="relative block items-center justify-center overflow-hidden bg-gradient-to-r from-[#DEECFF] to-[#FFFFFF] dark:from-[#0A1325] dark:to-[#050911]">
            <FeaturedComponent
              getSignalListAction={getSignalList}
              getTagListAction={getTagList}
            />
            <div className="fixed bottom-0 z-[1] h-[438px] w-full bg-[url(/images/signal/featured-bg.svg)] bg-contain bg-no-repeat"></div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
