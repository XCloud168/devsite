"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { AngleIcon } from "@/components/ui/icon";
import {
  type TweetInfo,
  type TweetUsers,
  type Watchlist,
} from "@/server/db/schemas/tweet";
import { type ServerResult } from "@/lib/server-result";
import dayjs from "dayjs";
import { toast } from "sonner";
import { KolCard } from "@/app/signal-catcher/_components/kol-card";
import { LoadingMoreBtn } from "@/app/signal-catcher/_components/loading-more-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  getFollowedListAction: () => Promise<ServerResult>;
  removeFollowAction: (tweetUid: string) => Promise<ServerResult>;
  getTweetListAction: (
    page: number,
    filter: {
      tweetUid?: string;
      followed?: boolean;
      hasContractAddress?: boolean;
    },
  ) => Promise<ServerResult>;
};

export type FetchTweetListAction = (
  page: number,
  options: { followed: boolean; hasContractAddress: boolean },
) => Promise<ServerResult>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
interface WatchItem extends Omit<Watchlist, "tweetUser"> {
  tweetUser: TweetUsers;
}
interface TweetItem extends Omit<TweetInfo, "tweetUser"> {
  tweetUser: TweetUsers & {
    isFollowed: boolean;
  };
  replyTweet: TweetInfo;
}
export function MyFollowed({
  getTweetListAction,
  getFollowedListAction,
  removeFollowAction,
}: Props) {
  const t = useTranslations();
  const [showTable, setShowTable] = useState(false);
  const [tweetList, setTweetList] = useState<TweetItem[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasContractAddress, setHasContractAddress] = useState<boolean>(false);
  const [tableData, setTableData] = useState<WatchItem[]>([]);
  const [tableDataLoading, setTableDataLoading] = useState<boolean>(false);
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
      followed: true,
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
  const changeHasContractAddress = (flag: boolean) => {
    setHasContractAddress(flag);
    fetchTweetList(
      1,
      flag,
      setTweetList,
      setHasNext,
      setCurrentPage,
      setPageLoading,
      getTweetListAction,
    );
  };
  const handleNextPage = () => {
    if (hasNext) {
      fetchTweetList(
        currentPage + 1,
        hasContractAddress,
        setTweetList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getTweetListAction,
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await getFollowedListAction();
      setTableData(response.data);
      setTableDataLoading(false);
    };
    if (showTable) {
      fetchData();
    } else {
      fetchTweetList(
        1,
        hasContractAddress,
        setTweetList,
        setHasNext,
        setCurrentPage,
        setPageLoading,
        getTweetListAction,
      );
    }
  }, [showTable]);
  const handleRemoveFollow = (id: string) => {
    const getTableData = async () => {
      const response = await getFollowedListAction();
      setTableData(response.data);
    };
    const fetchData = async () => {
      setTableDataLoading(true);
      const response = await removeFollowAction(id);
      if (response.error) {
        toast.error("Error");
      } else {
        toast.success(t("common.success"));
        if (showTable) getTableData();
        else {
          fetchTweetList(
            1,
            hasContractAddress,
            setTweetList,
            setHasNext,
            setCurrentPage,
            setPageLoading,
            getTweetListAction,
          );
        }
      }
    };
    fetchData();
  };

  return (
    <>
      {!showTable ? (
        <div className="p-5">
          <div className="flex gap-3 p-3">
            <div className="flex w-[240px] items-center justify-between border px-6">
              <p>{t("signals.kol.withToken")}</p>
              <div>
                <Switch
                  id="airplane-mode"
                  checked={hasContractAddress}
                  onCheckedChange={changeHasContractAddress}
                />
              </div>
            </div>
            <div className="flex w-[240px] items-center justify-between border px-6 py-4">
              <p>{t("signals.kol.myKol")}</p>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setTableDataLoading(true);
                  setShowTable(true);
                }}
              >
                <AngleIcon className="h-4 w-2 fill-black stroke-[#494949]" />
              </div>
            </div>
          </div>
          {pageLoading && tweetList.length === 0 ? (
            <div className="space-y-5 px-5 pt-5">
              {[1, 2, 3, 4].map((item) => (
                <div className="flex w-full gap-3" key={item}>
                  <Skeleton className="h-9 w-9 min-w-9 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            tweetList.map((tweet) => <KolCard tweet={tweet} key={tweet.id} />)
          )}
          {!pageLoading && tweetList.length === 0 && (
            <div className="mt-4 flex justify-center">
              <p>{t("common.empty")}</p>
            </div>
          )}
          <LoadingMoreBtn
            pageLoading={pageLoading}
            hasNext={hasNext}
            onNextAction={handleNextPage}
          />
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-3 py-4">
            <div className="cursor-pointer" onClick={() => setShowTable(false)}>
              <AngleIcon className="h-4 w-2 rotate-180 fill-black stroke-[#fff]" />
            </div>
            <p>{t("signals.kol.myKol")}</p>
          </div>
          {tableDataLoading ? (
            <div className="mt-4 flex items-center justify-center text-primary">
              {t("common.loading")}
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
            <Table>
              {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead>{t("signals.kol.followers")}</TableHead>
                  <TableHead>{t("signals.kol.addTime")}</TableHead>
                  <TableHead>{t("common.operation")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell className="flex h-full items-center gap-0.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={data.tweetUser.avatar ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      {data.tweetUser.name}
                    </TableCell>
                    <TableCell>@{data.tweetUser.screenName}</TableCell>
                    <TableCell>{data.tweetUser.followersCount}</TableCell>
                    <TableCell>
                      {dayjs(data.dateUpdated).format("YYYY/MM/DD HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRemoveFollow(data.tweetUser.id)}
                        disabled={tableDataLoading}
                      >
                        {t("signals.kol.removeKol")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/*<TableFooter>*/}
              {/*  <TableRow>*/}
              {/*    <TableCell colSpan={3}>Total</TableCell>*/}
              {/*    <TableCell className="text-right">$2,500.00</TableCell>*/}
              {/*  </TableRow>*/}
              {/*</TableFooter>*/}
            </Table>
          )}
        </div>
      )}
    </>
  );
}
