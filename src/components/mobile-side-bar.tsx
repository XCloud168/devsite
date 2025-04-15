"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileSideBar() {
  const t = useTranslations("navigation");
  const siteName = useTranslations("metadata").raw("siteName");
  const pathname = usePathname();
  const navigation = [
    { name: t("signal-catcher"), href: "/signal-catcher" },
    // { name: t("swap"), href: "/swap" },
    { name: t("pricing"), href: "/pricing" },
  ];

  return (
    <div className="flex items-center justify-between px-4 pt-3 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex !h-full flex-col">
            {/* Logo */}
            <Link
              href="/"
              className="flex h-5 w-[130px] items-center space-x-2"
            >
              <Image
                src="/images/logo-blue.svg"
                alt="Logo"
                width={130}
                height={20}
              />
            </Link>

            <nav className="mt-5 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${pathname === item.href ? "font-semibold text-primary dark:text-primary" : "text-foreground/80"} text-lg font-medium transition-colors hover:text-foreground/80`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex gap-1">
              <AuthButton />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="ml-auto flex gap-1.5 hover:scale-105" href={"/pricing"}>
        <Image src="/images/diamond.svg" alt="Logo" width={22} height={22} />
        <p className="bg-gradient-to-r from-[#1F72E5] to-[#45FA25] bg-clip-text font-bold text-transparent dark:from-[#F2DA18] dark:to-[#4DFFC4]">
          {t("buySlogan")}
        </p>
      </Link>
    </div>
  );
}
