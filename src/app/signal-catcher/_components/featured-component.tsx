"use client";

import {
  FeaturedBanner,
  type FeaturedMenu,
} from "@/app/signal-catcher/_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import { type ServerResult } from "@/lib/server-result";
import { useState } from "react";
import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
type Props = {
  getSignalListAction: (
    page: number,
    filter: {
      providerType: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
  ) => Promise<ServerResult>;
  getTagListAction: (type: SIGNAL_PROVIDER_TYPE) => Promise<ServerResult>;
};
export function FeaturedComponent({
  getSignalListAction,
  getTagListAction,
}: Props) {
  const [featuredMenu, setFeaturedMenu] = useState<FeaturedMenu>({
    label: SIGNAL_PROVIDER_TYPE.TWITTER,
    id: "1",
  });
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  return (
    <div className="scroll-container scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-500 h-[calc(100vh-60px)] overflow-y-scroll">
      <FeaturedBanner
        onFeaturedMenuChangeAction={(menu: FeaturedMenu) =>
          setFeaturedMenu(menu)
        }
        getTagListAction={getTagListAction}
        onTagChangeAction={(id: string) => {
          setSelectedTagId(id);
        }}
      />
      <FeaturedList
        menu={featuredMenu}
        getSignalListAction={getSignalListAction}
        tagId={selectedTagId}
      />
    </div>
  );
}
