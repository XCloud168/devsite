import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";

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
  marketCap: string;
  totalLiquidity: string;
  totalSupply: string;
  pool: string;
  holders: string;
  fdv: string;

  volume24h: string;
  priceChange5m: string;
  priceChange1h: string;
  priceChange6h: string;
  priceChange24h: string;
  isHoneypot: boolean;
}

export default function ProjectSearch({
  signal,
  onOpen,
}: {
  signal: SignalItems;
  onOpen: () => Promise<ServerResult>;
}) {
  const t = useTranslations();
  const getAvatarSrc = () => {
    if (signal.providerType === "twitter")
      return signal?.source?.tweetUser?.avatar || "";
    if (signal.providerType === "news")
      return signal?.source?.newsEntity?.logo || "";
    return signal?.source?.exchange?.logo || "";
  };
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("common.success"));
    } catch (err) {
      toast.error(t("common.failed"));
    }
  };
  const YesNo = (flag: boolean, color: string) => {
    if (!flag) {
      return (
        <div className="flex items-center gap-1">
          <p className={`text-xs text-[${color}]`}>{t("common.no")}</p>
          <CircleX size={14} color={color} />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <p className={`text-xs text-[${color}]`}>{t("common.yes")}</p>
        <CircleCheck size={14} color={color} />
      </div>
    );
  };
  function trimDecimal(value?: string): string {
    if (!value) return "0";
    const match = /^(\d+)\.(\d+)$/.exec(value);

    if (!match) return value;

    const [, integerPart, decimalPart] = match;

    if (!decimalPart) return value;

    return decimalPart.length <= 5
      ? value
      : `${integerPart}.${decimalPart.slice(0, 5)}`;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <DialogContent className="w-[94%] space-y-4 border-[#253237] bg-[#0B0D0E] p-5 md:w-[480px]">
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
                <AvatarImage src={getAvatarSrc()} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <p className="text-lg text-[#FFE030]">{signal.project.symbol}</p>
              <p className="text-lg">{signal.project.priceSource}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">{t("signals.project.ca")}：</p>
              <p className="max-w-64 truncate text-sm">
                {contractAddresses && contractAddresses.length > 0
                  ? contractAddresses.map((address) => address.address)
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
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">{t("signals.project.cap")}</p>
            <p>{pageLoading ? "--" : trimDecimal(currentData?.marketCap)}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.liquidity")}
            </p>
            <p>
              {pageLoading ? "--" : trimDecimal(currentData?.totalLiquidity)}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.supply")}
            </p>
            <p>{pageLoading ? "--" : trimDecimal(currentData?.totalSupply)}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.holders")}
            </p>
            <p>{pageLoading ? "--" : trimDecimal(currentData?.holders)}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">FDV</p>
            <p>{pageLoading ? "--" : currentData?.fdv}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs text-white/60">
              {t("signals.project.24hVol")}
            </p>
            <p>{pageLoading ? "--" : trimDecimal(currentData?.volume24h)}</p>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.5min")}</p>
            <p>{pageLoading ? "--" : currentData?.priceChange5m + "%"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.1h")}</p>
            <p>{pageLoading ? "--" : currentData?.priceChange1h + "%"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.6h")}</p>
            <p>{pageLoading ? "--" : currentData?.priceChange6h + "%"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/60">{t("signals.project.24h")}</p>
            <p>{pageLoading ? "--" : currentData?.priceChange24h + "%"}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex w-full items-center gap-1 rounded-t-lg bg-[#1E2128] px-3 py-2">
            <TriangleAlert size={14} color="#FFE030" />
            <p className="text-xs text-[#FFE030]">
              {t("signals.project.alert")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-b-lg bg-[#1E2128] px-3 py-2">
            <div className="flex">
              <p className="text-xs text-white/60">
                {t("signals.project.mention")}：
              </p>
              {!pageLoading ? YesNo(signal.times === "1", "#02DE97E5") : null}
            </div>
            <div className="flex">
              <p className="text-xs text-white/60">
                {t("signals.project.honeypot")}：
              </p>
              {!pageLoading
                ? YesNo(currentData?.isHoneypot ?? false, "#02DE97E5")
                : null}
            </div>
            <div className="flex">
              <p className="text-xs text-white/60">
                {t("signals.project.risk")}：
              </p>
              {!pageLoading
                ? YesNo(
                    Boolean(currentData?.priceChange24h) &&
                      parseFloat(currentData?.priceChange24h ?? "0") > 50,
                    "#FF4E30E5",
                  )
                : null}
              {Boolean(currentData?.priceChange24h) &&
                parseFloat(currentData?.priceChange24h ?? "0") > 50 && (
                  <p className="ml-2 text-xs text-[#FF4E30]">
                    {t("signals.project.24h")}：{currentData?.priceChange24h}
                  </p>
                )}
            </div>
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
