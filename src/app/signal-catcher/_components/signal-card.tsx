"use client";

import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { type TweetInfo, type TweetUsers } from "@/server/db/schemas/tweet";
import dayjs from "dayjs";
import Link from "next/link";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import TranslationComponent from "@/components/translation-component";
import html2canvas from "html2canvas";
import type { ServerResult } from "@/lib/server-result";

type Props = {
  tweet: TweetItem;
  addFollowAction?: (tweetUid: string) => Promise<ServerResult>;
};
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers;
}

export function SignalCard({ tweet, addFollowAction }: Props) {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleAddFollow = (id: string) => {
    if (!addFollowAction) return;
    const fetchData = async () => {
      const response = await addFollowAction(id);
      if (response.error) {
        toast.error("出错啦");
      } else {
        setAddLoading(false);
        toast.success("添加成功");
      }
    };
    fetchData();
  };

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current);
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    link.click();
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
                <AvatarImage src={tweet.tweetUser.avatar ?? ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p>{tweet.tweetUser.name}</p>
              <div className="flex gap-3">
                <p className="text-xs">@{tweet.tweetUser.screenName}</p>
                <p className="text-xs">{tweet.tweetUser.followersCount} 粉丝</p>
              </div>
            </div>
          </div>
          {addFollowAction && (
            <Button
              variant="outline"
              onClick={() => {
                setAddLoading(true);
                if (tweet.tweetUser) handleAddFollow(tweet.tweetUser.id);
              }}
              disabled={addLoading}
            >
              添加监控
            </Button>
          )}
        </div>
        <div></div>
      </div>
      <div className="mt-4 rounded-sm border border-[#494949]">
        {/*<p className="mb-1.5 px-3 pt-3">{tweet.content}</p>*/}
        <TranslationComponent content={tweet.content ?? ""} />
        <div className="flex gap-10 p-4">
          <Link
            className="flex items-center gap-1 text-xs text-[#617178]"
            href="/"
          >
            <div className="h-3 w-3 bg-[url(/images/signal/link.svg)] bg-contain"></div>
            <div className="text-xs text-[#B0DDEF]">View Original Link</div>
          </Link>
          <div className="flex items-center gap-1 text-xs text-[#617178]">
            <div className="h-2.5 w-2.5 bg-[url(/images/signal/share.svg)] bg-contain"></div>
            <Dialog>
              <DialogTrigger className="text-xs text-[#B0DDEF]">
                Share
              </DialogTrigger>
              <DialogContent ref={captureRef}>
                <DialogHeader>
                  <DialogTitle className="border-b pb-3">Big Title</DialogTitle>
                  <DialogDescription>
                    <div>
                      <p className="py-2 text-xs">
                        {dayjs(tweet.tweetCreatedAt).format(
                          "YYYY/MM/DD HH:mm:ss",
                        )}
                      </p>
                      <p>{tweet.content}</p>
                    </div>
                    <div className="absolute -bottom-12 -left-1 flex w-full justify-center gap-4">
                      <Button>分享到 X</Button>
                      <Button onClick={() => handleSaveImage()}>
                        保存图片
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
