"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import dayjs from "dayjs";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TranslationComponent from "@/components/translation-component";

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
}

export function FeaturedCard({ signal, showLine }: Props) {
  return (
    <div
      className={`${showLine ? "grid grid-cols-[48px_1fr] gap-1" : "block"} overflow-hidden px-5`}
      key={signal.id}
    >
      {showLine ? (
        <div className="h-full">
          <div className="h-10 w-10">
            <Avatar className="h-10 w-10">
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
          <p className="font-bold leading-5">{signal.source.tweetUser.name}</p>
        ) : (
          <p className="font-bold leading-5">{signal.source.exchange.name}</p>
        )}
        <p className="leading-5 text-[#FFFFA7]">
          {dayjs(signal.signalTime).format("YYYY/MM/DD HH:mm:ss")}
        </p>
        <div className="relative h-fit w-full bg-transparent">
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
          <div className="mb-2 flex items-center bg-[#1E2229] p-4">
            <div className="border-spin-image ml-3 flex h-9 w-9 items-center justify-center">
              <div className="z-[8] h-8 w-8 overflow-hidden rounded-full">
                <div className="flex h-full w-full items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={signal.project.logo ?? ""} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="ml-2 flex flex-col items-center">
              {signal.times === "0" && (
                <div className="rounded-full bg-[#F4B31C] text-black">
                  <p className="scale-75 text-xs">首次提及</p>
                </div>
              )}
              <p className="font-bold">{signal.project.name}</p>
            </div>

            <p className="ml-10 text-xs">24h max pnl%</p>
            <p className="ml-2 font-extrabold text-[#00FFAB]">
              {signal.source.highRate24H}%
            </p>
            {signal.source.sentiment === "positive" ? (
              <div className="ml-10 h-4 w-4 bg-[url(/images/signal/positive.svg)] bg-cover"></div>
            ) : (
              <div className="ml-10 h-4 w-4 bg-[url(/images/signal/negative.svg)] bg-cover"></div>
            )}
            {signal.source.sentiment === "positive" ? (
              <p className="ml-1.5 font-bold text-[#00FFAB]">
                {signal.source.sentiment?.toUpperCase()}
              </p>
            ) : (
              <p className="ml-1.5 font-bold text-[#F95F5F]">
                {signal.source.sentiment?.toUpperCase()}
              </p>
            )}
            <Button variant="default" className="ml-auto">
              购买代币
            </Button>
          </div>
        ) : null}
        <div className="mt-8 flex gap-6 px-3 pb-5">
          <Link
            className="flex items-center gap-1 text-xs text-[#617178]"
            href={"/"}
          >
            <div className="h-3 w-3 bg-[url(/images/signal/link.svg)] bg-contain"></div>
            <p className="text-xs text-[#B0DDEF]">View Original Link</p>
          </Link>
          <Link
            className="flex items-center gap-1 text-xs text-[#617178]"
            href="/"
          >
            <div className="h-2.5 w-2.5 bg-[url(/images/signal/share.svg)] bg-contain"></div>
            <p className="text-xs text-[#B0DDEF]">Share</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
