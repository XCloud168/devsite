"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "首页", href: "/" },
  { name: "博客", href: "/blog" },
  { name: "项目", href: "/projects" },
  { name: "关于", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">MyBlog</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6 mx-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
