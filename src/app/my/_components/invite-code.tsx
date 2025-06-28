"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { toPng } from "html-to-image";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SharePoster from "@/components/poster/share-poster";
import Image from "next/image";
interface InviteCodeProps {
  inviteCode: string;
  totalInvites: number;
}

export function InviteCode({ inviteCode, totalInvites }: InviteCodeProps) {
  const t = useTranslations("my.inviteCode");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInviteLink(
      `${window.location.origin}/auth/login?invite_code=${inviteCode}`,
    );
  }, [inviteCode]);

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);

    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      setIsGenerating(true);
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `invite-${inviteCode}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(t("share.download.success"));
    } catch (error) {
      console.error("Failed to generate poster:", error);
      toast.error(t("share.download.error"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">{t("code.label")}</div>
          <div className="flex items-center gap-2">
            <Input
              value={inviteCode}
              readOnly
              className="w-48 overflow-hidden text-sm font-medium md:w-full"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(inviteCode, "code")}
              className="flex items-center gap-2"
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {t("code.copy")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">{t("link.label")}</div>
          <div className="flex items-center gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="w-48 overflow-hidden truncate text-sm md:w-full"
              title={inviteLink}
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(inviteLink, "link")}
              className="flex items-center gap-2"
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              {t("link.copy")}
            </Button>
          </div>
        </div>
        <div>
          <div className="mt-6 space-y-2">
            <p className="font-medium">{t("apply")}</p>
            <p className="text-sm text-white">masbate1688@gmail.com</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="block">
        <SharePoster>
          <div>
            <div className="mt-10 flex w-full items-center justify-center">
              <Image
                width={284}
                height={284}
                src="/images/userCenter/sharePosterBg.svg"
                alt="poster"
              ></Image>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 pb-10">
              <p className="mb-1 text-sm text-muted-foreground">
                {t("share.poster.codeLabel")}
              </p>
              <div className="w-fit rounded-lg bg-muted px-4 py-2 text-2xl font-bold tracking-wider">
                {inviteCode}
              </div>
            </div>
          </div>
        </SharePoster>

        {/*<Dialog>*/}
        {/*  <DialogTrigger asChild>*/}
        {/*    <Button className="flex w-full items-center gap-2">*/}
        {/*      <Share2 size={16} />*/}
        {/*      {t("share.button")}*/}
        {/*    </Button>*/}
        {/*  </DialogTrigger>*/}
        {/*  <DialogContent className="sm:max-w-md">*/}
        {/*    <DialogHeader className="hidden">*/}
        {/*      <DialogTitle>{t("share.title")}</DialogTitle>*/}
        {/*      <DialogDescription>{t("share.description")}</DialogDescription>*/}
        {/*    </DialogHeader>*/}
        {/*    <div className="flex flex-col items-center">*/}
        {/*      <div*/}
        {/*        ref={posterRef}*/}
        {/*        className="mx-auto w-full max-w-sm rounded-lg bg-gradient-to-b from-primary/20 to-primary/10 p-6"*/}
        {/*      >*/}
        {/*        <div className="overflow-hidden rounded-lg bg-white shadow-lg">*/}
        {/*          /!* Poster Header *!/*/}
        {/*          <div className="bg-primary p-4 text-center text-primary-foreground">*/}
        {/*            <h3 className="text-xl font-bold">*/}
        {/*              {t("share.poster.title")}*/}
        {/*            </h3>*/}
        {/*            <p className="text-sm opacity-90">*/}
        {/*              {t("share.poster.subtitle")}*/}
        {/*            </p>*/}
        {/*          </div>*/}

        {/*          /!* Poster Content *!/*/}
        {/*          <div className="flex flex-col items-center gap-4 p-6">*/}
        {/*            /!* QR Code *!/*/}
        {/*            <div className="flex h-40 w-40 items-center justify-center">*/}
        {/*              <QRCode*/}
        {/*                text={inviteLink}*/}
        {/*                width={160}*/}
        {/*                darkColor="#000000"*/}
        {/*                lightColor="#FFFFFF"*/}
        {/*              />*/}
        {/*            </div>*/}

        {/*            /!* Invitation Code *!/*/}
        {/*            <div className="text-center">*/}
        {/*              <p className="mb-1 text-sm text-muted-foreground">*/}
        {/*                {t("share.poster.codeLabel")}*/}
        {/*              </p>*/}
        {/*              <div className="rounded-md bg-muted px-4 py-2 text-2xl font-bold tracking-wider">*/}
        {/*                {inviteCode}*/}
        {/*              </div>*/}
        {/*            </div>*/}

        {/*            /!* Instructions *!/*/}
        {/*            <p className="mt-2 text-center text-sm text-muted-foreground">*/}
        {/*              {t("share.poster.instructions", {*/}
        {/*                host:*/}
        {/*                  typeof window !== "undefined"*/}
        {/*                    ? window.location.host*/}
        {/*                    : "",*/}
        {/*              })}*/}
        {/*            </p>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}

        {/*      <Button*/}
        {/*        onClick={downloadPoster}*/}
        {/*        className="mt-4 flex items-center gap-2"*/}
        {/*        disabled={isGenerating}*/}
        {/*      >*/}
        {/*        {isGenerating ? (*/}
        {/*          <>*/}
        {/*            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />*/}
        {/*            {t("share.download.generating")}*/}
        {/*          </>*/}
        {/*        ) : (*/}
        {/*          <>*/}
        {/*            <Download size={16} />*/}
        {/*            {t("share.download.button")}*/}
        {/*          </>*/}
        {/*        )}*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  </DialogContent>*/}
        {/*</Dialog>*/}
      </CardFooter>
    </Card>
  );
}
