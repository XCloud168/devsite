import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { ProfileForm } from "./_components/profile-form";

export default function SettingsProfilePage() {
  const t = useTranslations("profile.sections.profile");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
