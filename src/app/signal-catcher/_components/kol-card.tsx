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

type Props = {
  tweet: TweetItem;
  addFollowAction?: (tweetUid: string) => Promise<ServerResult>;
  showShare?: boolean;
  onFollowCallback?: (id: string) => void;
};
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers & {
    isFollowed: boolean;
  };
  replyTweet: TweetInfo;
}

export function KolCard({
  tweet,
  addFollowAction,
  showShare,
  onFollowCallback,
}: Props) {
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
    <div className="px-5 pt-5" key={tweet.id}>
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
                  {tweet?.tweetUser?.followersCount || 0}{" "}
                  {t("signals.kol.followers")}
                </p>
              </div>
            </div>
          </div>
          {addFollowAction && (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setAddLoading(true);
                if (tweet.tweetUser) handleAddFollow(tweet.tweetUser.id);
              }}
              disabled={addLoading || tweet?.tweetUser?.isFollowed}
            >
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
        <div className="px-4">
          <TranslationComponent
            content={tweet.content ?? ""}
            onTranslateSuccess={(content: string) => {
              setTranslatedContent(content);
            }}
          />
        </div>
        {showShare ? (
          <div className="flex gap-10 p-3">
            <Link
              className="flex items-center gap-1 text-xs text-[#949C9E]"
              href={tweet.tweetUrl ?? "/"}
              target="_blank"
            >
              <div className="h-3 w-3 bg-[url(/images/signal/link.svg)] bg-contain"></div>
              <div className="text-xs text-[#949C9E]">
                {t("signals.showOriginal")}
              </div>
            </Link>
            <div className="flex items-center gap-1 text-xs text-[#949C9E]">
              <div className="h-2.5 w-2.5 bg-[url(/images/signal/share.svg)] bg-contain"></div>
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
                          {tweet?.tweetUser?.followersCount || 0}&nbsp;
                          {t("signals.kol.followers")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="break-all text-sm text-white">
                    {tweet.content || ""}
                  </div>
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
