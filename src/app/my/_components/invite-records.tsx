"use client";

import {
  PaginationButtons,
  type PaginationInfo,
} from "@/components/pagination-buttons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

interface InviteRecord {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  inviterId: string | null;
  inviteCode: string | null;
  membershipExpiredAt: Date | null;
}

interface InviteRecordsProps {
  records: InviteRecord[];
  pagination: PaginationInfo;
  fetchRecords: (page: number) => Promise<{
    records: InviteRecord[];
    pagination: PaginationInfo;
  }>;
}

export function InviteRecords({
  records: initialRecords,
  pagination: initialPagination,
  fetchRecords,
}: InviteRecordsProps) {
  const t = useTranslations("my.inviteRecords");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [currentRecords, setCurrentRecords] =
    useState<InviteRecord[]>(initialRecords);
  const [currentPagination, setCurrentPagination] =
    useState<PaginationInfo>(initialPagination);

  const handlePageChange = useCallback(
    async (page: number) => {
      // Update URL without navigation
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.replace(`?${params.toString()}`, { scroll: false });

      startTransition(async () => {
        try {
          const { records, pagination } = await fetchRecords(page);
          setCurrentRecords(records);
          setCurrentPagination(pagination);
        } catch (error) {
          console.error("Failed to fetch records:", error);
          toast.error(t("error.fetch"));
        }
      });
    },
    [fetchRecords, router, searchParams, t],
  );

  const getMemberStatus = (profile: InviteRecord) => {
    let status = "free";
    if (!profile.membershipExpiredAt) {
      status = "free";
    } else if (new Date() > profile.membershipExpiredAt) {
      status = "expired";
    } else {
      status = "active";
    }
    return (
      <Badge
        variant={
          status === "active"
            ? "default"
            : status === "expired"
              ? "outline"
              : "secondary"
        }
      >
        {t(`status.${status}`)}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="relative">
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.username")}</TableHead>
                <TableHead>{t("table.joinTime")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="break-keep font-medium">
                    {record.username}
                  </TableCell>
                  <TableCell className="break-keep">
                    {new Date(record.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="break-keep">
                    {getMemberStatus(record)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {currentPagination.totalPages > 1 ? (
          <div className="mt-4">
            <PaginationButtons
              pagination={currentPagination}
              onPageChange={handlePageChange}
              isLoading={isPending}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
