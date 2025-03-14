"use client";

import { useState } from "react";
export type KolMenu = {
  label: string;
  value: "1" | "2" | "3";
};
export const kolMenu: KolMenu[] = [
  {
    label: "CRYPTO速递",
    value: "1",
  },
  {
    label: "KOL观点",
    value: "2",
  },
  {
    label: "我的监控",
    value: "3",
  },
];
interface KolMenuProps {
  onKolMenuChange: (menu: KolMenu) => void;
}
export function KolBanner({ onKolMenuChange }: KolMenuProps) {
  const [selectedMenu, setSelectedMenu] = useState<KolMenu>({
    label: "CRYPTO速递",
    value: "1",
  });
  return (
    <>
      <div className="flex border-b border-[#49494980] px-5 pt-5">
        <div className="grid grid-cols-6 gap-10">
          {kolMenu.map((menu) => (
            <div
              className={`${menu.value === selectedMenu.value ? "border-primary text-primary" : "border-transparent text-white"} cursor-pointer break-keep border-b-2 pb-[18px] text-center hover:text-primary`}
              key={menu.value}
              onClick={() => {
                onKolMenuChange(menu);
                setSelectedMenu(menu);
              }}
            >
              {menu.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
