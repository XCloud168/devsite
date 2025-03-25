import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { type ReactNode, useRef } from "react";
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { QRCode } from "@/components/qrcode";
import { Share2 } from "lucide-react";
export default function SharePoster({ children }: { children: ReactNode }) {
  const t = useTranslations();
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
            <div className="flex items-center gap-1">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={18}
                height={18}
                className="h-8 w-8"
              />
              <p className="text-lg font-bold text-white">Blockbate</p>
            </div>
            {children}
            <div className="mt-4 flex items-center justify-between border-t px-4 pt-4">
              <div className="space-y-1">
                <p className="text-xs text-white/80">加入Blockbate</p>
                <p>扫码加入赚钱快人一步</p>
              </div>
              <QRCode text={window.location.href} width={80} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-12 -left-1 flex w-full justify-center gap-4">
          <Button variant="outline">{t("signals.shareToX")}</Button>
          <Button variant="default" onClick={() => handleSaveImage()}>
            {t("common.saveImage")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
