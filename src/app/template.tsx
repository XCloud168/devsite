"use client";

import { Header } from "@/components/header";
import { usePathname } from "next/navigation";
import { MobileSideBar } from "@/components/mobile-side-bar";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <Header />
      <MobileSideBar />
      {children}
    </>
  );
}
