import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("Error");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <h1 className="animate-pulse text-9xl font-bold tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-medium text-muted-foreground">
          {t("pageNotFound")}
        </h2>
        <p className="max-w-[500px] text-muted-foreground">
          {t("pageNotFoundDesc")}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
