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
export default function Poster({ children }: { children: ReactNode }) {
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
      <DialogTrigger className="text-xs text-[#949C9E]">
        {t("common.share")}
      </DialogTrigger>
      <DialogContent className="w-[98%] bg-black md:w-[400px]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="scroll relative flex max-h-[600px] flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
          <div className="relative w-full bg-black" ref={captureRef}>
            <div className="absolute left-0 top-0 h-[200px] w-full scale-105 bg-[url(/images/poster-bg.svg)] bg-contain"></div>
            <div className="p-6">{children}</div>
            <div className="flex items-center justify-between border-t px-6 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/logo-blue.svg"
                    alt="Logo"
                    width={130}
                    height={20}
                  />
                </div>
                <p className="text-xs text-white/80">
                  Web3 Major Investment Signal Catcher!
                </p>
              </div>
              <QRCode text={window.location.href} width={60} />
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
