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
  getSignalTagsByType,
  getTagStatistics,
} from "@/server/api/routes/signal";

import { FeaturedComponent } from "@/app/signal-catcher/_components/featured-component";
import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";

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
      providerId?: string;
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
    <div className="w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={50}>
          <div className="scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-500 block h-[calc(100vh-60px)] items-center justify-center overflow-y-scroll">
            <KolComponent
              getTweetListAction={getTweetList}
              getFollowedListAction={getFollowedList}
              addFollowAction={addFollow}
              removeFollowAction={removeFollow}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} maxSize={50} minSize={30}>
          <div className="scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-500 block h-[calc(100vh-60px)] items-center justify-center overflow-y-scroll">
            <FeaturedComponent
              getSignalListAction={getSignalList}
              getTagListAction={getTagList}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
