"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import React, { useEffect, useState } from "react";
import { type ServerResult } from "@/lib/server-result";
import { formatNumber } from "@/components/formatNumber";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
interface Props {
  getWinRankingListAction: (period: string) => Promise<ServerResult>;
}
interface rankingItem {
  followersCount: number;
  id: string;
  maxHighRate: string;
  name: string;
  positiveRatePercentage: string;
  screenName: string;
  signalsCount: number;
  avatar: string;
  maxHighRateProject: {
    id: string;
    logo: string;
    symbol: string;
  };
}
export function WinComponent({ getWinRankingListAction }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [tableData, setTableData] = useState<rankingItem[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      const response = await getWinRankingListAction("7d");
      setTableData(response.data);
      setPageLoading(false);
    };
    fetchData();
  }, [getWinRankingListAction]);
  return (
    <div className="relative mt-5 flex justify-center">
      <div className="absolute z-0 h-[332px] w-full bg-[url(/images/dashboard/bg.png)] bg-contain bg-center bg-no-repeat"></div>
      <div className="z-[2] flex flex-col items-center justify-center">
        <Tabs
          defaultValue="7d"
          className="w-fit"
          onValueChange={(e) => {
            setPageLoading(true);
            getWinRankingListAction(e).then((res) => {
              setTableData(res.data);
              setPageLoading(false);
            });
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
          </TabsList>
        </Tabs>

        {!pageLoading && tableData ? (
          <div className="mt-8 grid grid-cols-3 gap-10">
            <div className="relative mt-6 w-[280px] overflow-hidden rounded-xl border border-[#D7D7D780]">
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no2.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#D7D7D780] to-[#3D3D3D00] pl-3 text-xs leading-5">
                Top 2
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tableData[1]?.avatar ?? ""} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p>{tableData[1]?.name}</p>
                    <p>
                      {formatNumber(tableData[1]?.followersCount)}{" "}
                      {t("dashboard.winRanking.followers")}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.winRate")}
                    </p>
                    <p className="text-[#FFFFA7]">
                      {tableData[1]?.maxHighRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.record")}
                    </p>
                    <div className="flex gap-2">
                      <p className="">
                        {tableData[1]?.maxHighRateProject.symbol}
                      </p>
                      <p className="text-primary">
                        +{tableData[1]?.positiveRatePercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mb-6 w-[280px] overflow-hidden rounded-xl border border-[#D7D7D780]">
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no1.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#FFFFA780] to-[#99996400] pl-3 text-xs leading-5">
                Top 1
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tableData[0]?.avatar ?? ""} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p>{tableData[0]?.name}</p>
                    <p>
                      {formatNumber(tableData[0]?.followersCount)}{" "}
                      {t("dashboard.winRanking.followers")}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.winRate")}
                    </p>
                    <p className="text-[#FFFFA7]">
                      {tableData[0]?.maxHighRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.record")}
                    </p>
                    <div className="flex gap-2">
                      <p className="">
                        {tableData[0]?.maxHighRateProject.symbol}
                      </p>
                      <p className="text-primary">
                        +{tableData[0]?.positiveRatePercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-6 w-[280px] overflow-hidden rounded-xl border border-[#A06C4D80]">
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no3.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#A06C4D80] to-[#3D3D3D00] pl-3 text-xs leading-5">
                Top 3
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tableData[2]?.avatar ?? ""} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p>{tableData[2]?.name}</p>
                    <p>
                      {formatNumber(tableData[2]?.followersCount)}{" "}
                      {t("dashboard.winRanking.followers")}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-between">
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.winRate")}
                    </p>
                    <p className="text-[#FFFFA7]">
                      {tableData[2]?.maxHighRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">
                      {t("dashboard.winRanking.record")}
                    </p>
                    <div className="flex gap-2">
                      <p className="">
                        {tableData[2]?.maxHighRateProject.symbol}
                      </p>
                      <p className="text-primary">
                        +{tableData[2]?.positiveRatePercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-3 gap-10">
            <Skeleton className="mt-6 h-[170px] w-[280px] bg-secondary" />
            <Skeleton className="mb-6 h-[170px] w-[280px] bg-secondary" />
            <Skeleton className="mt-6 h-[170px] w-[280px] bg-secondary" />
          </div>
        )}
        <div className="mt-20 flex items-center gap-5">
          <div className="h-[1px] w-5 bg-white"></div>
          <p>TOP 50</p>
          <div className="h-[1px] w-5 bg-white"></div>
        </div>
        <div className="mt-10 w-full">
          {!pageLoading && tableData ? (
            <Table>
              {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.winRanking.ranking")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.username")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.followers")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.winRate")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.record")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.more")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={data.avatar ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <p
                        className="h-9 max-w-32 truncate leading-9"
                        title={data.name}
                      >
                        {data.name}
                      </p>
                    </TableCell>
                    <TableCell>{formatNumber(data.followersCount)}</TableCell>
                    <TableCell className="text-[#FFFFA7]">
                      +{data.maxHighRate}%
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={data.maxHighRateProject.logo ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <p>{data.maxHighRateProject.symbol}</p>
                      <p className="h-9 truncate leading-9 text-primary">
                        +{data.positiveRatePercentage}%
                      </p>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        className="justify-start gap-2"
                        onClick={() => router.push(`/dashboard/${data.id}`)}
                      >
                        {t("dashboard.winRanking.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton className="h-8 w-full bg-secondary" key={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
