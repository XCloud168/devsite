import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import RealtimeSignal from "@/components/signals/realtime-signal";
import React from "react";
import { UAParser } from "ua-parser-js";
import { Web3Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props) {
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "http";
  const pathname = params.slug ? `/${params.slug.join("/")}` : "";
  const currentUrl = `${proto}://${host}${pathname}`;

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    applicationName: t("title"),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t("title"),
    },
    manifest: "/manifest.json",
    icons: [
      { rel: "apple-touch-icon", url: "/icons/android-chrome-192x192.png" },
      { rel: "icon", url: "/icons/android-chrome-192x192.png" },
    ],
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`${proto}://${host}`),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: currentUrl,
      siteName: t("title"),
      type: "website",
      images: [
        {
          url: `${proto}://${host}/images/share/shareImg.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      // @ts-ignore
      url: currentUrl,
      site: t("title"),
      images: [
        {
          url: `${proto}://${host}/images/share/shareImg.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const { device } = UAParser(userAgent);
  // 判断是否是移动设备
  const isMobile = device.type === "mobile" || device.type === "tablet";
  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Web3Providers>
              <QueryProvider>
                <div className="relative flex min-h-screen flex-col">
                  <main className="flex-1">{children}</main>
                  <Toaster richColors position="bottom-right" />
                  {!isMobile && <RealtimeSignal />}
                </div>
              </QueryProvider>
            </Web3Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
