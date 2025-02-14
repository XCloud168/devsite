"use client";

import { checkUserHasInviter, updateInviter } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InviteCodeDialog } from "./invite-code-dialog";

interface CallbackHandlerProps {
  defaultInviteCode?: string;
  redirectTo?: string;
}

export function CallbackHandler({
  defaultInviteCode,
  redirectTo = "/",
}: CallbackHandlerProps) {
  const router = useRouter();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();

        // Exchange the code for a session if we have a hash
        if (window.location.hash) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(window.location.hash);

          if (exchangeError) {
            console.error("Failed to exchange code:", exchangeError);
            router.replace("/auth/login");
            return;
          }
        }

        // Get the session
        const {
          data: { user },
          error: sessionError,
        } = await supabase.auth.getUser();

        if (sessionError || !user) {
          console.error("No active session", sessionError);
          router.replace("/auth/login");
          return;
        }

        // Check if user needs to enter invite code
        const profile = await checkUserHasInviter(user.id);

        if (!profile) {
          router.replace("/auth/login");
          return;
        }

        if (profile.inviterId || profile.inviterSkipped) {
          router.replace(redirectTo);
          return;
        }

        if (defaultInviteCode) {
          const inviteResult = await updateInviter(defaultInviteCode);
          if (inviteResult.error) {
            toast.error(
              t(
                inviteResult.error === "Invalid invite code"
                  ? "invalidInviteCode"
                  : "inviteCodeError",
              ),
            );
            setShowInviteDialog(true);
            return;
          }
          router.replace(redirectTo);
          return;
        }

        setShowInviteDialog(true);
      } catch (error) {
        console.error("Callback error:", error);
        router.replace("/auth/login");
      }
    };

    handleCallback();
  }, [router, t, defaultInviteCode, redirectTo]);

  const handleInviteSubmit = async (inviteCode: string) => {
    const result = await updateInviter(inviteCode);

    if (result.error) {
      console.error(result.error);
      toast.error(
        t(
          result.error === "Invalid invite code"
            ? "invalidInviteCode"
            : "inviteCodeError",
        ),
      );
      return;
    }

    router.replace(redirectTo);
  };

  if (showInviteDialog) {
    return (
      <InviteCodeDialog open={showInviteDialog} onSubmit={handleInviteSubmit} />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-primary/20" />
        <p className="absolute text-sm font-medium text-primary">
          {commonT("loading")}
        </p>
      </div>
    </div>
  );
}
