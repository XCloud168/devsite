"use client";

import { Button } from "@/components/ui/button";
import { type TweetInfo, type TweetUsers } from "@/server/db/schemas/tweet";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import TranslationComponent from "@/components/translation-component";
import type { ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
import Poster from "@/components/poster/poster";
import { formatNumber } from "@/components/formatNumber";
import { getMediaList } from "@/app/signal-catcher/_components/featured-card";
import Gallery from "@/components/Gallery";
import { useRouter } from "next/navigation";
import { BellPlus, BellRing, Share2, Link as Link2 } from "lucide-react";
import { useMembership } from "@/hooks/use-membership";

type Props = {
  tweet: TweetItem;
  addFollowAction?: (tweetUid: string) => Promise<ServerResult>;
  showShare?: boolean;
  onFollowCallback?: (id: string) => void;
  isMember?: boolean | null;
  isLogged: boolean;
};
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers & {
    isFollowed: boolean;
  };
  imagesUrls: [];
  videoUrls: [];
  replyTweet: TweetInfo;
}

export function KolCard({
  tweet,
  addFollowAction,
  showShare,
  onFollowCallback,
  isMember,
  isLogged,
}: Props) {
  const router = useRouter();
  const t = useTranslations();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null,
  );
  const handleAddFollow = (id: string) => {
    if (!addFollowAction) return;
    const fetchData = async () => {
      const response = await addFollowAction(id);
      if (response.error) {
        toast.error("Error");
      } else {
        setAddLoading(false);
        toast.success(t("common.success"));
        if (onFollowCallback) onFollowCallback(id);
      }
    };
    fetchData();
  };

  return (
    <div className="p-3 md:p-5" key={tweet.id}>
      <p className="relative pl-2 before:absolute before:left-0 before:top-1/2 before:h-[4px] before:w-[4px] before:-translate-y-1/2 before:rounded-full before:bg-white before:content-['']">
        {dayjs(tweet.tweetCreatedAt).format("YYYY/MM/DD HH:mm:ss")}
      </p>
      <div className="mt-1">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8">
              <Avatar className="h-8 w-8">
                <AvatarImage src={tweet?.tweetUser?.avatar || ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-bold">{tweet?.tweetUser?.name || "--"}</p>
              <div className="flex gap-3">
                <p className="text-xs">
                  @{tweet?.tweetUser?.screenName || "--"}
                </p>
                <p className="text-xs">
                  {formatNumber(tweet?.tweetUser?.followersCount)}{" "}
                  {t("signals.kol.followers")}
                </p>
              </div>
            </div>
          </div>
          {addFollowAction && (
            <Button
              variant="outline"
              className="justify-start gap-1 rounded-xl"
              onClick={() => {
                if (!isMember) {
                  if (isLogged) {
                    toast.info(t("signals.kol.notVip"));
                  } else {
                    router.push("/auth/login");
                  }
                  return;
                }
                setAddLoading(true);
                if (tweet.tweetUser) handleAddFollow(tweet.tweetUser.id);
              }}
              disabled={addLoading || tweet?.tweetUser?.isFollowed}
            >
              {tweet?.tweetUser?.isFollowed ? (
                <BellRing className="fill-text-accent dark:fill-[#e6e6e6]" />
              ) : (
                <BellPlus className="fill-text-accent" />
              )}
              {tweet?.tweetUser?.isFollowed
                ? t("signals.kol.followed")
                : t("signals.kol.follow")}
            </Button>
          )}
        </div>
        <div></div>
      </div>
      <div className="mt-4 rounded-lg">
        {/*<p className="mb-1.5 px-3 pt-3">{tweet.content}</p>*/}
        <div className="">
          <TranslationComponent
            lang={tweet.lang}
            content={tweet.content ?? ""}
            onTranslateSuccess={(content: string) => {
              setTranslatedContent(content);
            }}
          />
        </div>
        <div className="my-2 grid grid-cols-1 gap-2">
          <Gallery images={getMediaList(tweet.imagesUrls)} />
          {getMediaList(tweet.videoUrls).map(
            (videoUrl: string, index: number) => {
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
            },
          )}
        </div>
        {showShare ? (
          <div className="flex gap-10 p-3">
            <Link
              className="flex items-center gap-1 text-xs text-[#949C9E]"
              href={tweet.tweetUrl ?? "/"}
              target="_blank"
            >
              <Link2 size={12} />
              <div className="text-xs text-[#949C9E]">
                {t("signals.showOriginal")}
              </div>
            </Link>
            <div className="flex cursor-pointer items-center gap-1 text-xs text-[#949C9E]">
              <Share2 size={12} />
              <Poster>
                <div>
                  <p className="relative pl-2 text-white before:absolute before:left-0 before:top-1/2 before:h-[4px] before:w-[4px] before:-translate-y-1/2 before:rounded-full before:bg-white before:content-['']">
                    {dayjs(tweet.tweetCreatedAt).format("YYYY/MM/DD HH:mm:ss")}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-8 w-8">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={tweet?.tweetUser?.avatar || "--"} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="">
                      <p className="text-white">
                        {tweet?.tweetUser?.name || "--"}
                      </p>
                      <div className="flex gap-3">
                        <p className="text-xs text-white/80">
                          @{tweet?.tweetUser?.screenName || "--"}
                        </p>
                        <p className="text-xs text-white/80">
                          {formatNumber(tweet?.tweetUser?.followersCount) || 0}
                          &nbsp;
                          {t("signals.kol.followers")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/*<div className="break-all text-sm text-white">*/}
                  {/*  {tweet.content || ""}*/}
                  {/*</div>*/}
                  <p
                    className="mt-3 break-all text-white"
                    dangerouslySetInnerHTML={{
                      __html: tweet.content || "",
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
                </div>
              </Poster>
            </div>
          </div>
        ) : (
          <div className="h-4"></div>
        )}
      </div>
    </div>
  );
}
