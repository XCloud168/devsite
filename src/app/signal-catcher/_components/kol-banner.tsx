"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
        <div className="flex w-full gap-10">
          {kolMenu.map((menu) => (
            <div
              className={`${menu.value === selectedMenu.value ? "border-primary font-bold text-primary" : "border-transparent font-normal text-black dark:text-foreground/80"} cursor-pointer break-keep border-b-2 text-center hover:text-primary`}
              key={menu.value}
              onClick={() => {
                onKolMenuChangeAction(menu);
                setSelectedMenu(menu);
              }}
            >
              {t("signals.kol." + menu.label)}
            </div>
          ))}

          <Dialog>
            <DialogTrigger className="ml-auto pb-2">
              <div className="ml-auto flex h-9 cursor-pointer items-center gap-2 rounded-full bg-[#17191C] pl-2 pr-4">
                <Search />
                <p className="text-xs text-white/80">
                  搜索推特名称、推特账号或合约地址
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[400px] gap-0 bg-black">
              <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex items-center px-2">
                <Search className="h-5 w-5 min-w-5" />
                <Input
                  className="border-transparent focus-visible:ring-transparent"
                  placeholder="搜索推特名称、推特账号或合约地址"
                ></Input>
              </div>

              <div className="border-t">
                <div className="p-4">搜索结果</div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
