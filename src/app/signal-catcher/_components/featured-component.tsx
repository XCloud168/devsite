"use client";

import { FeaturedBanner } from "@/app/signal-catcher/_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import { type ServerResult } from "@/lib/server-result";
import { useEffect, useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { type SignalsCategory } from "@/server/db/schemas/signal";
type Props = {
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
  isMember?: boolean | null;
  isMobile?: boolean;
  getContractInfoAction: (contractAddress: string) => Promise<ServerResult>;
};
export function FeaturedComponent({
  getSignalListAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
  isMember,
  isMobile,
  getContractInfoAction,
}: Props) {
  const [menuInfo, setMenuInfo] = useState<{
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  }>({
    categoryId: "99a07285-aacc-42df-8a44-89dae751a6fd",
  });
  const [signalCategory, setSignalCategory] = useState<SignalsCategory[]>([]);

  const [currentTagList, setCurrentTagList] = useState<
    {
      id: string;
      logo: string;
      name: string;
      providerType: SIGNAL_PROVIDER_TYPE;
    }[]
  >([]);
  const [tagLoading, setTagLoading] = useState<boolean>(true);
  useEffect(() => {
    const handleChangeCategory = async (id: string) => {
      if (getTagListAction) {
        const response = await getTagListAction(id);
        setCurrentTagList(response.data);
        setTagLoading(false);
      }
    };
    const fetchData = async () => {
      if (getSignalCategoryAction) {
        const response = await getSignalCategoryAction();
        setSignalCategory(response.data);
        handleChangeCategory(response.data[0].id).then();
      }
    };
    fetchData().then();
  }, [getSignalCategoryAction, getTagListAction]);

  return (
    <div className="overflow-hidden">
      <FeaturedBanner
        signalCategory={signalCategory}
        onMenuChangeAction={(info: {
          categoryId: string;
          providerType?: SIGNAL_PROVIDER_TYPE;
          entityId?: string;
        }) => {
          setMenuInfo(info);
        }}
        onTagChangeAction={(flag: boolean) => {
          setTagLoading(flag);
        }}
        tagLoading={tagLoading}
        currentTagList={currentTagList}
        getTagDataAction={getTagDataAction}
        isMember={isMember}
        isMobile={isMobile}
      />
      <FeaturedList
        onFinishFetchAction={() => {
          if (getTagListAction) {
            getTagListAction(menuInfo.categoryId).then((response) => {
              setCurrentTagList(response.data);
              setTagLoading(false);
            });
          }
        }}
        menuInfo={menuInfo}
        getSignalListAction={getSignalListAction}
        isMobile={isMobile}
        getContractInfoAction={getContractInfoAction}
      />
    </div>
  );
}
