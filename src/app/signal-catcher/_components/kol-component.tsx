"use client";

import { KolBanner, type KolMenu } from "./kol-banner";
import { KolList } from "./kol-list";
import { useCallback, useEffect, useState } from "react";
import { type ServerResult } from "@/lib/server-result";
import type { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { WatchItem } from "@/app/signal-catcher/_components/my-followed";
type Props = {
  getFollowedListAction: () => Promise<ServerResult>;
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  removeFollowAction: (tweetUid: string) => Promise<ServerResult>;
  getTweetListAction: (
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
    cursor?: string,
  ) => Promise<ServerResult>;
  getSignalListAction?: (
    filter: {
      categoryId: string;
      providerType?: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
    cursor?: string,
  ) => Promise<ServerResult>;
  getTagListAction?: (id: string) => Promise<ServerResult>;
  getSignalCategoryAction?: () => Promise<ServerResult>;
  getTagDataAction?: (
    providerType: SIGNAL_PROVIDER_TYPE,
    entityId: string,
  ) => Promise<ServerResult>;
  isMobile?: boolean;
  searchTweetUserAction: (name: string) => Promise<ServerResult>;
  isMember?: boolean | null;
  isLogged: boolean;
  getContractInfoAction: (contractAddress: string) => Promise<ServerResult>;
};
export function KolComponent({
  getTweetListAction,
  getFollowedListAction,
  addFollowAction,
  removeFollowAction,
  getSignalListAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
  isMobile,
  searchTweetUserAction,
  isMember,
  isLogged,
  getContractInfoAction,
}: Props) {
  const [kolMenu, setKolMenu] = useState<KolMenu>(
    isMobile
      ? {
          label: "curatedSignals",
          value: "1",
        }
      : {
          label: "kol",
          value: "2",
        },
  );
  const [tableData, setTableData] = useState<WatchItem[]>([]);
  const [tableDataLoading, setTableDataLoading] = useState<boolean>(false);
  const getTableData = useCallback(() => {
    const fetchData = async () => {
      const response = await getFollowedListAction();
      setTableData(response.data);
      console.log(response.data);
      setTableDataLoading(false);
    };
    fetchData();
  }, [getFollowedListAction]);
  useEffect(() => {
    if (kolMenu.value === "2") getTableData();
  }, [getTableData, kolMenu]);
  return (
    <div className="">
      <KolBanner
        onKolMenuChangeAction={(menu: KolMenu) => setKolMenu(menu)}
        isMobile={isMobile}
        searchTweetUserAction={searchTweetUserAction}
        addFollowAction={addFollowAction}
        isMember={isMember}
        isLogged={isLogged}
        onAddSuccessAction={() => getTableData()}
      />
      <KolList
        menu={kolMenu}
        getTweetListAction={getTweetListAction}
        followedList={tableData}
        followedListLoading={tableDataLoading}
        addFollowAction={addFollowAction}
        removeFollowAction={removeFollowAction}
        getSignalListAction={getSignalListAction}
        getTagListAction={getTagListAction}
        getSignalCategoryAction={getSignalCategoryAction}
        getTagDataAction={getTagDataAction}
        isMember={isMember}
        isLogged={isLogged}
        isMobile={isMobile}
        onRemoveSuccessAction={() => getTableData()}
        onAddSuccessAction={() => getTableData()}
        getContractInfoAction={getContractInfoAction}
      />
    </div>
  );
}
