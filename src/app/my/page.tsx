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
import { SubscribeButton } from "./_components/subscribe-button";
import Reward from "@/app/my/_components/reward";
import {
  bindUserEvmAddress,
  getMyInviteInfo,
  submitWithdrawalRequest,
} from "@/server/api/routes/profile";
import { getLatestWithdrawalStatus } from "@/server/api/routes/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { QRCode } from "@/components/qrcode";
import React from "react";
import { LicenseDialog } from "@/app/my/_components/license-dialog";
import {
  downloadLicense,
  generateLicense,
  getLicenseRecordsByEmail,
} from "@/server/api/routes/license";

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

  const isMember =
    user.membershipExpiredAt && new Date(user.membershipExpiredAt) > new Date();
  const isExpired =
    user.membershipExpiredAt && new Date(user.membershipExpiredAt) < new Date();

  const bindAddress = async (address: string) => {
    "use server";
    return await bindUserEvmAddress(address);
  };
  const submitWithdrawal = async (amount: number) => {
    "use server";
    return await submitWithdrawalRequest(amount);
  };
  const { data: inviteInfo } = await getMyInviteInfo();
  const getStatus = async () => {
    "use server";
    return await getLatestWithdrawalStatus();
  };
  const getLicenseRecord = async (email: string) => {
    "use server";
    return await getLicenseRecordsByEmail(email);
  };
  const generateUserLicense = async (email: string) => {
    "use server";
    return await generateLicense({ customer_email: email });
  };
  const download = async (email: string) => {
    "use server";
    return await downloadLicense(email);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <div className="mb-8 flex w-full flex-wrap gap-5 md:flex-nowrap">
        {/* Membership Status Card */}
        <div className="flex w-full flex-col gap-5 md:max-w-[320px]">
          <Card>
            <CardHeader>
              <CardTitle>{t("membershipStatus.title")}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  {isMember ? (
                    <>
                      <span className="text-5xl font-bold">
                        {t("membershipStatus.active")}
                      </span>
                      <p className="mt-2 text-muted-foreground">
                        {t.rich("membershipStatus.expiresOn", {
                          date: new Date(
                            user.membershipExpiredAt ?? 0,
                          ).toLocaleDateString(),
                        })}
                      </p>
                      <LicenseDialog
                        getLicenseRecordAction={getLicenseRecord}
                        generateUserLicenseAction={generateUserLicense}
                        email={user.email}
                        downloadAction={download}
                        membershipExpiredAt={user.membershipExpiredAt}
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-red-500">
                        {t("membershipStatus.inactive")}
                      </span>
                      <p className="mt-2 text-muted-foreground">
                        {t("membershipStatus.promptToSubscribe")}
                      </p>
                      <SubscribeButton />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Invitation Code Card */}
          <InviteCode
            inviteCode={user.inviteCode || ""}
            totalInvites={pagination.totalCount}
          />
        </div>
        {/* Invitation Records Card */}
        <div className="h-full w-full">
          <Reward
            evmAddress={user.evmAddress}
            bindAddressAction={bindAddress}
            total={user.total}
            balance={user.balance}
            submitWithdrawalAction={submitWithdrawal}
            rewardPoints={user.rewardPoints}
            inviteInfo={{
              commissionRate: inviteInfo?.commissionRate ?? "-",
              invitedUserCount: inviteInfo?.invitedUserCount ?? 0,
              paidUserCount: inviteInfo?.paidUserCount ?? 0,
            }}
            getStatusAction={getStatus}
          />
          <InviteRecords
            records={records}
            pagination={pagination}
            fetchRecords={fetchInviteRecords}
          />
        </div>
      </div>
    </div>
  );
}
