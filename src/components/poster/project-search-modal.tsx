import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { type ReactNode, useState } from "react";

import { useTranslations } from "next-intl";
import {
  CircleCheck,
  CircleX,
  Copy,
  LoaderCircle,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SignalItems } from "@/app/signal-catcher/_components/featured-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ServerResult } from "@/lib/server-result";
import Link from "next/link";
import { toast } from "sonner";

interface ContractInfo {
  currentPrice: string;
  marketCap: number;
  totalLiquidity: number;
  totalSupply: number;
  pool: string;
  holders: number;
  fdv: number;
  chainLogoUrl: string;
  volume24h: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange4h: number;
  priceChange24h: number;
  isHoneypot: boolean | string;
  days: number;
}

export default function ProjectSearch({
  signal,
  onOpen,
}: {
  signal: SignalItems;
  onOpen: () => Promise<ServerResult>;
}) {
  const t = useTranslations();
  const contractAddresses = signal.project
    ? [
        {
          chain: "SOL",
          address: signal.project.solContract,
        },
        {
          chain: "ETH",
          address: signal.project.ethContract,
          chainId: "1",
        },
        {
          chain: "BSC",
          address: signal.project.bscContract,
          chainId: "56",
        },
        {
          chain: "Tron",
          address: signal.project.tronContract,
          chainId: null,
        },
        {
          chain: "BASE",
          address: signal.project.baseContract,
          chainId: "8453",
        },
        {
          chain: "Blast",
          address: signal.project.blastContract,
          chainId: "81457",
        },
      ].filter((contract) => contract.address && contract.address.trim() !== "")
    : [];
  const [pageLoading, setPageLoading] = useState(false);
  const [currentData, setCurrentData] = useState<ContractInfo>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("common.success"));
    } catch (err) {
      toast.error(t("common.failed"));
    }
  };

  function trimDecimal(value?: string): string {
    if (!value || value === "--") return "--";

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    const absNum = Math.abs(num);
    let formatted: string;

    if (absNum >= 1_000_000_000) {
      formatted = (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
    } else if (absNum >= 1_000_000) {
      formatted = (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
    } else if (absNum >= 1_000) {
      formatted = (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "K";
    } else {
      // 小于 1000 的情况
      const isInteger = Number.isInteger(num);
      if (isInteger) {
        formatted = num.toString();
      } else {
        // 保留最多4位小数，去掉末尾多余的0
        formatted = num.toFixed(4).replace(/\.?0+$/, "");
      }
    }

    return `$${formatted}`;
  }

  function formatSmartDecimal(input: number | string): ReactNode {
    const str = typeof input === "number" ? input.toString() : input;
    const leadingZeroMatch = /^0\.0*(\d+)/.exec(str);
    const leadingZeros = /^0\.0*/.exec(str)?.[0].length ?? 2;
    if (leadingZeroMatch?.[1]) {
      const zeroCount = leadingZeros - 2;
      if (zeroCount >= 4) {
        const decimalDigits = leadingZeroMatch[1];
        const display = `${zeroCount}${decimalDigits}`.slice(0, 7);
        return (
          <span>
            0.
            <span className="inline-block align-baseline text-xs text-gray-500">
              {zeroCount}
            </span>
            {display.slice(zeroCount)}
          </span>
        );
      }
    }

    const parts = str.split(".");
    const intPart = parts[0] ?? "0";
    const decPart = parts[1] ?? "";
    const remainLength = 8 - intPart.length;
    if (remainLength <= 0) {
      return <span>{intPart.slice(0, 8)}</span>;
    }
    const decTrimmed = decPart.slice(0, remainLength);
    return <span>{`${intPart}.${decTrimmed}`}</span>;
  }

  function checkPercent(input?: number | string) {
    if (!input) return "--";
    if (input === "--") return "--";
    return `${input}%`;
  }

  function shortenString(str: string): string {
    if (str.length <= 8) return str; // 不足 8 位的直接返回
    return `${str.slice(0, 5)}...${str.slice(-3)}`;
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (open) {
          setPageLoading(true);
          onOpen().then((res) => {
            setPageLoading(false);
            setCurrentData(res.data);
          });
        }
      }}
    >
      <DialogTrigger className="flex items-center gap-0.5 text-sm">
        <ScanSearch size={16} />
        <p> {t("signals.project.tokenIntel")}</p>
      </DialogTrigger>
      <DialogHeader className="hidden">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="w-[94%] space-y-2 border-[#253237] bg-[#0B0D0E] p-5 md:w-[440px]">
        {pageLoading && (
          <div className="absolute bottom-0 left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur-sm">
            <LoaderCircle className="animate-spin" size={40} />
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 rounded-full ring-1 ring-[#FFE030]">
            <Avatar className="h-13 w-13">
              <AvatarImage src={signal.project.logo ?? ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full ring-1 ring-blue-300">
              <Avatar className="h-5 w-5">
                <AvatarImage src={currentData?.chainLogoUrl} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <p className="text-lg text-[#FFE030]">{signal.project.symbol}</p>
              <p className="text-lg font-bold text-[#02DE97]">
                ${formatSmartDecimal(currentData?.currentPrice ?? 0)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">{t("signals.project.ca")}：</p>
              <p className="max-w-60 truncate text-sm">
                {contractAddresses && contractAddresses.length > 0
                  ? contractAddresses.map((address) =>
                      shortenString(address.address ?? ""),
                    )
                  : "-"}
              </p>
              <Copy
                size={12}
                className="cursor-pointer"
                onClick={() => {
                  handleCopy(contractAddresses[0]?.address ?? "");
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-[1px]">
          <div className="flex w-full items-center gap-1 rounded-t-lg bg-[#1E2128] px-3 py-2">
            <TriangleAlert size={14} color="#FFE030" />
            <p className="text-xs text-[#FFE030]">
              {t("signals.project.alert")}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-b-lg bg-[#1E2128] px-3 py-2">
            <div className="space-y-1">
              <p className="text-xs text-white/60">
                {t("signals.project.mention")}
              </p>
              {!pageLoading ? (
                signal.times === "1" ? (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#FF4E30E5]">
                      {t("common.yes")}
                    </p>

                    <CircleCheck size={14} color="#FF4E30E5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#02DE97E5]">{t("common.no")}</p>
                    <CircleX size={14} color="#02DE97E5" />
                  </div>
                )
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">
                {t("signals.project.honeypot")}
              </p>
              {!pageLoading ? (
                currentData?.isHoneypot && currentData?.isHoneypot === "?" ? (
                  <p className="text-xs">unknown ?</p>
                ) : currentData?.isHoneypot ? (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#FF4E30E5]">
                      {t("common.yes")}
                    </p>
                    <CircleCheck size={14} color="#FF4E30E5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#02DE97E5]">{t("common.no")}</p>
                    <CircleX size={14} color="#02DE97E5" />
                  </div>
                )
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">
                {t("signals.project.launchDate")}
              </p>
              <p
                className="text-xs"
                style={{
                  color:
                    currentData?.days && currentData?.days > 60
                      ? "#02DE97E5"
                      : "#FF4E30E5",
                }}
              >
                {currentData?.days}D
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">{t("signals.project.cap")}</p>
            <p
              style={{
                color:
                  currentData?.marketCap && currentData?.marketCap < 1000000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading
                ? "--"
                : trimDecimal(currentData?.marketCap.toString())}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.liquidity")}
            </p>
            <p
              style={{
                color:
                  currentData?.totalLiquidity &&
                  currentData?.totalLiquidity < 100000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading
                ? "--"
                : trimDecimal(currentData?.totalLiquidity.toString())}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.supply")}
            </p>
            <p
              style={{
                color:
                  currentData?.totalSupply &&
                  currentData?.totalSupply < 20000000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading
                ? "--"
                : trimDecimal(currentData?.totalSupply.toString())}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.holders")}
            </p>
            <p
              style={{
                color:
                  currentData?.holders && currentData?.holders < 1000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading
                ? "--"
                : trimDecimal(currentData?.holders.toString()).replace("$", "")}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">FDV</p>
            <p
              style={{
                color:
                  currentData?.fdv && currentData?.fdv < 2000000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading ? "--" : trimDecimal(currentData?.fdv.toString())}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#1E212899] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.24hVol")}
            </p>
            <p
              style={{
                color:
                  currentData?.volume24h && currentData?.volume24h < 300000
                    ? "#FF4E30"
                    : "#fff",
              }}
            >
              {pageLoading
                ? "--"
                : trimDecimal(currentData?.volume24h.toString())}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 px-2">
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.5min")}</p>
            <p
              className={
                currentData?.priceChange5m
                  ? currentData?.priceChange5m > 0
                    ? "text-[#02DE97]"
                    : "text-[#FF4E30]"
                  : "text-[#fff]"
              }
            >
              {pageLoading ? "--" : checkPercent(currentData?.priceChange5m)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.1h")}</p>
            <p
              className={
                currentData?.priceChange1h
                  ? currentData?.priceChange1h > 0
                    ? "text-[#02DE97]"
                    : "text-[#FF4E30]"
                  : "text-[#fff]"
              }
            >
              {pageLoading ? "--" : checkPercent(currentData?.priceChange1h)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.6h")}</p>
            <p
              className={
                currentData?.priceChange4h
                  ? currentData?.priceChange4h > 0
                    ? "text-[#02DE97]"
                    : "text-[#FF4E30]"
                  : "text-[#fff]"
              }
            >
              {pageLoading ? "--" : checkPercent(currentData?.priceChange4h)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.24h")}</p>
            <p
              className={
                currentData?.priceChange24h
                  ? currentData?.priceChange24h > 0
                    ? "text-[#02DE97]"
                    : "text-[#FF4E30]"
                  : "text-[#fff]"
              }
            >
              {pageLoading ? "--" : checkPercent(currentData?.priceChange24h)}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-5">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsModalOpen(false)}
          >
            {t("common.close")}
          </Button>
          <Button variant="secondary" size="lg">
            <Link href={"/swap"}>{t("signals.signal.quickSwap")}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
