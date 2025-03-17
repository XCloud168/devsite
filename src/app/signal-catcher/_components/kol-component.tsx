"use client";

import { KolBanner, type KolMenu } from "./kol-banner";
import { KolList } from "./kol-list";
import { useState } from "react";
import { type ServerResult } from "@/lib/server-result";
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
};
export function KolComponent({
  getTweetListAction,
  getFollowedListAction,
  addFollowAction,
  removeFollowAction,
}: Props) {
  const [kolMenu, setKolMenu] = useState<KolMenu>({
    label: "KOL观点",
    value: "2",
  });
  return (
    <>
      <KolBanner onKolMenuChange={(menu: KolMenu) => setKolMenu(menu)} />
      <KolList
        menu={kolMenu}
        getTweetListAction={getTweetListAction}
        getFollowedListAction={getFollowedListAction}
        addFollowAction={addFollowAction}
        removeFollowAction={removeFollowAction}
      />
    </>
  );
}
