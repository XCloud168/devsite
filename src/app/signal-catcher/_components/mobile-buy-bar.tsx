"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function MobileBuyBar() {
  const t = useTranslations();

  return (
    <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center">
      <div className="rounded-full bg-background px-3 py-2 text-sm ring-1">
        {t.rich("signals.buyContent", {
          link: (chunks) => (
            <Link className="px-0.5 text-primary" href={"/pricing"}>
              {chunks}
            </Link>
          ),
        })}
      </div>
    </div>
  );
}
