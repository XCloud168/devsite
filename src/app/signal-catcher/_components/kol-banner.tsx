"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
export type KolMenu = {
  label: string;
  value: "1" | "2" | "3";
};

interface KolMenuProps {
  onKolMenuChangeAction: (menu: KolMenu) => void;
  isMobile?: boolean;
}
export function KolBanner({ onKolMenuChangeAction, isMobile }: KolMenuProps) {
  const t = useTranslations();
  const [selectedMenu, setSelectedMenu] = useState<KolMenu>({
    label: "kol",
    value: "2",
  });
  const kolMenu: KolMenu[] = useMemo(() => {
    const baseMenu: KolMenu[] = [
      { label: "kol", value: "2" },
      { label: "myKol", value: "3" },
    ];

    return isMobile ? [{ label: "signal", value: "1" }, ...baseMenu] : baseMenu;
  }, [isMobile]);
  return (
    <>
      <div className="sticky top-0 z-10 flex border-b bg-background px-5 pt-5">
        <div className="flex gap-10">
          {kolMenu.map((menu) => (
            <div
              className={`${menu.value === selectedMenu.value ? "border-primary font-bold text-primary" : "border-transparent font-normal text-black dark:text-foreground/80"} cursor-pointer break-keep border-b-2 pb-[18px] text-center hover:text-primary`}
              key={menu.value}
              onClick={() => {
                onKolMenuChangeAction(menu);
                setSelectedMenu(menu);
              }}
            >
              {t("signals.kol." + menu.label)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
