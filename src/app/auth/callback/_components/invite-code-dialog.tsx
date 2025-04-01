"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface InviteCodeDialogProps {
  open: boolean;
  onSubmit: (inviteCode: string) => void;
}

export function InviteCodeDialog({ open, onSubmit }: InviteCodeDialogProps) {
  const t = useTranslations();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(inviteCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSubmit("");
  };

  return (
    <Dialog open={open} onOpenChange={() => handleSkip()} modal>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-[400px] p-5"
      >
        <DialogHeader>
          <DialogTitle>{t("auth.enterInviteCode")}</DialogTitle>
          <DialogDescription>
            {t("auth.inviteCodeDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder={t("auth.inviteCodePlaceholder")}
            />
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button type="submit" disabled={!inviteCode.trim() || isLoading}>
              {isLoading ? t("common.loading") : t("auth.continue")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
            >
              {t("auth.skipInviteCode")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
