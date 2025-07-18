"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import type { ServerResult } from "@/lib/server-result";
import { MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
interface Props {
  getLicenseRecordAction: (email: string) => Promise<[]>;
  generateUserLicenseAction: (email: string) => Promise<ServerResult>;
  email?: string;
  downloadAction: (email: string) => Promise<Blob>;
  membershipExpiredAt?: null | Date;
}
export function LicenseDialog({
  getLicenseRecordAction,
  generateUserLicenseAction,
  email,
  downloadAction,
  membershipExpiredAt,
}: Props) {
  const t = useTranslations("my.license");
  const [canDownload, setCanDownload] = useState(false);
  useEffect(() => {
    if (!email) return;
    getLicenseRecordAction(email).then((res) => {
      if (res.length === 0) {
        generateUserLicenseAction(email).then(() => {
          setCanDownload(true);
        });
      } else {
        setCanDownload(true);
      }
    });
  }, [email, generateUserLicenseAction, getLicenseRecordAction]);
  const handleDownload = async (email: string) => {
    const blob = await downloadAction(email);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "license.lic";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [inputEmail, setInputEmail] = useState("");
  return (
    <Dialog
      onOpenChange={(flag) => {
        if (!flag) setInputEmail("");
      }}
    >
      <DialogTrigger className="mt-3 rounded-lg bg-primary px-5 py-2 text-sm text-black">
        {t("automated")}
      </DialogTrigger>
      <DialogContent className="w-[94%] border-transparent bg-[#0B0D0E] p-5 md:w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-white">{t("automated")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-2">
          {!email ? <p className="text-xs">{t("bindEmail")}</p> : null}
          {!email ? (
            <div className="flex w-full gap-2">
              <Input
                placeholder="Email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              ></Input>
              <Button
                disabled={!emailRegex.test(inputEmail)}
                onClick={() => {
                  generateUserLicenseAction(inputEmail).then(() => {
                    setCanDownload(true);
                  });
                }}
              >
                {t("bind")}
              </Button>
            </div>
          ) : null}
          <p className="text-sm">{t("certificate")}</p>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-[url(/images/license.svg)] bg-contain"></div>
            <div className="space-y-1">
              <p className="font-semibold">License.lic</p>
              <p className="text-sm text-[#FF4B4BCC]">
                {t.rich("expiresOn", {
                  date: new Date(membershipExpiredAt ?? 0).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>

          <div className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#1E2128] p-2">
            <p className="text-xs">{t("deploy")}</p>
            <MoveRight size={14} />
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              className="px-8"
              disabled={!canDownload || btnLoading}
              onClick={() => {
                setBtnLoading(true);
                if (email)
                  handleDownload(email).then(() => {
                    setTimeout(() => setBtnLoading(false), 1000);
                  });
              }}
            >
              {t("download")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
