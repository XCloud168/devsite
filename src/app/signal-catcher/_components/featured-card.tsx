"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import dayjs from "dayjs";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import TranslationComponent from "@/components/translation-component";
import {
  NegativeIcon,
  PositiveIcon,
  SwapIcon,
  TrapezoidIcon,
} from "@/components/ui/icon";

type Props = {
  signal: SignalItems;
  showLine?: boolean;
};
interface SignalItems extends Signals {
  source: TweetInfo & {
    imagesUrls: string[];
    videoUrls: string[];
    exchange: {
      name: string;
      logo: string;
    };
    tweetUser: { name: string; avatar: string };
  };
  project: Projects;
  times: string;
  hitKOLs: {
    avatar: string;
    id: string;
    name: string;
  }[];
}

export function FeaturedCard({ signal, showLine }: Props) {
  const t = useTranslations();
  return (
    <div
      className={`${showLine ? "grid grid-cols-[48px_1fr] gap-1" : "block"} overflow-hidden px-5`}
      key={signal.id}
    >
      {showLine ? (
        <div className="h-full">
          <div className="h-10 w-10">
            <Avatar className="h-10 w-10 border-2 border-secondary">
              {signal.source.tweetUser ? (
                <AvatarImage src={signal.source.tweetUser.avatar} />
              ) : (
                <AvatarImage src={signal.source.exchange.logo} />
              )}
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div className="h-full w-[20px] border-r border-dashed"></div>
        </div>
      ) : null}

      <div className="min-h-20">
        {signal.source.tweetUser ? (
          <p className="leading-5">{signal.source.tweetUser.name}</p>
        ) : (
          <p className="leading-5">{signal.source.exchange.name}</p>
        )}
        <p className="font-bold leading-5">
          {dayjs(signal.signalTime).format("YYYY/MM/DD HH:mm:ss")}
        </p>
        <div className="relative mt-2 h-fit w-full bg-transparent">
          {/*<p className="py-2 text-white/90">{signal.source.content}</p>*/}
          <TranslationComponent content={signal.source.contentSummary ?? ""} />
          <div className="mb-2 flex flex-wrap">
            {signal.source.imagesUrls && signal.source.imagesUrls.length > 0
              ? signal.source.imagesUrls.map(
                  (imageUrl: string, index: number) => {
                    return (
                      <img
                        src={imageUrl}
                        key={imageUrl + index}
                        className="!max-w-[50%] rounded-lg"
                      ></img>
                    );
                  },
                )
              : null}
            {signal.source.videoUrls && signal.source.videoUrls.length > 0
              ? signal.source.videoUrls.map(
                  (videoUrl: string, index: number) => {
                    return (
                      <video
                        src={videoUrl}
                        key={videoUrl + index}
                        width="480"
                        height="360"
                        preload="none"
                        controls
                        controlsList="nodownload noremoteplayback noplaybackrate"
                        autoPlay={false}
                        className="rounded-lg"
                      ></video>
                    );
                  },
                )
              : null}
          </div>
        </div>

        {signal.project ? (
          <div className="relative flex items-center gap-3 rounded-xl border-t border-[#2B95FF60] bg-gradient-to-b from-[#2B95FF50] to-[#ffffff00] p-4 dark:border-primary/60 dark:from-[#1A5FA450] dark:to-[#0A243E00]">
            <div className="absolute right-2 top-0 h-[5px] w-[86px]">
              <TrapezoidIcon className="fill-[#4794FF] dark:fill-[#046082]" />
            </div>
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
            <div className="flex flex-col items-start">
              {signal.times === "0" && (
                <div className="rounded-full bg-[#F4B31C] text-black">
                  <p className="scale-75 text-xs">首次提及</p>
                </div>
              )}
              <p className="font-bold">{signal.project.name}</p>
            </div>

            <p className="text-xs">24h max pnl%</p>
            <p className="font-bold text-[#00CE64] dark:text-[#00FFAB]">
              {parseFloat(signal.source.highRate24H ?? "0") > 0
                ? "+" + signal.source.highRate24H
                : signal.source.highRate24H}
              %
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
                <p className="font-bold text-[#FA5B5B] dark:text-[#F95F5F]">
                  {signal.source.sentiment?.toUpperCase()}
                </p>
              )}
            </div>
            <div className="ml-auto flex cursor-pointer items-center gap-1 hover:scale-105">
              <div className="h-4 w-4 bg-[url(/images/signal/swap-btn.svg)] bg-contain bg-no-repeat">
                <SwapIcon className="fill-[#1F72E5] dark:fill-[#FFFFA7]" />
              </div>
              <p className="text-[#1F72E5] dark:text-[#FFFFA7]">
                {" "}
                {t("signals.signal.quickSwap")}
              </p>
            </div>
          </div>
        ) : null}
        {signal.hitKOLs && signal.hitKOLs.length > 0 && (
          <div className="flex items-center gap-1 px-3">
            <div className="flex gap-0.5">
              {signal.hitKOLs.map((kols) => (
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
              <p className="text-sx text-[#949C9E]">
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
        )}
        <div className="mt-4 flex gap-6 px-3 pb-16">
          <Link
            className="flex items-center gap-1 text-xs text-[#949C9E]"
            href={"/"}
          >
            <div className="h-4 w-4 bg-[url(/images/signal/link.svg)] bg-contain"></div>
            <p className="text-xs text-[#949C9E]">
              {t("signals.showOriginal")}
            </p>
          </Link>
          <Link
            className="flex items-center gap-1 text-xs text-[#617178]"
            href="/"
          >
            <div className="h-3 w-3 bg-[url(/images/signal/share.svg)] bg-contain"></div>
            <p className="text-xs text-[#949C9E]">{t("common.share")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
