import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { NotificationsForm } from "../_components/notifications-form";

export default function SettingsNotificationsPage() {
  const t = useTranslations("profile.sections.notifications");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
