"use client";

import {
  FeaturedBanner,
  FeaturedMenu,
} from "@/app/signal-catcher/_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import { SIGNAL_PROVIDER_TYPE } from "@/types/constants";
import { ServerResult } from "@/lib/server-result";
import { useState } from "react";
type Props = {
  getSignalListAction: (
    page: number,
    filter: {
      providerType: SIGNAL_PROVIDER_TYPE;
      providerId?: string;
    },
  ) => Promise<ServerResult>;
};
export function FeaturedComponent({ getSignalListAction }: Props) {
  const [featuredMenu, setFeaturedMenu] = useState<FeaturedMenu>({
    label: "twitter",
    id: "1",
    children: [
      {
        label: "Binance",
        id: "1-1",
        selected: true,
      },
      {
        label: "OKX",
        id: "1-2",
        selected: false,
      },
      {
        label: "Coinbase",
        id: "1-3",
        selected: false,
      },
      {
        label: "Upbit",
        id: "1-4",
        selected: false,
      },
    ],
  });
  return (
    <>
      <FeaturedBanner
        onFeaturedMenuChangeAction={(menu: FeaturedMenu) =>
          setFeaturedMenu(menu)
        }
      />
      <FeaturedList
        menu={featuredMenu}
        getSignalListAction={getSignalListAction}
      />
    </>
  );
}
