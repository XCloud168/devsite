"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale } from "@/i18n/config";
import { setUserLocale } from "@/server/locale";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";

export function LanguageSwitcher({
  type = "button",
}: {
  type?: "button" | "text";
}) {
  const locale = useLocale();

  const handleLocaleChange = (newLocale: Locale) => {
    setUserLocale(newLocale);
  };

  const languages = [
    { name: "English", value: "en" },
    { name: "中文", value: "zh-CN" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {type === "button" ? (
          <Button variant="ghost" size="icon">
            <Languages className="h-4 w-4" />
          </Button>
        ) : (
          <p className="h-7 text-lg font-medium leading-7 text-foreground/80">
            {locale === "en" ? "Language" : "语言"}
          </p>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => handleLocaleChange(language.value as Locale)}
            className={locale === language.value ? "bg-secondary" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
