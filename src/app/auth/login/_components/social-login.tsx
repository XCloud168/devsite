"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";

interface SocialLoginProps {
  onEmailLogin: () => void;
  callbackUrl: string;
}

export function SocialLogin({ onEmailLogin, callbackUrl }: SocialLoginProps) {
  const t = useTranslations("auth");

  const handleSignIn = async (provider: "google" | "twitter") => {
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${callbackUrl}`,
        },
      });

      if (error) {
        toast.error(t("signInError"));
        return;
      }

      // Redirect to the OAuth provider's login page
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(t("signInError"));
    }
  };

  return (
    <>
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-12 w-full border-2 bg-background hover:bg-muted/50"
          onClick={() => handleSignIn("google")}
        >
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/google.svg"
              alt="Google"
              width={24}
              height={24}
              priority
            />
            <span>{t("signInWithGoogle")}</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-12 w-full border-2 bg-background hover:bg-muted/50"
          onClick={() => handleSignIn("twitter")}
        >
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/x.svg"
              alt="X"
              width={24}
              height={24}
              priority
            />
            <span>{t("signInWithX")}</span>
          </div>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>

      {/* Email Login Button */}
      <div className="space-y-4">
        <Button
          variant="default"
          className="h-12 w-full"
          onClick={onEmailLogin}
        >
          {t("signInWithEmail")}
        </Button>
      </div>
    </>
  );
}
