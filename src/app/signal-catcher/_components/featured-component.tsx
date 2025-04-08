"use client";

import { FeaturedBanner } from "@/app/signal-catcher/_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import { type ServerResult } from "@/lib/server-result";
import { useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
type Props = {
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
export function FeaturedComponent({
  getSignalListAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
  isMember,
}: Props) {
  const [menuInfo, setMenuInfo] = useState<{
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  }>({
    categoryId: "",
  });
  return (
    <div className="overflow-hidden">
      <FeaturedBanner
        onMenuChangeAction={(info: {
          categoryId: string;
          providerType?: SIGNAL_PROVIDER_TYPE;
          entityId?: string;
        }) => setMenuInfo(info)}
        getTagListAction={getTagListAction}
        getSignalCategoryAction={getSignalCategoryAction}
        getTagDataAction={getTagDataAction}
        isMember={isMember}
      />
      {menuInfo.categoryId !== "" && (
        <FeaturedList
          menuInfo={menuInfo}
          getSignalListAction={getSignalListAction}
        />
      )}
    </div>
  );
}
