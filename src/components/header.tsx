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
    { name: t("signal-catcher"), href: "/signal-catcher" },
    { name: t("swap"), href: "/swap" },
    { name: t("pricing"), href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-5">
        <div className="flex flex-1 items-center">
          {/* Logo */}
          <Link href="/" className="flex h-5 w-[130px] items-center space-x-2">
            <Image
              src="/images/logo-blue.svg"
              alt="Logo"
              width={130}
              height={20}
            />
          </Link>
          {/* Navigation */}
          <nav className="ml-10 flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${pathname === item.href ? "after:contents='' border-primary font-semibold text-black after:absolute after:-bottom-4 after:left-0 after:h-0.5 after:w-full after:bg-primary dark:text-primary" : "text-foreground/80"} relative font-medium transition-colors hover:text-foreground/80`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              className="ml-auto flex gap-1.5 hover:scale-105"
              href={"/pricing"}
            >
              <Image
                src="/images/diamond.svg"
                alt="Logo"
                width={22}
                height={22}
              />
              <p className="bg-gradient-to-r from-[#1F72E5] to-[#45FA25] bg-clip-text font-bold text-transparent dark:from-[#F2DA18] dark:to-[#4DFFC4]">
                {t("buySlogan")}
              </p>
            </Link>
            <AuthButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
