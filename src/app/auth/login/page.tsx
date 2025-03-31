import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginContainer } from "./_components/login-container";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invite_code?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { invite_code } = await searchParams;

  return <LoginContainer inviteCode={invite_code} />;
}
