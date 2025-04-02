import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { type ReactNode, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { QRCode } from "@/components/qrcode";
import { Share2 } from "lucide-react";
export default function SharePoster({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const captureRef = useRef<HTMLDivElement>(null);
  const handleSaveImage = async () => {
    try {
      if (!captureRef.current) return;
      const imgData = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: false,
      });
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `screenshot-share.png`;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const shareToX = useCallback(() => {
    let url: string;
    if (locale === "zh") {
      url = `https://x.com/share?text=${encodeURIComponent("邀请好友一起加入，解锁更多投资机会！精准信号，分钟级推送，胜率回测，助您信号获取快人一步！")}&url=${window.location.href}`;
    } else {
      url = `https://x.com/share?text=${encodeURIComponent("Invite friends and unlock more investment opportunities!Precision signals, real-time alerts, and win-rate backtesting to keep you ahead!")}&url=${window.location.href}`;
    }
    window.open(url);
  }, [locale]);

  return (
    <Dialog>
      <DialogTrigger className="w-full text-xs text-[#949C9E]">
        <Button className="flex w-full items-center gap-2">
          <Share2 size={16} />
          {t("my.inviteCode.share.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] bg-black">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="scroll relative flex max-h-[720px] flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
          <div
            className="relative mx-auto w-full max-w-sm overflow-hidden bg-black p-4"
            ref={captureRef}
          >
            <div className="absolute left-0 top-0 h-[200px] w-full scale-105 bg-[url(/images/poster-bg.svg)] bg-contain"></div>
            <Image
              src="/images/logo-blue.svg"
              alt="Logo"
              width={130}
              height={20}
            />
            {children}
            <div className="mt-4 flex items-center justify-between border-t px-4 pt-4">
              <div className="space-y-1">
                <p className="text-xs text-white/80">
                  {t("signals.share.title")}
                </p>
                <p>{t("signals.share.content")}</p>
              </div>
              <QRCode text={window.location.href} width={80} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-12 -left-1 flex w-full justify-center gap-4">
          <Button variant="outline" onClick={() => shareToX()}>
            {t("signals.shareToX")}
          </Button>
          <Button variant="default" onClick={() => handleSaveImage()}>
            {t("common.saveImage")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
