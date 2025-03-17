"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function SubscribeButton() {
  const router = useRouter();
  const t = useTranslations("my");

  return (
    <Button
      className="mt-4 flex w-full items-center gap-2"
      onClick={() => router.push("/pricing")}
    >
      {t("membershipStatus.subscribeButton")}
    </Button>
  );
}
