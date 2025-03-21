"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import type { ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
import { type SignalsCategory } from "@/server/db/schemas/signal";
interface Tag {
  id: string;
  name: string;
  logo: string;
  signalsCount: number;
  riseCount: number;
  fallCount: number;
  avgRiseRate: string;
  avgFallRate: string;
  selected?: false;
}
export type FeaturedMenu = {
  label: SIGNAL_PROVIDER_TYPE;
  id: string;
  tags?: Tag[];
};
interface Props {
  onMenuChangeAction: ({
    categoryId,
    providerType,
    entityId,
  }: {
    categoryId: string;
    providerType?: SIGNAL_PROVIDER_TYPE;
    entityId?: string;
  }) => void;
  getTagListAction: (id: string) => Promise<ServerResult>;
  getSignalCategoryAction: () => Promise<ServerResult>;
}

export function FeaturedBanner({
  onMenuChangeAction,
  getTagListAction,
  getSignalCategoryAction,
}: Props) {
  const t = useTranslations();

  // const [showDetails, setShowDetails] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [tagLoading, setTagLoading] = useState<boolean>(true);
  const [signalCategory, setSignalCategory] = useState<SignalsCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [currentTagList, setCurrentTagList] = useState<
    {
      id: string;
      logo: string;
      name: string;
      providerType: SIGNAL_PROVIDER_TYPE;
    }[]
  >([]);
  const handleChangeCategory = async (id: string) => {
    const response = await getTagListAction(id);
    setCurrentTagList(response.data);
    console.log(response);
    setTagLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSignalCategoryAction();
      setSignalCategory(response.data);
      setSelectedCategoryId(response.data[0].id);
      handleChangeCategory(response.data[0].id);
      onMenuChangeAction({
        categoryId: response.data[0].id,
      });
    };
    fetchData();
    // setSignalCategory(response.data);
  }, [getSignalCategoryAction]);
  return (
    <div className="sticky top-0 z-10">
      <div className="flex items-center gap-1 px-5 pt-5">
        <p className="font-bold">{t("signals.signal.curatedSignals")}</p>
        <p className="text-xs text-black/50 dark:text-white/50">
          *{t("signals.signal.notVip")}
        </p>
      </div>
      <div className="flex border-b px-5">
        <div className="grid grid-cols-4 gap-8">
          {signalCategory.map((category) => (
            <div
              key={category.id}
              className={`${selectedCategoryId === category.id ? "border-[#1F72E5] bg-gradient-to-r from-[#1F72E5] to-[#45FA25] bg-clip-text font-bold text-transparent dark:border-[#F2DA18] dark:from-[#F2DA18] dark:to-[#4DFFC4]" : "border-transparent"} cursor-pointer border-b-2 pb-2 pt-3 text-center`}
              onClick={() => {
                setTagLoading(true);
                setSelectedCategoryId(category.id);
                setSelectedTagId("");
                handleChangeCategory(category.id);
                onMenuChangeAction({
                  categoryId: category.id,
                });
              }}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-3">
        {!tagLoading && currentTagList && (
          <Tabs
            defaultValue=""
            className="w-full"
            onValueChange={(event) => {
              setSelectedTagId(event);
              onMenuChangeAction({
                categoryId: selectedCategoryId,
                providerType:
                  currentTagList.find((tag) => tag.id === event)
                    ?.providerType ?? undefined,
                entityId: selectedTagId,
              });
            }}
          >
            <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent">
              {currentTagList.map((tag) => (
                <TabsTrigger
                  key={tag.id}
                  value={tag.id}
                  className="flex w-fit justify-start gap-1 rounded-xl bg-white/50 p-1.5 dark:bg-secondary"
                >
                  <Avatar className="h-5 w-5 rounded-full">
                    <AvatarImage src={tag.logo ?? ""} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p>{tag.name}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      {selectedTagId !== "" ? (
        <div className="relative mx-5 my-3 rounded-xl bg-white/50 py-2 dark:bg-[#161C25]">
          <div className="grid w-full grid-cols-4 gap-3 overflow-hidden">
            <div className="relative w-full px-3">
              <p className="text-xs">Total New Token Listings</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {0}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">Total New Token Listings</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {0}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">Total New Token Listings</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {0}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">Total New Token Listings</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {0}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-3 opacity-0">123</div>
      )}
    </div>
  );
}
