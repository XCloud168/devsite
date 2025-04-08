import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { env } from "@/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
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
    metadataBase: env.NEXTAUTH_URL,
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: env.NEXTAUTH_URL,
      siteName: t("title"),
      images: [
        {
          url: env.NEXTAUTH_URL + "/images/userCenter/sharePosterBg.png",
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
      url: env.NEXTAUTH_URL,
      siteName: t("title"),
      images: [
        {
          url: env.NEXTAUTH_URL + "/images/userCenter/sharePosterBg.png",
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
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProvider>
              <div className="relative flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
                <Toaster richColors position="bottom-right" />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
