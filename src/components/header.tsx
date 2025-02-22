"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Header() {
  const t = useTranslations("navigation");
  const siteName = useTranslations("metadata").raw("siteName");

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("blog"), href: "/blogs" },
    { name: t("projects"), href: "/projects" },
    { name: t("about"), href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">{siteName}</span>
          </Link>

          {/* Navigation */}
          <nav className="mx-6 flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <AuthButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
