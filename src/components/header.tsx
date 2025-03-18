"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";
import { usePathname } from "next/navigation";

export function Header() {
  const t = useTranslations("navigation");
  const siteName = useTranslations("metadata").raw("siteName");
  const pathname = usePathname();
  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("signal-catcher"), href: "/signal-catcher" },
    { name: t("swap"), href: "/swap" },
    { name: t("pricing"), href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-5">
        <div className="flex flex-1 items-center">
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
          <nav className="ml-10 flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${pathname === item.href ? "text-white" : "text-foreground/60"} text-sm font-medium transition-colors hover:text-foreground/80`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <AuthButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
