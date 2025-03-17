"use client";

import { type KolMenu } from "@/app/signal-catcher/_components/kol-banner";
import { KolPanel3 } from "@/app/signal-catcher/_components/kolPanel3";
import { KolPanel2 } from "@/app/signal-catcher/_components/kolPanel2";
import { type ServerResult } from "@/lib/server-result";
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
};
export function KolList({
  menu,
  getTweetListAction,
  getFollowedListAction,
  addFollowAction,
  removeFollowAction,
}: Props) {
  if (menu.value === "2") {
    return (
      <KolPanel2
        getTweetListAction={getTweetListAction}
        addFollowAction={addFollowAction}
      ></KolPanel2>
    );
  }
  return (
    <KolPanel3
      getTweetListAction={getTweetListAction}
      getFollowedListAction={getFollowedListAction}
      removeFollowAction={removeFollowAction}
    ></KolPanel3>
  );
}
