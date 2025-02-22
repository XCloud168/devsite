import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginContainer } from "./_components/login-container";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <LoginContainer />;
}
