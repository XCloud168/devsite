"use client";

import SwapWidget from "@/components/swap/widget";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function SwapPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Swap");

  const fromChain = searchParams.get("fromChain") || undefined;
  const toChain = searchParams.get("toChain") || undefined;
  const fromToken = searchParams.get("fromToken") || undefined;
  const toToken = searchParams.get("toToken") || undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-[500px] items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold dark:text-white">
          {t("title")}
        </h1>
        <SwapWidget
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          toToken={toToken}
          className="w-full"
        />
      </div>
    </div>
  );
}
