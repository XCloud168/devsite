"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import type { ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
import { type SignalsCategory } from "@/server/db/schemas/signal";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  getTagListAction?: (id: string) => Promise<ServerResult>;
  getSignalCategoryAction?: () => Promise<ServerResult>;
  getTagDataAction?: (
    providerType: SIGNAL_PROVIDER_TYPE,
    entityId: string,
  ) => Promise<ServerResult>;
}

export function FeaturedBanner({
  onMenuChangeAction,
  getTagListAction,
  getSignalCategoryAction,
  getTagDataAction,
}: Props) {
  const t = useTranslations();

  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [tagLoading, setTagLoading] = useState<boolean>(true);
  const [signalCategory, setSignalCategory] = useState<SignalsCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [tagData, setTagData] = useState<Tag>();
  const [currentTagList, setCurrentTagList] = useState<
    {
      id: string;
      logo: string;
      name: string;
      providerType: SIGNAL_PROVIDER_TYPE;
    }[]
  >([]);
  const handleChangeCategory = async (id: string) => {
    if (getTagListAction) {
      const response = await getTagListAction(id);
      setCurrentTagList(response.data);
      setTagLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (getSignalCategoryAction) {
        const response = await getSignalCategoryAction();
        setSignalCategory(response.data);
        setSelectedCategoryId(response.data[0].id);
        handleChangeCategory(response.data[0].id);
        onMenuChangeAction({
          categoryId: response.data[0].id,
        });
      }
    };
    fetchData();
    // setSignalCategory(response.data);
  }, [getSignalCategoryAction]);

  const handleGetTagData = (entityId: string) => {
    const current = currentTagList.find((tag) => tag.id === entityId);
    if (!current) return;
    const fetchData = async () => {
      if (getTagDataAction) {
        const response = await getTagDataAction(
          current?.providerType,
          entityId,
        );
        setTagData(response.data[0]);
      }
    };
    fetchData();
  };
  const riseRate = useMemo(() => {
    if (tagData?.riseCount && tagData?.signalsCount) {
      return `${((tagData?.riseCount / tagData?.signalsCount) * 100).toFixed(
        2,
      )}%`;
    }
    return "--";
  }, [tagData]);

  const tabRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // 检查是否需要显示按钮
  const checkScrollable = () => {
    if (tabRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [signalCategory]);

  useEffect(() => {
    if (tabRef.current) {
      tabRef.current.addEventListener("scroll", checkScrollable);
    }
    return () => {
      if (tabRef.current) {
        tabRef.current.removeEventListener("scroll", checkScrollable);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (tabRef.current) {
      const scrollAmount = 100; // 每次滚动的距离
      tabRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-0 z-10">
      <div className="flex items-center gap-1 p-5">
        <p className="font-bold">{t("signals.signal.curatedSignals")}</p>
        <p className="text-xs text-black/50 dark:text-white/50">
          *{t("signals.signal.notVip")}
        </p>
      </div>
      <div className="relative border-b px-5">
        {/* 左滑按钮（如果 showLeftButton 为 true 才显示） */}
        {showLeftButton && (
          <button
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/80 p-1 shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft />
          </button>
        )}
        {/* 右滑按钮（如果 showRightButton 为 true 才显示） */}
        {showRightButton && (
          <button
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/80 p-1 shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight />
          </button>
        )}
        {/* 滚动容器 */}
        <div
          ref={tabRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth whitespace-nowrap"
        >
          {signalCategory.map((category) => (
            <div
              key={category.id}
              className={`${selectedCategoryId === category.id ? "border-[#1F72E5] bg-gradient-to-r from-primary to-primary bg-clip-text font-bold text-primary dark:border-[#F2DA18] dark:from-[#F2DA18] dark:to-[#4DFFC4] dark:text-transparent" : "border-transparent"} min-w-max cursor-pointer border-b-2 pb-2 pt-3 text-center`}
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
              {t("signals.signal." + category.code)}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-3">
        {tagLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Tabs
            defaultValue=""
            className="w-full"
            onValueChange={(event) => {
              setSelectedTagId(event);
              handleGetTagData(event);
              onMenuChangeAction({
                categoryId: selectedCategoryId,
                providerType:
                  currentTagList.find((tag) => tag.id === event)
                    ?.providerType ?? undefined,
                entityId: event,
              });
            }}
          >
            <TabsList className="flex h-auto flex-wrap justify-start gap-3 bg-transparent">
              {currentTagList.map((tag) => (
                <TabsTrigger
                  key={tag.id}
                  value={tag.id}
                  className="flex w-fit justify-start gap-1 rounded-full bg-white/50 py-1.5 pl-1.5 pr-2 dark:bg-[#161C25]"
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
              <p className="text-xs">{t("signals.signal.totalTokenSignals")}</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {tagData?.signalsCount || "--"}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">{t("signals.signal.tokenGainCount")}</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {tagData?.riseCount || "--"}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">{t("signals.signal.tokenGainRatio")}</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {riseRate}
              </p>
            </div>
            <div className="relative w-full px-3">
              <p className="text-xs">{t("signals.signal.24hAverageMaxGain")}</p>
              <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                {tagData?.avgRiseRate ? tagData?.avgRiseRate + "%" : "--"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-3 opacity-0">123</div>
      )}
    </div>
  );
}
