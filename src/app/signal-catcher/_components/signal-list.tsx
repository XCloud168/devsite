"use client";

import Link from "next/link";

export function SignalList() {
  return (
    <>
      {[1, 2, 3, 4].map((item: any) => (
        <div
          className="grid grid-cols-[48px_1fr] gap-1 overflow-hidden pb-7"
          key={item}
        >
          <div className="h-full">
            <div className="h-10 w-10 rounded-full border border-white"></div>
            <div className="h-full w-[20px] border-r border-dashed"></div>
          </div>
          <div className="min-h-20">
            <p className="font-bold leading-5">Binance</p>
            <p className="mb-2 leading-5 text-[#00FFAB]">2025-03-28 23:34:26</p>
            <div className="relative h-fit w-full border border-transparent bg-transparent border-gradient-green-purple">
              <p className="px-5 py-3">
                Binance Will Add RedStone (RED) on Earn, Buy Crypto, Convert,
                Margin & Futures/Launch Time: March 6, 2025 16:00 (UTC)/Trading
                Pairs: RED/USDT, RED/USDC, RED/FDUSD
              </p>
              <div className="absolute right-6 top-0 h-1 w-[80px] bg-[#4E2465] clip-inverted-trapezoid" />
            </div>
            {item < 3 ? (
              <div className="bg-gradient-to-r-50-transparent mb-2 flex h-14 items-center">
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
                <div className="ml-10 h-[31px] w-[94px] bg-[url(/images/signal/positive.png)] bg-cover"></div>
              </div>
            ) : (
              <div className="bg-gradient-to-r-50-transparent mb-2 flex h-14 h-2.5 items-center" />
            )}
            <div className="flex gap-6">
              <Link
                className="flex items-center gap-0.5 text-xs text-[#617178]"
                href="/"
              >
                <div className="h-3 w-3 bg-[url(/images/signal/link.svg)] bg-contain"></div>
                <p>View Original Link</p>
              </Link>
              <Link
                className="flex items-center gap-0.5 text-xs text-[#617178]"
                href="/"
              >
                <div className="h-2.5 w-2.5 bg-[url(/images/signal/share.svg)] bg-contain"></div>
                <p>Share</p>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
