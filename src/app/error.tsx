"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex animate-spin items-center justify-center opacity-20">
            <div className="h-32 w-32 rounded-full border-8 border-gray-200 border-t-primary"></div>
          </div>
          <h1 className="relative z-10 text-4xl font-bold">
            {t("somethingWrong")}
          </h1>
        </div>
        <p className="max-w-[500px] text-muted-foreground">{t("errorDesc")}</p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-lg bg-muted p-4 text-left">
            <p className="break-all font-mono text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}
