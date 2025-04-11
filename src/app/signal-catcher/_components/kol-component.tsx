"use client";

import { KolBanner, type KolMenu } from "./kol-banner";
import { KolList } from "./kol-list";
import { useState } from "react";
import { type ServerResult } from "@/lib/server-result";
import type { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
type Props = {
  getFollowedListAction: () => Promise<ServerResult>;
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  removeFollowAction: (tweetUid: string) => Promise<ServerResult>;
  getTweetListAction: (
    page: number,
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
  ) => Promise<ServerResult>;
  getSignalListAction?: (
    page: number,
    filter: {
      categoryId: string;
      providerType?: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
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
}: Props) {
  const [kolMenu, setKolMenu] = useState<KolMenu>({
    label: "kolPoint",
    value: "2",
  });
  return (
    <div className="">
      <KolBanner
        onKolMenuChangeAction={(menu: KolMenu) => setKolMenu(menu)}
        isMobile={isMobile}
        searchTweetUserAction={searchTweetUserAction}
        addFollowAction={addFollowAction}
        isMember={isMember}
        isLogged={isLogged}
      />
      <KolList
        menu={kolMenu}
        getTweetListAction={getTweetListAction}
        getFollowedListAction={getFollowedListAction}
        addFollowAction={addFollowAction}
        removeFollowAction={removeFollowAction}
        getSignalListAction={getSignalListAction}
        getTagListAction={getTagListAction}
        getSignalCategoryAction={getSignalCategoryAction}
        getTagDataAction={getTagDataAction}
        isMember={isMember}
        isLogged={isLogged}
      />
    </div>
  );
}
