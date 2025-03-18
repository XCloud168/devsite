"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type ServerResult } from "@/lib/server-result";

import React, { useEffect, useState } from "react";
import { type FeaturedMenu } from "@/app/signal-catcher/_components/featured-banner";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import dayjs from "dayjs";
import { type TweetInfo } from "@/server/db/schemas/tweet";
import { type SetState } from "@/app/signal-catcher/_components/kolPanel3";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { type SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { FeaturedCard } from "@/app/signal-catcher/_components/featured-card";

type Props = {
  getSignalListAction: (
    page: number,
    filter: {
      providerType: SIGNAL_PROVIDER_TYPE;
      entityId?: string;
    },
  ) => Promise<ServerResult>;
  menu: FeaturedMenu;
  tagId: string;
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

export type FetchSignalListAction = (
  page: number,
  options: { providerType: SIGNAL_PROVIDER_TYPE; entityId?: string },
) => Promise<ServerResult>;

export function FeaturedList({ getSignalListAction, menu, tagId }: Props) {
  const [signalList, setSignalList] = useState<SignalItems[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fetchSignalList = async (
    page: number,
    providerType: SIGNAL_PROVIDER_TYPE,
    setSignalList: SetState<SignalItems[]>,
    setHasNext: SetState<boolean>,
    setCurrentPage: SetState<number>,
    setPageLoading: SetState<boolean>,
    getSignalListAction: FetchSignalListAction,
    entityId?: string,
  ) => {
    setPageLoading(true);
    const response = await getSignalListAction(page, {
      providerType: providerType,
      entityId: entityId,
    });
    console.log(response);
    setSignalList((prev) =>
      page === 1 ? response.data.items : prev.concat(response.data.items),
    );
    setHasNext(response.data.pagination.hasNextPage);
    setCurrentPage(response.data.pagination.currentPage);
    setPageLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSignalList(
      1,
      menu.label,
      setSignalList,
      setHasNext,
      setCurrentPage,
      setPageLoading,
      getSignalListAction,
    );
  }, [menu]);

  const handleNextPage = () => {
    if (hasNext) {
      fetchSignalList(
        currentPage + 1,
        menu.label,
        setSignalList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getSignalListAction,
      );
    }
  };
  useEffect(() => {
    console.log(tagId);
    if (tagId !== "") {
      fetchSignalList(
        1,
        menu.label,
        setSignalList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getSignalListAction,
        tagId,
      );
    }
  }, [tagId]);
  return (
    <>
      {signalList.map((signal) => (
        <FeaturedCard signal={signal} key={signal.id} showLine />
      ))}
      <LoadingMoreBtn
        pageLoading={pageLoading}
        hasNext={hasNext}
        onNextAction={handleNextPage}
      />
    </>
  );
}
