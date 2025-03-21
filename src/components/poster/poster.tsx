import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { ReactNode, useRef } from "react";
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";

export default function Poster({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const captureRef = useRef<HTMLDivElement>(null);
  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    const imgData = await toPng(captureRef.current, {
      quality: 1,
      pixelRatio: 2,
      cacheBust: true,
    });
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `screenshot-share.png`;
    link.click();
  };
  return (
    <Dialog>
      <DialogTrigger className="text-xs text-[#949C9E]">
        {t("common.share")}
      </DialogTrigger>
      <DialogContent className="w-[375px] border bg-white p-0 dark:bg-black">
        <div className="absolute top-0 h-[200px] w-full bg-[url(/images/poster-bg.svg)] bg-contain"></div>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-4" ref={captureRef}>
          {children}
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
