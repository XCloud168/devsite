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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { type ServerResult } from "@/lib/server-result";
import { formatNumber } from "@/components/formatNumber";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleAlert } from "lucide-react";
interface Props {
  getWinRankingListAction: (period: string) => Promise<ServerResult>;
  isMobile?: boolean;
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
export function WinComponent({ getWinRankingListAction, isMobile }: Props) {
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

  // 动画帧更新
  const ellipseRadiusX = 250;
  const ellipseRadiusZ = 150;
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef(0);
  useEffect(() => {
    const planets = [1, 2, 3];
    const speed = 0.002;
    let animationFrameId: number | null = null;
    const animate = () => {
      planets.forEach((_, index) => {
        const planetAngle =
          angleRef.current +
          (index * (2 * Math.PI)) / planets.length +
          Math.PI / 2;
        const x = Math.sin(planetAngle) * ellipseRadiusX;
        const z = Math.cos(planetAngle) * ellipseRadiusZ;
        const planet = planetRefs.current[index];
        if (planet) {
          planet.style.transform = `translateX(${x}px) translateZ(${z}px)`;
          const scale =
            0.8 + ((z + ellipseRadiusZ) / (ellipseRadiusZ * 2)) * 0.4;
          planet.style.scale = `${scale}`;
          planet.style.zIndex = Math.floor(
            (z + ellipseRadiusZ) * 100,
          ).toString();
        }
      });
      angleRef.current += speed; // 旋转速度
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    // 正确的清理函数
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const Banner = useMemo(() => {
    const Card1 = (
      <div className="px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tableData[1]?.avatar ?? ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-semibold">{tableData[1]?.name}</p>
            <p className="text-sm text-white/60">
              {formatNumber(tableData[1]?.followersCount)}{" "}
              {t("dashboard.winRanking.followers")}
            </p>
          </div>
        </div>
        <div className="mt-7 flex justify-between">
          <div>
            <p className="text-xs">{t("dashboard.winRanking.winRate")}</p>
            <p className="text-[#FFFFA7]">
              {tableData[1]?.positiveRatePercentage}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs">{t("dashboard.winRanking.record")}</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={tableData[1]?.maxHighRateProject.logo ?? ""}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p className="">{tableData[1]?.maxHighRateProject.symbol}</p>
              <p className="text-primary">+{tableData[1]?.maxHighRate}%</p>
            </div>
          </div>
        </div>
      </div>
    );
    const Card2 = (
      <div className="px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tableData[0]?.avatar ?? ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-semibold">{tableData[0]?.name}</p>
            <p className="text-sm text-white/60">
              {formatNumber(tableData[0]?.followersCount)}{" "}
              {t("dashboard.winRanking.followers")}
            </p>
          </div>
        </div>
        <div className="mt-7 flex justify-between">
          <div>
            <p className="text-xs">{t("dashboard.winRanking.winRate")}</p>
            <p className="text-[#FFFFA7]">
              {tableData[0]?.positiveRatePercentage}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs">{t("dashboard.winRanking.record")}</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={tableData[0]?.maxHighRateProject.logo ?? ""}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p className="">{tableData[0]?.maxHighRateProject.symbol}</p>
              <p className="text-primary">+{tableData[0]?.maxHighRate}%</p>
            </div>
          </div>
        </div>
      </div>
    );
    const Card3 = (
      <div className="px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tableData[2]?.avatar ?? ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-semibold">{tableData[2]?.name}</p>
            <p className="text-sm text-white/60">
              {formatNumber(tableData[2]?.followersCount)}
              {t("dashboard.winRanking.followers")}
            </p>
          </div>
        </div>
        <div className="mt-7 flex justify-between">
          <div>
            <p className="text-xs">{t("dashboard.winRanking.winRate")}</p>
            <p className="text-[#FFFFA7]">
              {tableData[2]?.positiveRatePercentage}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs">{t("dashboard.winRanking.record")}</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={tableData[2]?.maxHighRateProject.logo ?? ""}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p className="">{tableData[2]?.maxHighRateProject.symbol}</p>
              <p className="text-primary">+{tableData[2]?.maxHighRate}%</p>
            </div>
          </div>
        </div>
      </div>
    );
    if (isMobile) {
      return (
        <div className="perspective relative mt-8 h-[120px]">
          <div className="transformStyle absolute inset-0">
            <div
              ref={(el) => {
                planetRefs.current[0] = el;
              }}
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute left-1/2 w-[300px] overflow-hidden rounded-xl border border-[#D7D7D780] bg-background"
            >
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no2.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#D7D7D780] to-[#3D3D3D00] pl-3 text-xs leading-5">
                Top 2
              </div>
              {Card1}
            </div>
            <div
              ref={(el) => {
                planetRefs.current[1] = el;
              }}
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute left-1/2 w-[300px] overflow-hidden rounded-xl border border-[#FFFFA780] bg-background"
            >
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no1.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#FFFFA780] to-[#99996400] pl-3 text-xs leading-5">
                Top 1
              </div>
              {Card2}
            </div>
            <div
              ref={(el) => {
                planetRefs.current[2] = el;
              }}
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute left-1/2 w-[300px] overflow-hidden rounded-xl border border-[#A06C4D80] bg-background"
            >
              <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no3.png)] bg-contain bg-no-repeat"></div>
              <div className="h-5 w-1/3 bg-gradient-to-r from-[#A06C4D80] to-[#3D3D3D00] pl-3 text-xs leading-5">
                Top 3
              </div>
              {Card3}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-8 grid grid-cols-3 gap-10">
        <div className="relative mt-6 w-[300px] overflow-hidden rounded-xl border border-[#D7D7D780]">
          <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no2.png)] bg-contain bg-no-repeat"></div>
          <div className="h-5 w-1/3 bg-gradient-to-r from-[#D7D7D780] to-[#3D3D3D00] pl-3 text-xs leading-5">
            Top 2
          </div>
          {Card1}
        </div>
        <div className="relative mb-6 w-[300px] overflow-hidden rounded-xl border border-[#D7D7D780]">
          <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no1.png)] bg-contain bg-no-repeat"></div>
          <div className="h-5 w-1/3 bg-gradient-to-r from-[#FFFFA780] to-[#99996400] pl-3 text-xs leading-5">
            Top 1
          </div>
          {Card2}
        </div>
        <div className="relative mt-6 w-[300px] overflow-hidden rounded-xl border border-[#D7D7D780]">
          <div className="absolute right-4 top-0 h-[49px] w-[44px] bg-[url(/images/dashboard/no3.png)] bg-contain bg-no-repeat"></div>
          <div className="h-5 w-1/3 bg-gradient-to-r from-[#A06C4D80] to-[#3D3D3D00] pl-3 text-xs leading-5">
            Top 3
          </div>
          {Card3}
        </div>
      </div>
    );
  }, [isMobile, t, tableData]);

  return (
    <div className="relative mt-5 flex justify-center overflow-hidden">
      <div className="absolute z-0 h-[332px] w-full border-b bg-[url(/images/dashboard/bg.png)] bg-contain bg-center bg-no-repeat"></div>
      <div className="z-[2] flex flex-col items-center justify-center">
        <Tabs
          defaultValue="7d"
          className="w-32"
          onValueChange={(e) => {
            setPageLoading(true);
            getWinRankingListAction(e).then((res) => {
              setTableData(res.data);
              setPageLoading(false);
            });
          }}
        >
          <TabsList className="grid w-full grid-cols-2 px-1">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
          </TabsList>
        </Tabs>

        {!pageLoading && tableData ? (
          Banner
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
            <Skeleton className="mt-6 h-[170px] w-[300px] bg-secondary" />
            <Skeleton className="mb-6 hidden h-[170px] w-[300px] bg-secondary md:block" />
            <Skeleton className="mt-6 hidden h-[170px] w-[300px] bg-secondary md:block" />
          </div>
        )}
        <div className="mt-24 flex items-center gap-5">
          <div className="h-[1px] w-5 bg-white"></div>
          <p className="text-lg font-semibold">TOP 50</p>
          <div className="h-[1px] w-5 bg-white"></div>
        </div>
        <div className="relative mt-5 h-full w-screen overflow-y-scroll pr-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary md:h-[calc(100vh-560px)] md:w-full md:pr-3">
          {!pageLoading && tableData ? (
            <Table>
              {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>{t("dashboard.winRanking.ranking")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.username")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.followers")}</TableHead>
                  <TableHead className="flex items-center whitespace-nowrap">
                    {t("dashboard.winRanking.winRate")}
                    <Popover>
                      <PopoverTrigger asChild className="pl-1">
                        <div className="min-h-3 min-w-3">
                          <CircleAlert
                            size={12}
                            className="text-accent-foreground/80"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit rounded-lg border bg-background p-2 text-xs text-white/90">
                        {t("dashboard.winRanking.winTip")}
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                  <TableHead>{t("dashboard.winRanking.record")}</TableHead>
                  <TableHead>{t("dashboard.winRanking.analysis")}</TableHead>
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
                      +{data.positiveRatePercentage}%
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={data.maxHighRateProject.logo ?? ""} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <p>{data.maxHighRateProject.symbol}</p>
                      <p className="h-9 truncate leading-9 text-primary">
                        +{data.maxHighRate}%
                      </p>
                    </TableCell>

                    <TableCell>
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
            <div className="space-y-3 px-3 md:px-0">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton
                  className="h-8 w-full bg-secondary md:w-full"
                  key={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
