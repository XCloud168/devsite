"use client";

import SwapWidget from "@/components/swap/widget";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function SwapPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Swap");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="min-h-[500px] w-full max-w-[500px] items-center rounded-lg border bg-white p-4 shadow-lg dark:bg-black">
        <h1 className="mb-6 text-center text-2xl font-bold dark:text-white">
          {t("title")}
        </h1>
        <SwapWidget />
      </div>
    </div>
  );
}
