"use client";

import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { SecurityForm } from "../_components/security-form";

export default function SettingsSecurityPage() {
  const t = useTranslations("profile.sections.security");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Separator />
      <SecurityForm />
    </div>
  );
}
