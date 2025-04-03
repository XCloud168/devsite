"use client";

import { type KolMenu } from "@/app/signal-catcher/_components/kol-banner";
import { MyFollowed } from "@/app/signal-catcher/_components/my-followed";
import { KolPoint } from "@/app/signal-catcher/_components/kol-point";
import { type ServerResult } from "@/lib/server-result";
import React, { type JSX } from "react";
import { FeaturedComponent } from "@/app/signal-catcher/_components/featured-component";
import type { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
type Props = {
  getFollowedListAction: () => Promise<ServerResult>;
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  removeFollowAction: (tweetUid: string) => Promise<ServerResult>;
  menu: KolMenu;
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
  isMember?: boolean | null;
};
export function KolList({
  menu,
  getTweetListAction,
  getFollowedListAction,
  addFollowAction,
  removeFollowAction,
  getSignalListAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
  isMember,
}: Props) {
  const componentsMap: Record<string, JSX.Element> = {
    "1": (
      <div className="bg-gradient-to-b from-[#DEECFF80] to-[#FFFFFF] dark:from-[#0A132580] dark:to-[#050911]">
        <FeaturedComponent
          getSignalListAction={getSignalListAction}
          getTagListAction={getTagListAction}
          getSignalCategoryAction={getSignalCategoryAction}
          getTagDataAction={getTagDataAction}
        />
      </div>
    ),
    "2": (
      <KolPoint
        getTweetListAction={getTweetListAction}
        addFollowAction={addFollowAction}
        isMember={isMember}
      />
    ),
    "3": (
      <MyFollowed
        getTweetListAction={getTweetListAction}
        getFollowedListAction={getFollowedListAction}
        removeFollowAction={removeFollowAction}
        isMember={isMember}
      />
    ),
  };
  return (
    <div className="scroll-container h-[calc(100vh-200px)] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
      {componentsMap[menu.value]}
    </div>
  );
}
