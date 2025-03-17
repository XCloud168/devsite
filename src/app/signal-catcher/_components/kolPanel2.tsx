"use client";

import { Button } from "@/components/ui/button";
import { type ServerResult } from "@/lib/server-result";
import React, { useEffect, useState } from "react";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import dayjs from "dayjs";
import Link from "next/link";
import {
  type FetchTweetListAction,
  type SetState,
} from "@/app/signal-catcher/_components/kolPanel3";
import { toast } from "sonner";

type Props = {
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  getTweetListAction: (
    page: number,
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
  ) => Promise<ServerResult>;
};

export function KolPanel2({ getTweetListAction, addFollowAction }: Props) {
  const [tweetList, setTweetList] = useState<TweetInfo[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const fetchTweetList = async (
    page: number,
    hasContractAddress: boolean,
    setTweetList: SetState<TweetInfo[]>,
    setHasNext: SetState<boolean>,
    setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getTweetListAction: FetchTweetListAction,
  ) => {
    setPageLoading(true);
    const response = await getTweetListAction(page, {
      followed: false,
      hasContractAddress,
    });
    console.log(response);
    setTweetList((prev) =>
      page === 1 ? response.data.items : prev.concat(response.data.items),
    );
    setHasNext(response.data.pagination.hasNextPage);
    setCurrentPage(response.data.pagination.currentPage);
    setPageLoading(false);
  };
  useEffect(() => {
    fetchTweetList(
      1,
      false,
      setTweetList,
      setHasNext,
      setCurrentPage,
      setPageLoading,
      getTweetListAction,
    );
  }, [getTweetListAction]);
  const handleNextPage = () => {
    if (hasNext) {
      fetchTweetList(
        currentPage + 1,
        false,
        setTweetList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getTweetListAction,
      );
    }
  };
  const handleAddFollow = (id: string) => {
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
  return (
    <>
      {tweetList.map((tweet) => (
        <div className="p-5" key={tweet.id}>
          <p className="text-xs">
            {dayjs(tweet.signalTime).format("YYYY/MM/DD HH:mm:ss")}
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                <div>
                  <p>Elon Musk</p>
                  <div className="flex gap-3">
                    <p className="text-xs">@elonmusk</p>
                    <p className="text-xs">2.1亿 粉丝</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setAddLoading(true);
                  if (tweet.tweetUser) handleAddFollow(tweet.tweetUser);
                }}
                disabled={addLoading}
              >
                添加监控
              </Button>
            </div>
            <div></div>
          </div>
          <div className="mt-4 rounded-sm border border-[#494949]">
            <p className="mb-1.5 px-3 pt-3">{tweet.content}</p>
            <p className="text-sx mb-1.5 px-3 text-xs text-[#01A4D9]">
              隐藏翻译
            </p>
            <div className="bg-[#494949] p-3">
              <p>{tweet.content}</p>
            </div>
            <div className="flex gap-10 p-4">
              <Link
                className="flex items-center gap-1 text-xs text-[#617178]"
                href="/"
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
      ))}
      {hasNext ? (
        <div className="my-4 flex justify-center">
          {pageLoading ? (
            <div className="flex items-center justify-center text-primary">
              加载中
              <span className="animate-dots inline-block w-2 text-center text-primary">
                .
              </span>
              <span className="animate-dots animation-delay-200 inline-block w-2 text-center text-primary">
                .
              </span>
              <span className="animate-dots animation-delay-400 inline-block w-2 text-center text-primary">
                .
              </span>
            </div>
          ) : (
            <Button onClick={() => handleNextPage()}>加载更多</Button>
          )}
        </div>
      ) : null}
    </>
  );
}
