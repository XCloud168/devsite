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
import { Share2 } from "lucide-react";
export default function RankingSharePoster({
  children,
  scale,
}: {
  children: ReactNode;
  scale: number;
}) {
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
      url = `https://x.com/share?text=${encodeURIComponent("用 Masbate，更快发现高质量的 Web3 投资信号!")}&url=${window.location.href}`;
    } else {
      url = `https://x.com/share?text=${encodeURIComponent("Discover top Web3 signals faster with Masbate!")}&url=${window.location.href}`;
    }
    window.open(url);
  }, [locale]);

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Share2 size={20} className="text-[#949C9E]" />
      </DialogTrigger>
      <DialogContent
        className={`w-[600px] border-none bg-transparent scale-[${scale}%]`}
      >
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="scroll relative flex max-h-[720px] flex-col gap-4">
          <div
            className="relative mx-auto h-[338px] w-full bg-[url(/images/dashboard/poster-bg.png)] bg-contain bg-no-repeat px-8 py-4"
            ref={captureRef}
          >
            <Image
              src="/images/logo-blue.svg"
              alt="Logo"
              width={130}
              height={20}
            />
            {children}
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
