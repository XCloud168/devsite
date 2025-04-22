"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
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
import { AuthButton } from "@/components/auth-button";

export function MobileSideBar() {
  const t = useTranslations();
  const siteName = useTranslations("metadata").raw("siteName");
  const pathname = usePathname();
  const navigation = [
    { name: t("navigation.signal-catcher"), href: "/signal-catcher" },
    // { name: t("swap"), href: "/swap" },
    { name: t("navigation.dashboard"), href: "/dashboard" },
    { name: t("navigation.pricing"), href: "/pricing" },
    { name: t("my.title"), href: "/my" },
  ];

  return (
    <div className="flex items-center justify-between p-3 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
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
            <div className="mt-3">
              <LanguageSwitcher type="text" />
            </div>
            <div className="mt-auto">
              <AuthButton />
            </div>
            <div className="mb-5 mt-3 flex gap-5 pl-2">
              <Link href="https://x.com/masbateofficial" target="_blank">
                <div className="h-7 w-7 bg-[url(/images/x_white.svg)] bg-contain"></div>
              </Link>
              <Link href="https://t.me/masbateofficial" target="_blank">
                <div className="h-7 w-7 bg-[url(/images/tel.svg)] bg-contain"></div>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="flex gap-1.5" href={"/pricing"}>
        <Image src="/images/diamond.svg" alt="Logo" width={22} height={22} />
        <p className="bg-gradient-to-r from-[#1F72E5] to-[#45FA25] bg-clip-text font-bold text-transparent dark:from-[#F2DA18] dark:to-[#4DFFC4]">
          {t("navigation.buySlogan")}
        </p>
      </Link>
    </div>
  );
}
