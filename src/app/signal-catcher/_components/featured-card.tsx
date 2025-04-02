"use client";

import Link from "next/link";
import React, { useState } from "react";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import dayjs from "dayjs";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import TranslationComponent from "@/components/translation-component";
import { NegativeIcon, PositiveIcon, SwapIcon } from "@/components/ui/icon";
import Poster from "@/components/poster/poster";
import Gallery from "@/components/Gallery";

type Props = {
  signal: SignalItems;
  showShare?: boolean;
  tokenItemWidth?: "w-fit" | "w-auto";
};
interface SignalItems extends Signals {
  source: TweetInfo & {
    imagesUrls: string[];
    videoUrls: string[];
    exchange: {
      name: string;
      logo: string;
    };
    tweetUser: { name: string; avatar: string; tweetUrl: string };
    source: string;
    newsEntity: {
      logo: string;
    };
    mediaUrls: {
      images?: string[];
      videos?: string[];
    };
  };
  project: Projects;
  times: string;
  hitKOLs: {
    avatar: string;
    id: string;
    name: string;
  }[];
}
export const getMediaList = (mediaList?: string[]): string[] => {
  if (!mediaList || mediaList.length == 0) {
    return [];
  }
  return mediaList;
};
export function FeaturedCard({
  signal,
  showShare = true,
  tokenItemWidth = "w-auto",
}: Props) {
  const t = useTranslations();
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null,
  );
  const getAvatarSrc = () => {
    if (signal.providerType === "twitter")
      return signal?.source?.tweetUser?.avatar || "";
    if (signal.providerType === "news")
      return signal?.source?.newsEntity?.logo || "";
    return signal?.source?.exchange?.logo || "";
  };

  if (!signal.source) return null;
  const TokenItem = (className: string, signal: SignalItems) => (
    <div className={`${className} mt-4 flex gap-1`}>
      <div className="flex -space-x-2">
        {signal.hitKOLs.slice(0, 5).map((kols) => (
          <Avatar className="h-5 w-5" key={kols.id}>
            <AvatarImage src={kols.avatar ?? ""} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        ))}
      </div>
      {signal.hitKOLs.length <= 5 ? (
        <p className="text-xs text-[#949C9E]">
          {signal.hitKOLs.map((item) => item.name).join(",") +
            signal.hitKOLs.length +
            t("signals.signal.mentionAbove") +
            " " +
            signal.project.name}
        </p>
      ) : (
        <p className="text-xs text-[#949C9E]">
          {signal.hitKOLs
            .slice(0, 5)
            .map((item) => item.name)
            .join(",") +
            t("signals.signal.over") +
            signal.hitKOLs.length +
            t("signals.signal.mentionAbove") +
            " " +
            signal.project.name}
        </p>
      )}
    </div>
  );
  return (
    <div
      className="grid grid-cols-1 gap-1 overflow-hidden px-5"
      key={signal.id}
    >
      <div
        className={`mb-3 min-h-20 border-b ${showShare ? "border-border/50" : "border-transparent"}`}
      >
        <div className="flex gap-2">
          <Avatar className="h-10 w-10 border-2 border-secondary">
            <AvatarImage src={getAvatarSrc()} />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div>
            {signal.providerType === "twitter" ? (
              <p className="leading-5">
                {signal?.source?.tweetUser?.name || ""}
              </p>
            ) : (
              <p className="leading-5">
                {signal?.source?.exchange?.name || ""}
              </p>
            )}
            <p className="font-bold leading-5">
              {dayjs(signal.signalTime).format("YYYY/MM/DD HH:mm:ss")}
            </p>
          </div>
        </div>

        <div className="relative mt-2 h-fit w-full bg-transparent pl-0 md:pl-12">
          <TranslationComponent
            content={signal.source.contentSummary ?? ""}
            onTranslateSuccess={(content: string) => {
              setTranslatedContent(content);
            }}
          />
          <div className="my-2 flex flex-wrap">
            <Gallery
              images={getMediaList(
                signal.providerType === "news"
                  ? signal.source.mediaUrls?.images
                  : signal.source.imagesUrls,
              )}
            />
            {getMediaList(
              signal.providerType === "news"
                ? signal.source.mediaUrls?.videos
                : signal.source.videoUrls,
            ).map((videoUrl: string, index: number) => {
              return (
                <video
                  src={videoUrl}
                  key={videoUrl + index}
                  width="320"
                  height="240"
                  controls
                  controlsList="nodownload noremoteplayback noplaybackrate"
                  autoPlay={false}
                  className="rounded-lg"
                ></video>
              );
            })}
          </div>
        </div>

        {signal.project ? (
          <div
            className={`relative ml-0 block ${tokenItemWidth} items-center gap-5 rounded-xl bg-white/60 p-4 dark:bg-[#161C25] md:ml-12`}
          >
            <div className="flex items-center gap-1.5">
              <div className="border-spin-image flex h-9 w-9 items-center justify-center">
                <div className="z-[8] h-8 w-8 overflow-hidden rounded-full border-2 border-primary">
                  <div className="flex h-full w-full items-center justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={signal.project.logo ?? ""} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold">{signal.project.symbol}</p>
                {signal.times === "1" && (
                  <div className="rounded-full bg-[#F4B31C] text-black">
                    <p className="scale-75 text-xs">
                      {t("signals.signal.firstMention")}
                    </p>
                  </div>
                )}
                {parseInt(signal.times) >= 3 && (
                  <div className="rounded-full bg-primary text-black">
                    <p className="scale-75 text-xs">
                      {t("signals.signal.repeatedMentions")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex w-full gap-3 md:gap-10">
              <div>
                <p className="mb-2 text-xs">{t("signals.signal.24hPnl")}</p>
                <p className="font-bold text-[#00CE64] dark:text-[#00FFAB]">
                  {parseFloat(signal.source.highRate24H ?? "0") > 0
                    ? "+" + signal.source.highRate24H
                    : signal.source.highRate24H}
                  %
                </p>
              </div>
              {signal.source.sentiment ? (
                <div>
                  <p className="mb-2 text-xs">
                    {t("signals.signal.cryptoIndex")}
                  </p>

                  <div className="flex items-center gap-1.5">
                    {signal.source.sentiment === "positive" ? (
                      <div className="h-4 w-4">
                        <PositiveIcon className="fill-[#00CE64] dark:fill-[#00FFAB]" />
                      </div>
                    ) : (
                      <div className="h-4 w-4">
                        <NegativeIcon className="fill-[#FA5B5B] dark:fill-[#F95F5F]" />
                      </div>
                    )}
                    {signal.source.sentiment === "positive" ? (
                      <p className="font-bold text-[#00CE64] dark:text-[#00FFAB]">
                        {t("signals.signal.positive").toUpperCase()}
                      </p>
                    ) : (
                      <p className="font-bold text-[#FA5B5B] dark:text-[#F95F5F]">
                        {t("signals.signal.negative").toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
              <div className="">
                <p className="mb-2 text-xs opacity-0">123</p>
                <div className="flex cursor-pointer items-center gap-1 hover:scale-105">
                  <div className="h-4 w-4">
                    <SwapIcon className="fill-[#1F72E5] dark:fill-[#FFFFA7]" />
                  </div>
                  <p className="text-[#1F72E5] dark:text-[#FFFFA7]">
                    {" "}
                    {t("signals.signal.quickSwap")}
                  </p>
                </div>
              </div>
            </div>
            {signal.hitKOLs &&
              signal.hitKOLs.length > 0 &&
              TokenItem("items-center flex", signal)}
          </div>
        ) : null}

        {showShare && (
          <div className="mt-4 flex gap-6 px-3 pb-4 pl-0 md:pl-12">
            <Link
              className="flex items-center gap-1 text-xs text-[#949C9E]"
              target="_blank"
              href={
                signal.providerType === "twitter"
                  ? (signal.source.tweetUrl ?? "/")
                  : signal.source.source
              }
            >
              <div className="h-4 w-4 bg-[url(/images/signal/link.svg)] bg-contain"></div>
              <p className="text-xs text-[#949C9E]">
                {t("signals.showOriginal")}
              </p>
            </Link>
            <div className="flex cursor-pointer items-center gap-1 text-xs text-[#617178]">
              <div className="h-3 w-3 bg-[url(/images/signal/share.svg)] bg-contain"></div>
              <Poster>
                <p className="relative pl-2 before:absolute before:left-0 before:top-1/2 before:h-[4px] before:w-[4px] before:-translate-y-1/2 before:rounded-full before:bg-white before:content-['']">
                  {dayjs(signal.signalTime).format("YYYY/MM/DD HH:mm:ss")}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="h-8 w-8">
                    <Avatar className="h-8 w-8 border-2 border-secondary">
                      {signal.providerType === "twitter" ? (
                        <AvatarImage
                          src={signal?.source?.tweetUser?.avatar || ""}
                        />
                      ) : (
                        <AvatarImage
                          src={signal?.source?.exchange?.logo || ""}
                        />
                      )}
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    {signal.providerType === "twitter" ? (
                      <p className="leading-5">
                        {signal?.source?.tweetUser?.name || ""}
                      </p>
                    ) : (
                      <p className="leading-5">
                        {signal?.source?.exchange?.name || ""}
                      </p>
                    )}
                  </div>
                </div>
                {/*<div className="mt-4 min-h-60 rounded-lg border bg-white/10 p-2">*/}
                {/*  {signal.source.contentSummary}*/}
                {/*</div>*/}
                <p
                  className="mt-3 break-all text-white"
                  dangerouslySetInnerHTML={{
                    __html: signal.source.contentSummary || "",
                  }}
                ></p>
                {translatedContent ? (
                  <div className="mt-3">
                    <p className="text-sm text-primary">AI翻译：</p>
                  </div>
                ) : null}
                {translatedContent ? (
                  <div className="mt-3 break-all text-sm text-white">
                    {translatedContent}
                  </div>
                ) : null}
                {signal.project ? (
                  <div className="relative mt-3 block w-full items-center gap-3 rounded-xl border bg-white/80 p-4 dark:bg-[#161C25]">
                    <div className="flex items-center gap-3">
                      <div className="border-spin-image flex h-9 w-9 items-center justify-center">
                        <div className="z-[8] h-8 w-8 overflow-hidden rounded-full border-2 border-primary">
                          <div className="flex h-full w-full items-center justify-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={signal.project.logo ?? ""} />
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-white">
                          {signal.project.symbol}
                        </p>
                        {signal.times === "0" && (
                          <div className="rounded-full bg-[#F4B31C] text-black">
                            <p className="scale-75 text-xs">
                              {t("signals.signal.firstMention")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-10">
                      <div>
                        <p className="mb-2 text-xs">
                          {t("signals.signal.24hPnl")}
                        </p>
                        <p className="text-xl font-bold text-[#00CE64] dark:text-[#00FFAB]">
                          {parseFloat(signal.source.highRate24H ?? "0") > 0
                            ? "+" + signal.source.highRate24H
                            : signal.source.highRate24H}
                          %
                        </p>
                      </div>
                      {signal.source.sentiment ? (
                        <div>
                          <p className="mb-2 text-xs">
                            {t("signals.signal.cryptoIndex")}
                          </p>

                          <div className="flex items-center gap-1.5">
                            {signal.source.sentiment === "positive" ? (
                              <div className="h-4 w-4">
                                <PositiveIcon className="fill-[#00CE64] dark:fill-[#00FFAB]" />
                              </div>
                            ) : (
                              <div className="h-4 w-4">
                                <NegativeIcon className="fill-[#FA5B5B] dark:fill-[#F95F5F]" />
                              </div>
                            )}
                            {signal.source.sentiment === "positive" ? (
                              <p className="font-bold text-[#00CE64] dark:text-[#00FFAB]">
                                {signal.source.sentiment?.toUpperCase()}
                              </p>
                            ) : (
                              <p className="justify-start font-bold text-[#FA5B5B] dark:text-[#F95F5F]">
                                {signal.source.sentiment?.toUpperCase()}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {signal.hitKOLs &&
                      signal.hitKOLs.length > 0 &&
                      TokenItem("flex-col items-start", signal)}
                  </div>
                ) : null}
              </Poster>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
