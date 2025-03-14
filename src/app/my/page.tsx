import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchInviteRecords } from "@/server/actions/invite";
import { getUserProfile } from "@/server/api/routes/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { InviteCode } from "./_components/invite-code";
import { InviteRecords } from "./_components/invite-records";

export default async function PersonalCenter({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const t = await getTranslations("my");
  const [user, { page }] = await Promise.all([getUserProfile(), searchParams]);

  if (!user) {
    redirect("/auth/login");
  }

  const { records, pagination } = await fetchInviteRecords(Number(page || 1));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        {/* Invitation Code Card */}
        <InviteCode inviteCode={user.inviteCode || ""} />

        {/* Invitation Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("inviteStats.title")}</CardTitle>
            <CardDescription>{t("inviteStats.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <span className="text-5xl font-bold">
                  {pagination.totalCount}
                </span>
                <p className="mt-2 text-muted-foreground">
                  {t("inviteStats.totalInvites")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invitation Records Card */}
      <InviteRecords
        records={records}
        pagination={pagination}
        fetchRecords={fetchInviteRecords}
      />
    </div>
  );
}
