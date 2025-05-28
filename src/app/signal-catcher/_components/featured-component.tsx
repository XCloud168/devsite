"use client";

import { FeaturedBanner } from "@/app/signal-catcher/_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import { type ServerResult } from "@/lib/server-result";
import { useEffect, useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { type SignalsCategory } from "@/server/db/schemas/signal";
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
  isMobile?: boolean;
};
export function FeaturedComponent({
  getSignalListAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
  isMember,
  isMobile,
}: Props) {
  const [menuInfo, setMenuInfo] = useState<{
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  }>({
    categoryId: "99a07285-aacc-42df-8a44-89dae751a6fd",
  });
  const [signalCategory, setSignalCategory] = useState<SignalsCategory[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (getSignalCategoryAction) {
        const response = await getSignalCategoryAction();
        setSignalCategory(response.data);
      }
    };
    fetchData();
  }, [getSignalCategoryAction]);

  return (
    <div className="overflow-hidden">
      <FeaturedBanner
        signalCategory={signalCategory}
        onMenuChangeAction={(info: {
          categoryId: string;
          providerType?: SIGNAL_PROVIDER_TYPE;
          entityId?: string;
        }) => setMenuInfo(info)}
        getTagListAction={getTagListAction}
        getTagDataAction={getTagDataAction}
        isMember={isMember}
        isMobile={isMobile}
      />
      <FeaturedList
        menuInfo={menuInfo}
        getSignalListAction={getSignalListAction}
        isMobile={isMobile}
      />
    </div>
  );
}
