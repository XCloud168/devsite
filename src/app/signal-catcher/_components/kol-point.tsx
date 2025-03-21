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
      {tweetList.map((tweet) => (
        <div key={tweet.id} className="border-b pb-4">
          <KolCard tweet={tweet} addFollowAction={addFollowAction} showShare />
          {tweet.replyTweet ? (
            <div className="m-4 rounded-lg border">
              <KolCard tweet={tweet.replyTweet} />
            </div>
          ) : null}
        </div>
      ))}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={hasNext}
        onNextAction={handleNextPage}
      />
    </>
  );
}
