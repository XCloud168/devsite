"use client";

import { Button } from "@/components/ui/button";

import React from "react";
import { useTranslations } from "next-intl";

type Props = {
  hasNext: boolean;
  pageLoading: boolean;
  onNextAction: () => void;
};

export function LoadingMoreBtn({ hasNext, pageLoading, onNextAction }: Props) {
  const t = useTranslations();
  if (!hasNext) return null;
  return (
    <div className="my-4 flex justify-center">
      {pageLoading ? (
        <div className="flex items-center justify-center text-primary">
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
        <Button onClick={() => onNextAction()}> {t("common.loadMore")}</Button>
      )}
    </div>
  );
}
