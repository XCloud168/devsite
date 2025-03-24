"use client";

import { type ServerResult } from "@/lib/server-result";
import React, { useEffect, useState } from "react";
import { type TweetInfo, type TweetUsers } from "@/server/db/schemas/tweet";
import {
  type FetchTweetListAction,
  type SetState,
} from "@/app/signal-catcher/_components/my-followed";
import { KolCard } from "@/app/signal-catcher/_components/kol-card";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedCard } from "@/app/signal-catcher/_components/featured-card";

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
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers & {
    isFollowed: boolean;
  };
  replyTweet: TweetItem;
}

export function KolPoint({ getTweetListAction, addFollowAction }: Props) {
  const [tweetList, setTweetList] = useState<TweetItem[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fetchTweetList = async (
    page: number,
    hasContractAddress: boolean,
    setTweetList: SetState<TweetItem[]>,
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
  return (
    <>
      {pageLoading && tweetList.length === 0 ? (
        <div className="space-y-5 px-5 pt-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div className="flex w-full gap-3" key={item}>
              <Skeleton className="h-9 w-9 min-w-9 rounded-full bg-secondary" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/5 bg-secondary" />
                <Skeleton className="h-4 w-2/5 bg-secondary" />
                <Skeleton className="h-20 w-full bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        tweetList.map((tweet) => (
          <div key={tweet.id} className="border-b pb-4">
            <KolCard
              tweet={tweet}
              addFollowAction={addFollowAction}
              showShare
              onFollowCallback={(id) => {
                setTweetList((prev) => {
                  const list = [...prev];
                  const index = list.findIndex(
                    (tweet) => tweet.tweetUser.id === id,
                  );
                  if (list[index]) list[index].tweetUser.isFollowed = true;
                  return list;
                });
              }}
            />
            {tweet.replyTweet ? (
              <div className="m-4 rounded-lg border">
                <KolCard tweet={tweet.replyTweet} />
              </div>
            ) : null}
          </div>
        ))
      )}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={hasNext}
        onNextAction={handleNextPage}
      />
    </>
  );
}
