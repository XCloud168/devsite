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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<KolMenu>({
    label: "kol",
    value: "2",
  });
  const kolMenu: KolMenu[] = useMemo(() => {
    const baseMenu: KolMenu[] = [
      { label: "kol", value: "2" },
      { label: "myKol", value: "3" },
    ];

    return isMobile
      ? [{ label: "curatedSignals", value: "1" }, ...baseMenu]
      : baseMenu;
  }, [isMobile]);
  const [tweetUserName, setTweetUserName] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [tweetUser, setTweetUser] = useState<UserInfo | null>(null);
  const handleSearch = async (name: string) => {
    const response = await searchTweetUserAction(name);
    setSearchLoading(false);
    setTweetUser(response.data);
  };
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const SearchDialog = (triggerClass: string) => {
    return (
      <Dialog
        open={dialogOpen}
        onOpenChange={(f) => {
          setDialogOpen(f);
          setTweetUserName("");
          setTweetUser(null);
        }}
      >
        <DialogTrigger className={triggerClass}>
          <div className="ml-auto flex h-9 cursor-pointer items-center gap-2 rounded-full bg-secondary pl-2 pr-12">
            <Search size="20px" />
            <p className="text-xs text-black/80 dark:text-white/80">
              {t("signals.kol.searchTweeter")}
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[94%] gap-0 p-4 md:w-[560px]">
          <DialogHeader className="border-b pb-3">
            <DialogTitle>{t("signals.kol.searchTweeter")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div
            className={`flex items-center justify-between gap-2 pt-5 ${tweetUser ? "pb-4" : ""}`}
          >
            <div className="flex w-full items-center rounded-md border pl-2">
              <Search className="h-5 w-5 min-w-5 opacity-75" />
              <Input
                className="border-transparent focus-visible:ring-transparent"
                placeholder={`${t("signals.kol.enterTweeter")}`}
                value={tweetUserName}
                onChange={(event) => setTweetUserName(event.target.value)}
              ></Input>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchLoading(true);
                handleSearch(tweetUserName);
              }}
              disabled={searchLoading || tweetUserName.trim() === ""}
            >
              {t("common.search")}
            </Button>
          </div>

          <div>
            {searchLoading ? (
              <div className="flex items-center justify-center py-5">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              tweetUser && (
                <div className="flex w-full items-center justify-between gap-2 py-4">
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
                    className="ml-auto"
                    onClick={() => {
                      if (isMember) {
                        addFollowAction(tweetUser.id).then(() => {
                          toast.success(t("common.success"));
                          setDialogOpen(false);
                        });
                      } else {
                        toast.info(t("signals.kol.notVip"));
                      }
                    }}
                  >
                    {t("signals.kol.follow")}
                  </Button>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  const menu = () => {
    return kolMenu.map((menu) => (
      <div
        className={`${menu.value === selectedMenu.value ? "border-primary font-bold text-primary" : "border-transparent font-normal text-black dark:text-foreground/80"} cursor-pointer break-keep border-b-2 pb-2 pt-2 text-center hover:text-primary md:pb-0`}
        key={menu.value}
        onClick={() => {
          if (!isMember && menu.value === "3") {
            router.push("/auth/login");
            return;
          }
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
        <div className="sticky top-0 z-10 block border-b bg-background px-5 pt-2">
          {SearchDialog("mb-3 w-full")}
          <div>
            <div className="flex w-full gap-5">{menu()}</div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="sticky top-0 z-10 flex border-b bg-background px-5 pt-2">
        <div className="flex w-full gap-10">
          {menu()}
          {SearchDialog("ml-auto pb-2")}
        </div>
      </div>
    </>
  );
}
