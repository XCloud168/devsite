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
import Link from "next/link";
import { toast } from "sonner";

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
export function KolPanel3({
  getTweetListAction,
  getFollowedListAction,
  removeFollowAction,
}: Props) {
  const [showTable, setShowTable] = useState(false);
  const [tweetList, setTweetList] = useState<TweetInfo[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasContractAddress, setHasContractAddress] = useState<boolean>(false);
  const [followList, setFollowList] = useState<WatchItem[]>([]);

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
      console.log(response.data);
      setFollowList(response.data);
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
      setFollowList(response.data);
    };
    const fetchData = async () => {
      const response = await removeFollowAction(id);
      if (response.error) {
        toast.error("出错啦");
      } else {
        toast.success("删除成功");
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
              <p>代币相关</p>
              <div>
                <Switch
                  id="airplane-mode"
                  checked={hasContractAddress}
                  onCheckedChange={changeHasContractAddress}
                />
              </div>
            </div>
            <div className="flex w-[240px] items-center justify-between border px-6 py-4">
              <p>监控列表</p>
              <div
                className="cursor-pointer"
                onClick={() => setShowTable(true)}
              >
                <AngleIcon className="h-4 w-2 fill-black stroke-[#494949]" />
              </div>
            </div>
          </div>

          {tweetList.map((tweet) => (
            <div key={tweet.id} className="mt-3">
              <p className="">
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
                    onClick={() => handleRemoveFollow(tweet.id)}
                  >
                    取消监控
                  </Button>
                </div>
                <div></div>
              </div>
              <div className="mt-4 rounded-sm border border-[#494949]">
                <p className="mb-1.5 px-3 pt-3">
                  In support of the policies of President @realDonaldTrump and
                  to demonstrate our confidence in the future of the United
                  States, @Tesla commits to doubling vehicle production in the
                  US within 2 years!
                </p>
                <p className="text-sx mb-1.5 px-3 text-xs text-[#01A4D9]">
                  隐藏翻译
                </p>
                <div className="bg-[#494949] p-3">
                  <p>
                    为了支持唐纳德・特朗普总统（@realDonaldTrump）的政策，并展现我们对美国未来的信心，特斯拉公司（@Tesla）承诺在两年内将其在美国的汽车产量提高一倍！
                  </p>
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
            <div className="mt-4 flex justify-center">
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
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-3 py-4">
            <div className="cursor-pointer" onClick={() => setShowTable(false)}>
              <AngleIcon className="h-4 w-2 rotate-180 fill-black stroke-[#fff]" />
            </div>
            <p>我的监控</p>
          </div>
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>followers</TableHead>
                <TableHead>time</TableHead>
                <TableHead>project</TableHead>
                <TableHead>action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followList.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.tweetUser.name}</TableCell>
                  <TableCell>@{data.tweetUser.screenName}</TableCell>
                  <TableCell>123</TableCell>
                  <TableCell>
                    {dayjs(data.dateUpdated).format("YYYY/MM/DD HH:mm:ss")}
                  </TableCell>
                  <TableCell>{data.tweetUser.tweetCount}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFollow(data.tweetUser.id)}
                    >
                      取消关注
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
        </div>
      )}
    </>
  );
}
