"use client";

import { Howl } from "howler";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { FeaturedCard } from "@/app/signal-catcher/_components/featured-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { useMembership } from "@/hooks/use-membership";
import { getSignalsByPaginated } from "@/server/api/routes/signal";
import { type Projects, type Signals } from "@/server/db/schemas/signal";
import type { TweetInfo } from "@/server/db/schemas/tweet";
import { createClient } from "@/utils/supabase/client";
import { getUserProfile } from "@/server/api/routes/auth";
import { useSessionStorageState } from "@/components/SessionStorageWatcher";

interface SignalItems extends Signals {
  source: TweetInfo & {
    isAccurate: boolean;
    imagesUrls: string[];
    videoUrls: string[];
    exchange: {
      name: string;
      logo: string;
    };
    tweetUser: { name: string; avatar: string; tweetUrl: string };
    source: string;
    newsEntity: {
      logo: string;
    };
    mediaUrls: {
      images?: string[];
      videos?: string[];
    };
  };
  project: Projects;
  times: string;
  hitKOLs: {
    avatar: string;
    id: string;
    name: string;
  }[];
}

export default function RealtimeSignal() {
  // useEffect(() => {
  //   if (getSignalListAction) {
  //     getSignalListAction(1, {
  //       categoryId: "83d28d2b-25b4-42e7-9335-ba2affbb3c31",
  //     }).then((res) => {
  //       console.log(res);
  //       setSignals(res.data.items);
  //       setShowDialog(true);
  //     });
  //   }
  // }, [getSignalListAction]);
  const [signals, setSignals] = useState<SignalItems[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [sound, setSound] = useState<string>("/audios/coin.wav");
  const [notificationEnabled, setNotificationEnabled] =
    useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useLocalStorage<boolean>(
    "audioNotificationEnabled",
    false,
  );
  const [audio, setAudio] = useState<Howl | null>(null);
  const { isMember, isLoading, isExpired } = useMembership();
  const t = useTranslations("signals");
  const [, setNewSignal] = useSessionStorageState<string>("newSignal", "");
  // 处理音频授权
  const handleEnableAudio = () => {
    if (!audio && notificationEnabled) {
      const newAudio = new Howl({
        src: [sound],
        volume: 1,
        preload: true,
      });
      setAudio(newAudio);
      newAudio.stop();
      setAudioEnabled(true);
    }
  };

  useEffect(() => {
    // 请求通知权限
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    handleEnableAudio();

    const getUserSettings = async () => {
      const profile = await getUserProfile();
      setNotificationEnabled(profile?.enableNotification ?? false);
      setSound(profile?.notificationSound ?? "/audios/coin.wav");
    };
    getUserSettings();

    // 在客户端初始化音频
    if (typeof window !== "undefined" && audioEnabled && !audio) {
      const newAudio = new Howl({
        src: [sound],
        volume: 1,
        preload: true,
      });
      setAudio(newAudio);
    }
  }, [audioEnabled, audio, handleEnableAudio]);

  useEffect(() => {
    // 如果正在加载会员状态或者不是会员，则不订阅实时信号
    if (isLoading || !isMember || isExpired) {
      return;
    }
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-signal")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_signals" },
        (payload) => {
          console.log("payload", payload);
          handleNewSignal(payload);
        },
      )
      .subscribe();

    const handleNewSignal = async (payload: any) => {
      const newSignal = await getSignalsByPaginated({
        // @ts-ignore @ts-expect-error
        providerType: payload.new.provider_type,
        // @ts-ignore @ts-expect-error
        signalId: payload.new.id,
        // @ts-ignore @ts-expect-error
        categoryId: payload.new.category_id,
      });
      console.log("newSignal", newSignal);
      setSignals((prev) => [
        // @ts-ignore @ts-expect-error
        newSignal.data?.items?.[0] as SignalItems,
        ...prev,
      ]);

      if (newSignal?.data?.items) {
        setNewSignal(
          newSignal.data.items.map((item) => item.categoryId).join(","),
        );
        window.dispatchEvent(new Event("session-storage-update"));
      }

      setShowDialog(true); // 显示弹窗

      if (audioEnabled && audio) {
        audio.play();
      }

      if (Notification.permission === "granted") {
        new Notification("新消息通知", {
          body: "收到新的信号",
          icon: "/images/logo.svg",
          requireInteraction: true,
          silent: false,
        });
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoading, isMember, isExpired, audioEnabled, audio]);

  const handlePreviousSignal = () => {
    setSignals((prevSignals) => {
      const newSignals = [...prevSignals];
      newSignals.splice(0, 1);
      return newSignals;
    });
  };

  const currentSignal = signals[0];

  const handleViewDetails = () => {
    // 跳转到详情页面
    window.open(`/signals/${currentSignal?.id}`, "_blank");
    setShowDialog(false);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSignals([]); // Clear all signals
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger className="text-xs text-[#949C9E]"></DialogTrigger>
        <DialogContent className="w-[94%] bg-[#DEECFF] p-3 dark:bg-black md:w-[600px] md:p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 border-b pb-5 text-center font-normal">
              <div className="h-[18px] w-[18px] bg-[url(/images/signal/bell.svg)]"></div>
              {t("newSignalNotification")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid py-4">
            {currentSignal && (
              <FeaturedCard
                signal={currentSignal}
                tokenItemWidth="w-fit"
                showShare={false}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              {t("close")}
            </Button>
            {signals.length > 1 && (
              <Button
                onClick={handlePreviousSignal}
                disabled={signals.length <= 1}
              >
                {t("previous")} (1/{signals.length})
              </Button>
            )}
            {/*<Button onClick={handleViewDetails}>{t("viewDetails")}</Button>*/}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
