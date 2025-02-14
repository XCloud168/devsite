import { useTranslations } from "next-intl";

export default function RootPage() {
  const t = useTranslations("home");

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
    </div>
  );
}
