"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EmailLoginFormData {
  email: string;
  token: string;
}

interface EmailLoginProps {
  onBack: () => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function EmailLogin({ onBack }: EmailLoginProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<EmailLoginFormData>();

  const email = watch("email");
  const token = watch("token");
  const isEmailValid = EMAIL_REGEX.test(email || "");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!email || !isEmailValid) return;

    setIsSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            name: email,
            avatar_url: `https://ui-avatars.com/api/?name=${email.split("@")[0]}`,
          },
        },
      });

      if (error) {
        toast.error(t("otpError"));
        return;
      }

      setCountdown(60); // Start 60s countdown
      toast.success(t("otpSent"));
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(t("otpError"));
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async (data: EmailLoginFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.token,
        type: "email",
      });

      if (error) {
        toast.error(t("invalidOTP"));
        return;
      }
      router.replace("/auth/callback");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(t("signInError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder={t("email")}
          {...register("email", {
            required: true,
            pattern: {
              value: EMAIL_REGEX,
              message: t("invalidEmail"),
            },
          })}
          aria-invalid={errors.email ? "true" : "false"}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        {errors.email?.message && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={t("enterOTP")}
            {...register("token", { required: true })}
            aria-invalid={errors.token ? "true" : "false"}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="outline"
            className="min-w-[100px] whitespace-nowrap transition-all duration-200 hover:bg-primary/5"
            onClick={handleSendOTP}
            disabled={!isEmailValid || countdown > 0 || isSending}
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              `${t("resendOTP")} (${countdown}s)`
            ) : (
              t("sendOTP")
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          type="submit"
          className="h-12 w-full transition-all duration-200 hover:opacity-90"
          disabled={isSubmitting || !isEmailValid || !token}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("verifyingOTP")}
            </>
          ) : (
            t("verifyOTP")
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-12 w-full transition-all duration-200 hover:bg-primary/5"
          onClick={onBack}
        >
          {t("backToOptions")}
        </Button>
      </div>
    </form>
  );
}
