"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmailLogin } from "./email-login";
import { SocialLogin } from "./social-login";

export function LoginContainer({ inviteCode }: { inviteCode?: string }) {
  const t = useTranslations("auth");
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const callbackUrl = useMemo(() => {
    if (inviteCode) {
      return `/auth/callback?invite_code=${inviteCode}`;
    }
    return "/auth/callback";
  }, [inviteCode]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <Link href="/" className="mx-auto mb-4 inline-block">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={48}
              height={48}
              className="mx-auto h-12 w-12"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("welcomeBack")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("signInToContinue")}</p>
        </div>

        {isEmailLogin ? (
          <EmailLogin
            onBack={() => setIsEmailLogin(false)}
            callbackUrl={callbackUrl}
          />
        ) : (
          <SocialLogin
            onEmailLogin={() => setIsEmailLogin(true)}
            callbackUrl={callbackUrl}
          />
        )}

        {/* Terms */}
        <p className="text-center text-sm text-muted-foreground">
          {t("bySigningIn")}{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            {t("terms")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            {t("privacy")}
          </Link>
        </p>
      </div>
    </div>
  );
}
