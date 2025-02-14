import { useTranslations } from "next-intl";

export default function RootPage() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
    </div>
  );
}
