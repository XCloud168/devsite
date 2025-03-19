"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import type { ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
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
  onFeaturedMenuChangeAction: (menu: FeaturedMenu) => void;
  getTagListAction: (type: SIGNAL_PROVIDER_TYPE) => Promise<ServerResult>;
  onTagChangeAction: (id: string) => void;
}
export const featuredMenu: FeaturedMenu[] = [
  {
    label: SIGNAL_PROVIDER_TYPE.TWITTER,
    id: "1",
  },
  {
    label: SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT,
    id: "2",
  },
];
export function FeaturedBanner({
  onFeaturedMenuChangeAction,
  getTagListAction,
  onTagChangeAction,
}: Props) {
  const t = useTranslations();
  const [selectedMenu, setSelectedMenu] = useState<FeaturedMenu>({
    label: SIGNAL_PROVIDER_TYPE.TWITTER,
    id: "1",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [tagLoading, setTagLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTagListAction(SIGNAL_PROVIDER_TYPE.TWITTER);
      setSelectedMenu({
        ...selectedMenu,
        tags: response.data.map((item: Tag) => ({
          ...item,
          selected: false,
        })),
      });
      setTagLoading(false);
    };
    fetchData();
  }, [getTagListAction]);
  const handleChangeTag = async (menu: FeaturedMenu) => {
    const response = await getTagListAction(menu.label);
    setSelectedMenu({
      ...menu,
      tags: response.data.map((item: Tag) => ({
        ...item,
        selected: false,
      })),
    });

    setTagLoading(false);
  };
  const selectedTag = useMemo(() => {
    const list: Tag[] | undefined = selectedMenu.tags?.filter(
      (item: Tag) => item.id === selectedTagId,
    );
    if (list && list.length > 0) {
      return list[0];
    }
    return {
      id: "string",
      name: "string",
      logo: "string",
      signalsCount: 0,
      riseCount: 0,
      fallCount: 0,
      avgRiseRate: 0,
      avgFallRate: 0,
      selected: false,
    };
  }, [selectedMenu.tags, selectedTagId]);

  return (
    <div className="sticky top-0 z-10 bg-background">
      <div className="flex border-b p-5">
        <p className="">{t("signals.signal.curatedSignals")}</p>
        <p className="text-black/50 dark:text-white/50">
          （{t("signals.signal.notVip")}）
        </p>
      </div>
      <div className="flex border-b px-5">
        <div className="grid grid-cols-6 gap-8">
          {featuredMenu.map((menu) => (
            <div
              key={menu.id}
              className={`${selectedMenu?.id === menu.id ? "border-primary font-bold text-primary" : "border-transparent text-black dark:text-white"} cursor-pointer border-b-2 pb-2 pt-5 text-center hover:text-primary`}
              onClick={() => {
                setTagLoading(true);
                onFeaturedMenuChangeAction(menu);
                setSelectedMenu(menu);
                handleChangeTag(menu);
              }}
            >
              {menu.label.replace(/^\w/, (c) => c.toUpperCase())}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-3">
        {!tagLoading && selectedMenu && (
          <Tabs
            defaultValue={selectedMenu.tags?.find((item) => item.selected)?.id}
            className="w-full"
            onValueChange={(event) => {
              setSelectedTagId(event);
              onTagChangeAction(event);
              setShowDetails(true);
            }}
          >
            <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-lg bg-transparent">
              {selectedMenu.tags?.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex w-fit justify-start gap-1 bg-secondary"
                >
                  <Avatar className="h-5 w-5 rounded-md">
                    <AvatarImage src={item.logo ?? ""} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p>{item.name}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      <div
        className={`relative mb-5 border-b ${showDetails ? "p-3" : "p-1.5"}`}
      >
        <div
          className={`absolute left-1/2 h-2 w-10 -translate-x-1/2 cursor-pointer bg-[url('/images/signal/triangle.svg')] bg-contain bg-center bg-no-repeat ${
            showDetails ? "bottom-0 rotate-180" : "bottom-[-8px]"
          }`}
          onClick={() => setShowDetails((prev) => !prev)}
        ></div>
        <div
          className={`grid w-full grid-cols-4 gap-3 overflow-hidden transition-all duration-500 ease-in-out ${
            showDetails ? "grid" : "hidden"
          }`}
        >
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="font-bold text-primary">
              {selectedTag?.signalsCount}
            </p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="font-bold text-primary">
              {selectedTag?.signalsCount}
            </p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="font-bold text-primary">{selectedTag?.fallCount}</p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="font-bold text-primary">{selectedTag?.avgRiseRate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
