import { cookies } from "next/headers";
import { CallbackHandler } from "./_components/callback-handler";

interface SearchParams {
  redirect_to?: string;
  invite_code?: string;
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const cookieStore = await cookies();
  const cookieInviteCode = cookieStore.get("invite_code")?.value;

  // Destructure and await searchParams
  const { redirect_to, invite_code } = await searchParams;

  return (
    <CallbackHandler
      defaultInviteCode={invite_code || cookieInviteCode}
      redirectTo={redirect_to}
    />
  );
}
