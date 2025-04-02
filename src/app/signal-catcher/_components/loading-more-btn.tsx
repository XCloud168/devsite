"use client";

import { Button } from "@/components/ui/button";

import React from "react";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";

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
        <div className="flex items-center justify-center py-2">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <Button onClick={() => onNextAction()}> {t("common.loadMore")}</Button>
      )}
    </div>
  );
}
