"use server";

import { unwrapResult } from "@/lib/server-result";
import { getMyInviteRecordsByPaginated } from "@/server/api/routes/profile";

export async function fetchInviteRecords(page: number) {
  const { data: records, pagination } = unwrapResult(
    await getMyInviteRecordsByPaginated(page),
  );

  return { records, pagination };
}
