"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServerResult } from "@/lib/server-result";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/components/formatNumber";
import { toast } from "sonner";

export type KolMenu = {
  label: string;
  value: "1" | "2" | "3";
};

interface KolMenuProps {
  onKolMenuChangeAction: (menu: KolMenu) => void;
  isMobile?: boolean;
  searchTweetUserAction: (name: string) => Promise<ServerResult>;
  addFollowAction: (tweetUid: string) => Promise<ServerResult>;
  isMember?: boolean | null;
}

type UserInfo = {
  avatar: string;
  screenName: string;
  name: string;
  followersCount: number;
  id: string;
};
export function KolBanner({
  onKolMenuChangeAction,
  isMobile,
  searchTweetUserAction,
  addFollowAction,
  isMember,
}: KolMenuProps) {
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
  const [tweetUserName, setTweetUserName] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [tweetUser, setTweetUser] = useState<UserInfo | null>(null);
  const handleSearch = async (name: string) => {
    const response = await searchTweetUserAction(name);
    setSearchLoading(false);
    setTweetUser(response.data);
  };
  const SearchDialog = (triggerClass: string) => {
    return (
      <Dialog
        onOpenChange={() => {
          setTweetUserName("");
          setTweetUser(null);
        }}
      >
        <DialogTrigger className={triggerClass}>
          <div className="ml-auto flex h-9 cursor-pointer items-center gap-2 rounded-full bg-[#17191C] pl-2 pr-4">
            <Search />
            <p className="text-xs text-white/80">搜索推特账号</p>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[400px] gap-0 bg-black">
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-2">
            <Search className="h-5 w-5 min-w-5" />
            <Input
              className="border-transparent focus-visible:ring-transparent"
              placeholder="请输入搜索推特账号"
              value={tweetUserName}
              onChange={(event) => setTweetUserName(event.target.value)}
            ></Input>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchLoading(true);
                handleSearch(tweetUserName);
              }}
              disabled={searchLoading || tweetUserName.trim() === ""}
            >
              搜索
            </Button>
          </div>

          <div className="border-t">
            {searchLoading ? (
              <div className="flex items-center justify-center py-5">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : tweetUser ? (
              <div className="flex items-center gap-2 p-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tweetUser?.avatar || ""} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <p className="">{tweetUser?.name}</p>
                <p className="text-xs">@{tweetUser?.screenName}</p>
                <p className="text-xs">
                  {formatNumber(tweetUser?.followersCount)} followers
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    addFollowAction(tweetUser.id).then(() => {
                      toast.success("添加成功");
                    });
                  }}
                >
                  监控
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-5">
                <p>暂无数据</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  const menu = () => {
    return kolMenu.map((menu) => (
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
    ));
  };
  if (isMobile) {
    return (
      <>
        <div className="sticky top-0 z-10 block border-b bg-background px-5 pt-5">
          {isMember && SearchDialog("mb-3 w-full")}
          <div>
            <div className="flex w-full gap-10">{menu()}</div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="sticky top-0 z-10 flex border-b bg-background px-5 pt-5">
        <div className="flex w-full gap-10">
          {menu()}
          {isMember && SearchDialog("ml-auto pb-2")}
        </div>
      </div>
    </>
  );
}
