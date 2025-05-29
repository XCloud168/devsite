"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import type { ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
import { type SignalsCategory } from "@/server/db/schemas/signal";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSessionStorageState } from "@/components/SessionStorageWatcher";
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

  getTagDataAction?: (
    providerType: SIGNAL_PROVIDER_TYPE,
    entityId: string,
  ) => Promise<ServerResult>;
  isMember?: boolean | null;
  isMobile?: boolean;
  signalCategory: SignalsCategory[];
  tagLoading: boolean;
  currentTagList: {
    id: string;
    logo: string;
    name: string;
    providerType: SIGNAL_PROVIDER_TYPE;
  }[];
  onTagChangeAction: (flag: boolean) => void;
}

export function FeaturedBanner({
  signalCategory,
  onMenuChangeAction,
  tagLoading,
  currentTagList,
  getTagDataAction,
  isMember,
  isMobile,
  onTagChangeAction,
}: Props) {
  const t = useTranslations();
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [tagData, setTagData] = useState<Tag>();
  const [tabDataLoading, setTabDataLoading] = useState<boolean>(false);
  useEffect(() => {
    if (signalCategory?.[0]) {
      setSelectedCategoryId(signalCategory[0].id);
    }
  }, [signalCategory]);

  const handleGetTagData = (entityId: string) => {
    const current = currentTagList.find((tag) => tag.id === entityId);
    if (!current) return;
    const fetchData = async () => {
      if (getTagDataAction) {
        setTabDataLoading(true);
        const response = await getTagDataAction(
          current?.providerType,
          entityId,
        );
        setTabDataLoading(false);
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
  const [showDetail, setShowDetail] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1); // 减1是为了防止浮点误差
    };
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [selectedCategoryId, tagLoading]);
  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };
  const DetailDialog = () => {
    return (
      <Dialog
        open={showDetail}
        onOpenChange={(f) => {
          setShowDetail(f);
        }}
      >
        <DialogTrigger className="w-full">
          <div className="w-full px-5 py-3">
            <div className="flex items-center justify-between rounded-lg bg-[#4949493a] p-3 text-left">
              <div>
                <p>
                  {t("signals.signal.totalTokenSignals")}/
                  {t("signals.signal.tokenGainCount")}
                </p>
                <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                  {tagData?.signalsCount || "--"} /{" "}
                  {tagData?.avgRiseRate ? tagData?.avgRiseRate + "%" : "--"}
                </p>
              </div>
              <div>
                <ChevronRight />
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[94%] gap-0 p-4 md:w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-left">
              {t("common.detail")}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid w-full grid-cols-2 gap-3 overflow-hidden">
            <div className="relative w-full rounded-lg bg-[#4949493a] p-3">
              <p className="text-xs">{t("signals.signal.totalTokenSignals")}</p>
              {!tabDataLoading ? (
                <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                  {tagData?.signalsCount || "--"}
                </p>
              ) : (
                <div className="flex">
                  <Loader2 className="mt-1 h-6 w-6 animate-spin text-[#1976F7] dark:text-[#F2DA18]" />
                </div>
              )}
            </div>
            <div className="relative w-full rounded-lg bg-[#4949493a] p-3">
              <p className="text-xs">{t("signals.signal.tokenGainCount")}</p>
              {!tabDataLoading ? (
                <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                  {tagData?.riseCount || "--"}
                </p>
              ) : (
                <div className="flex">
                  <Loader2 className="mt-1 h-6 w-6 animate-spin text-[#1976F7] dark:text-[#F2DA18]" />
                </div>
              )}
            </div>
            <div className="relative w-full rounded-lg bg-[#4949493a] p-3">
              <p className="text-xs">{t("signals.signal.tokenGainRatio")}</p>
              {!tabDataLoading ? (
                <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                  {riseRate}
                </p>
              ) : (
                <div className="flex">
                  <Loader2 className="mt-1 h-6 w-6 animate-spin text-[#1976F7] dark:text-[#F2DA18]" />
                </div>
              )}
            </div>
            <div className="relative w-full rounded-lg bg-[#4949493a] p-3">
              <p className="text-xs">{t("signals.signal.24hAverageMaxGain")}</p>
              {!tabDataLoading ? (
                <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                  {tagData?.avgRiseRate ? tagData?.avgRiseRate + "%" : "--"}
                </p>
              ) : (
                <div className="flex">
                  <Loader2 className="mt-1 h-6 w-6 animate-spin text-[#1976F7] dark:text-[#F2DA18]" />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  const [newSignal, setNewSignal] = useSessionStorageState<string>(
    "newSignal",
    "",
  );
  const newSignalList = useMemo(() => {
    if (newSignal && newSignal !== "") {
      return Array.from(new Set(newSignal.split(",")));
    }
    return [];
  }, [newSignal]);

  return (
    <div className="sticky top-0 z-10">
      {!isMobile && (
        <div className="flex items-center gap-1 p-5">
          <p className="font-bold">{t("signals.signal.curatedSignals")}</p>
          <p className="text-xs text-black/50 dark:text-white/50">
            *
            {!isMember ? t("signals.signal.notVip") : t("signals.signal.isVip")}
          </p>
        </div>
      )}
      <div className="relative border-b px-5">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth whitespace-nowrap">
          {signalCategory.map((category) => (
            <div
              key={category.id}
              className={`relative ${selectedCategoryId === category.id ? "border-primary bg-gradient-to-r from-primary to-primary bg-clip-text font-bold text-primary dark:border-[#F2DA18] dark:from-[#F2DA18] dark:to-[#4DFFC4] dark:text-transparent" : "border-transparent"} min-w-max cursor-pointer border-b-2 pb-2 pt-3 text-center`}
              onClick={() => {
                onTagChangeAction(true);
                onMenuChangeAction({
                  categoryId: category.id,
                });
                setSelectedCategoryId(category.id);
                setSelectedTagId("");
                // handleChangeCategory(category.id);

                setNewSignal(
                  newSignalList
                    .filter((item) => item !== category.id)
                    .join(","),
                );
                window.dispatchEvent(new Event("session-storage-update"));
              }}
            >
              {t("signals.signal." + category.code)}
              {selectedCategoryId !== category.id &&
                newSignalList.includes(category.id) && (
                  <div className="absolute -right-1 top-3 h-2 w-2 rounded-full bg-red-500"></div>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-3">
        {tagLoading ? (
          <Skeleton className="h-10 w-full bg-secondary" />
        ) : (
          <div className="relative">
            {!isMobile && showLeft && (
              <button
                onClick={() => scrollBy(-200)}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-black/80 p-2 shadow"
              >
                <ChevronLeft />
              </button>
            )}

            {!isMobile && showRight && (
              <button
                onClick={() => scrollBy(200)}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-black/80 p-2 shadow"
              >
                <ChevronRight />
              </button>
            )}
            <div
              ref={scrollRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth whitespace-nowrap"
            >
              {currentTagList.map((tag) => (
                <div
                  className={`${selectedTagId === tag.id ? "bg-primary/20" : "bg-[#4949493a]"} flex cursor-pointer items-center justify-center gap-1.5 rounded-lg p-2`}
                  key={tag.id}
                  onClick={() => {
                    setSelectedTagId(tag.id);
                    handleGetTagData(tag.id);
                    // onMenuChangeAction({
                    //   categoryId: selectedCategoryId,
                    //   providerType:
                    //     currentTagList.find((item) => tag.id === item.id)
                    //       ?.providerType ?? undefined,
                    //   entityId: tag.id,
                    // });
                  }}
                >
                  <Avatar className="h-6 w-6 rounded-full">
                    <AvatarImage src={tag.logo ?? ""} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p
                    className="overflow-hidden truncate text-xs"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tag.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedTagId !== "" ? (
        isMobile ? (
          <div className="w-full">{DetailDialog()}</div>
        ) : (
          <div className="relative mx-5 my-3 rounded-xl bg-white/50 py-2 dark:bg-[#161C25]">
            <div className="grid w-full grid-cols-4 gap-3 overflow-hidden">
              <div className="relative flex w-full flex-col justify-between px-3">
                <p className="text-xs">
                  {t("signals.signal.totalTokenSignals")}
                </p>
                {!tabDataLoading ? (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    {tagData?.signalsCount || "--"}
                  </p>
                ) : (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    --
                  </p>
                )}
              </div>
              <div className="relative flex w-full flex-col justify-between px-3">
                <p className="text-xs">{t("signals.signal.tokenGainCount")}</p>
                {!tabDataLoading ? (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    {tagData?.riseCount || "--"}
                  </p>
                ) : (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    --
                  </p>
                )}
              </div>
              <div className="relative flex w-full flex-col justify-between px-3">
                <p className="text-xs">{t("signals.signal.tokenGainRatio")}</p>
                {!tabDataLoading ? (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    {riseRate}
                  </p>
                ) : (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    --
                  </p>
                )}
              </div>
              <div className="relative flex w-full flex-col justify-between px-3">
                <p className="text-xs">
                  {t("signals.signal.24hAverageMaxGain")}
                </p>
                {!tabDataLoading ? (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    {tagData?.avgRiseRate ? tagData?.avgRiseRate + "%" : "--"}
                  </p>
                ) : (
                  <p className="text-lg font-bold text-[#1976F7] dark:text-[#F2DA18]">
                    --
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="h-3 opacity-0">0</div>
      )}
    </div>
  );
}
