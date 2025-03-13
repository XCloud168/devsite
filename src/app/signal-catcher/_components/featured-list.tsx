"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedList() {
  return (
    <>
      {[1, 2, 3, 4].map((item: any) => (
        <div
          className="grid grid-cols-[48px_1fr] gap-1 overflow-hidden px-5"
          key={item}
        >
          <div className="h-full">
            <div className="h-10 w-10 rounded-full border border-white"></div>
            <div className="h-full w-[20px] border-r border-dashed"></div>
          </div>
          <div className="min-h-20">
            <p className="font-bold leading-5">Binance</p>
            <p className="leading-5 text-[#FFFFA7]">2025-03-28 23:34:26</p>
            <div className="relative h-fit w-full bg-transparent">
              <p className="py-2 text-white/90">
                Binance Will Add RedStone (RED) on Earn, Buy Crypto, Convert,
                Margin & Futures/Launch Time: March 6, 2025 16:00 (UTC)/Trading
                Pairs: RED/USDT, RED/USDC, RED/FDUSD
              </p>
            </div>
            {item < 3 ? (
              <div className="mb-2 flex h-14 items-center bg-gradient-to-r-50-transparent">
                <div className="border-spin-image ml-3 flex h-9 w-9 items-center justify-center">
                  <div className="z-10 h-8 w-8 overflow-hidden rounded-full ring-1 ring-[#6CFFE9]">
                    <div className="flex h-full w-full items-center justify-center bg-black">
                      1
                    </div>
                  </div>
                </div>
                <p className="ml-4 font-bold">KAITO</p>
                <p className="ml-10 text-xs">24h max pnl%</p>
                <p className="ml-2 font-extrabold text-[#00FFAB]">+21.78%</p>
                <div className="ml-10 h-4 w-4 bg-[url(/images/signal/positive.svg)] bg-cover"></div>
                <p className="ml-1.5">POSITIVE</p>
                <Button variant="default" className="ml-auto">
                  购买代币
                </Button>
              </div>
            ) : (
              <div className="mb-2 flex h-2.5 items-center bg-gradient-to-r-50-transparent" />
            )}
            <div className="mt-8 flex gap-6 px-3 pb-5">
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
    </>
  );
}
