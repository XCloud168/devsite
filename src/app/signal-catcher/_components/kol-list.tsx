"use client";

import { type KolMenu } from "@/app/signal-catcher/_components/kol-banner";
import { MyFollowed } from "@/app/signal-catcher/_components/my-followed";
import { KolPoint } from "@/app/signal-catcher/_components/kol-point";
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
  return (
    <div className="scroll-container h-[calc(100vh-124px)] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
      {menu.value === "2" ? (
        <KolPoint
          getTweetListAction={getTweetListAction}
          addFollowAction={addFollowAction}
        ></KolPoint>
      ) : (
        <MyFollowed
          getTweetListAction={getTweetListAction}
          getFollowedListAction={getFollowedListAction}
          removeFollowAction={removeFollowAction}
        ></MyFollowed>
      )}
    </div>
  );
}
