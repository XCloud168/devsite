"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
export type KolMenu = {
  label: string;
  value: "2" | "3";
};
export const kolMenu: KolMenu[] = [
  // {
  //   label: "CRYPTO速递",
  //   value: "1",
  // },
  {
    label: "kol",
    value: "2",
  },
  {
    label: "myKol",
    value: "3",
  },
];
interface KolMenuProps {
  onKolMenuChangeAction: (menu: KolMenu) => void;
}
export function KolBanner({ onKolMenuChangeAction }: KolMenuProps) {
  const t = useTranslations();
  const [selectedMenu, setSelectedMenu] = useState<KolMenu>({
    label: "kol",
    value: "2",
  });
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
