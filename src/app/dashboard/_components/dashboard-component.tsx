"use client";

import React, { useMemo, useState } from "react";
import { RiseComponent } from "@/app/dashboard/_components/rise-component";
import { WinComponent } from "@/app/dashboard/_components/win-component";
import { TestingComponent } from "@/app/dashboard/_components/testing-component";
import { type ServerResult } from "@/lib/server-result";
import { useTranslations } from "next-intl";
export type Menu = {
  label: string;
  value: string;
};
interface Props {
  getWinRankingListAction: (period: string) => Promise<ServerResult>;
  get24hRankingListAction: () => Promise<ServerResult>;
  isMobile?: boolean;
}
export function DashboardComponent({
  getWinRankingListAction,
  get24hRankingListAction,
  isMobile,
}: Props) {
  const t = useTranslations();
  const menu: Menu[] = [
    { label: "leaderboard", value: "winRanking" },
    { label: "signalBoard", value: "riseRanking" },
    // { label: "KolTest", value: "KolTest" },
  ];
  const [selectedMenu, setSelectedMenu] = useState<Menu>({
    label: "leaderboard",
    value: "winRanking",
  });

  const Component = useMemo(() => {
    if (selectedMenu.value === "winRanking") {
      return (
        <WinComponent
          getWinRankingListAction={getWinRankingListAction}
          isMobile={isMobile}
        />
      );
    } else if (selectedMenu.value === "riseRanking") {
      return (
        <RiseComponent
          get24hRankingListAction={get24hRankingListAction}
          isMobile={isMobile}
        />
      );
    }
    return <TestingComponent />;
  }, [selectedMenu]);

  return (
    <>
      <div className="flex justify-center border-b pt-3">
        <div className="flex gap-2 md:gap-14">
          {menu.map((menu) => (
            <div
              key={menu.value}
              onClick={() => setSelectedMenu(menu)}
              className={`relative cursor-pointer break-keep p-2 text-center text-sm hover:text-primary md:text-base ${
                menu.value === selectedMenu.value
                  ? "font-bold text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-primary after:content-['']"
                  : "font-normal text-black dark:text-foreground/80"
              } `}
            >
              {t(`dashboard.${menu.label}`)}
            </div>
          ))}
        </div>
      </div>
      <div>{Component}</div>
    </>
  );
}
