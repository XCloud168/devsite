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
      <DialogContent className="w-[400px] border bg-white p-0 dark:bg-black">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div
            className="mx-auto w-full max-w-sm bg-black p-6"
            ref={captureRef}
          >
            <div className="absolute top-0 h-[200px] w-full bg-[url(/images/poster-bg.svg)] bg-contain"></div>
            {children}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <p className="text-lg font-bold text-white">Blockbate</p>
                </div>
                <p className="text-xs text-white/80">
                  Web3 Major Investment Signal Catcher!
                </p>
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
