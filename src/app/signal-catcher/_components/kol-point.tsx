"use client";

import { type ServerResult } from "@/lib/server-result";
import React, { useEffect, useRef, useState } from "react";
import { type TweetInfo, type TweetUsers } from "@/server/db/schemas/tweet";
import {
  type FetchTweetListAction,
  type SetState,
} from "@/app/signal-catcher/_components/my-followed";
import { KolCard } from "@/app/signal-catcher/_components/kol-card";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { BellRing } from "lucide-react";
import { TopLoadingBar } from "@/components/TopLoadingBar";
type Props = {
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  getTweetListAction: (
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
    cursor?: string,
  ) => Promise<ServerResult>;
  isMember?: boolean | null;
  isLogged: boolean;
  onAddSuccessAction: () => void;
};
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers & {
    isFollowed: boolean;
  };
  imagesUrls: [];
  videoUrls: [];
  replyTweet: TweetItem;
  symbols: [];
  contractAddress: [];
}

export function KolPoint({
  getTweetListAction,
  addFollowAction,
  isMember,
  isLogged,
  onAddSuccessAction,
}: Props) {
  const t = useTranslations();
  const [tweetList, setTweetList] = useState<TweetItem[]>([]);
  // const [hasNext, setHasNext] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasContractAddress, setHasContractAddress] = useState<boolean>(false);
  const [newTweets, setNewTweets] = useState<TweetItem[]>([]); // 存储新消息
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false); // 控制提示显示
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const handleScroll = () => {
      setHasScrolled(scrollContainer.scrollTop > 0);
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);
  const fetchTweetList = async (
    cursor: string | undefined,
    hasContractAddress: boolean,
    setTweetList: SetState<TweetItem[]>,
    setNextCursor: SetState<string | undefined>,
    // setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getTweetListAction: FetchTweetListAction,
    showPageLoading = true,
  ) => {
    if (showPageLoading) setPageLoading(true);
    const response = await getTweetListAction(
      {
        followed: false,
        hasContractAddress,
      },
      cursor,
    );
    setTweetList((prev) => {
      if (cursor === undefined) {
        return response.data.items;
      } else {
        const existingIds = new Set(prev.map((item) => item.id));
        const filteredNewItems = response.data.items.filter(
          (item: TweetItem) => !existingIds.has(item.id),
        );
        return prev.concat(filteredNewItems);
      }
    });
    setNextCursor(response.data.pagination.nextCursor);
    // setCurrentPage(response.data.pagination.currentPage);
    if (showPageLoading) setPageLoading(false);
  };
  const changeHasContractAddress = (flag: boolean) => {
    setHasContractAddress(flag);
    fetchTweetList(
      undefined,
      flag,
      setTweetList,
      setNextCursor,
      // setCurrentPage,
      setPageLoading,
      getTweetListAction,
    );
  };
  useEffect(() => {
    fetchTweetList(
      undefined,
      hasContractAddress,
      setTweetList,
      setNextCursor,
      // setCurrentPage,
      setPageLoading,
      getTweetListAction,
    );
  }, [getTweetListAction]);
  const handleNextPage = () => {
    if (nextCursor !== undefined) {
      fetchTweetList(
        nextCursor,
        hasContractAddress,
        setTweetList,
        setNextCursor,
        // setCurrentPage,
        setPageLoading,
        getTweetListAction,
      );
    }
  };
  useEffect(() => {
    const interval = 45 * 1000;
    const checkNewTweets = async () => {
      const response = await getTweetListAction({
        followed: false,
        hasContractAddress: hasContractAddress,
      });
      const newItems = response.data.items;
      const currentIds = tweetList.map((item) => item.id);
      const differentItems = newItems.filter(
        (item: TweetItem) => !currentIds.includes(item.id),
      );

      if (differentItems.length > 0) {
        if (!hasScrolled) {
          setTweetList((prev) => [...differentItems, ...prev]);
        } else {
          setNewTweets(differentItems);
          setShowNewMessage(true);
        }
      }
    };
    const timer = setInterval(() => {
      void checkNewTweets();
    }, interval);
    return () => clearInterval(timer);
  }, [tweetList, getTweetListAction, hasContractAddress, hasScrolled]);
  const handleNewMessageClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      setTweetList((prev) => [...newTweets, ...prev]);
      setShowNewMessage(false);
      setNewTweets([]);
    }
  };
  return (
    <div
      className="relative h-[calc(100vh-136px)] overflow-y-scroll p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary md:p-5"
      ref={scrollRef}
    >
      <TopLoadingBar loading={pageLoading} />
      {showNewMessage && (
        <div
          className="sticky left-0 right-0 top-0 z-50 flex justify-center bg-transparent text-center text-white" // 使用 sticky 替代 fixed，相对于 scrollRef
        >
          <div
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-card px-3 py-2 text-primary ring-1 ring-primary"
            onClick={handleNewMessageClick}
          >
            <BellRing className="h-5 w-5 animate-bell text-primary" />
            {t("signals.kol.newTweetsAvailable", { count: newTweets.length })}
          </div>
        </div>
      )}
      <div className="ml-2 mt-2 flex h-14 w-[240px] items-center justify-between border px-6">
        <p>{t("signals.kol.withToken")}</p>
        <div>
          <Switch
            id="airplane-mode"
            checked={hasContractAddress}
            onCheckedChange={changeHasContractAddress}
            disabled={pageLoading}
          />
        </div>
      </div>
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
          <div key={tweet.id} className="border-b">
            <KolCard
              isLogged={isLogged}
              isMember={isMember}
              tweet={tweet}
              addFollowAction={addFollowAction}
              showShare
              onFollowCallback={(id) => {
                onAddSuccessAction();
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
              <div className="mb-8 ml-12 rounded-lg border dark:bg-[#121517]">
                <KolCard
                  tweet={tweet.replyTweet}
                  isMember={isMember}
                  isLogged={isLogged}
                />
              </div>
            ) : null}
          </div>
        ))
      )}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={nextCursor !== undefined}
        onNextAction={handleNextPage}
      />
    </div>
  );
}
