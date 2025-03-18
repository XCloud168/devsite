"use client";

import { useEffect, useState } from "react";
import { Howl } from "howler";
import { useTranslations } from "next-intl";

import { useLocalStorage } from "@/hooks/use-localstorage";
import { type Signals } from "@/server/db/schemas/signal";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSignalsByPaginated } from "@/server/api/routes/signal";

export default function RealtimeSignal() {
  const [signals, setSignals] = useState<Signals[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [audioEnabled, setAudioEnabled] = useLocalStorage<boolean>(
    "audioNotificationEnabled",
    false,
  );
  const [audio, setAudio] = useState<Howl | null>(null);
  const t = useTranslations("signals");

  // 处理音频授权
  const handleEnableAudio = () => {
    if (!audio) {
      const newAudio = new Howl({
        src: ["/audios/coin.wav"],
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

    // 在客户端初始化音频
    if (typeof window !== "undefined" && audioEnabled && !audio) {
      const newAudio = new Howl({
        src: ["/audios/coin.wav"],
        volume: 1,
        preload: true,
      });
      setAudio(newAudio);
    }
  }, [audioEnabled, audio]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-signal")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_signals" },
        async (payload) => {
          console.log("payload", payload);
          const newSignal = await getSignalsByPaginated(1, {
            // @ts-ignore
            providerType: payload.new.provider_type,
            // @ts-ignore
            signalId: payload.new.id,
          });
          console.log("newSignal", newSignal);
          setSignals((prev) => [
            newSignal.data?.items?.[0] as Signals,
            ...prev,
          ]);
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
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [audioEnabled, audio]);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newSignalNotification")}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {currentSignal && (
              <div>
                <p>信号ID: {currentSignal.id}</p>
                <p>信号内容: {currentSignal.notifyContent}</p>
              </div>
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
            <Button onClick={handleViewDetails}>{t("viewDetails")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
