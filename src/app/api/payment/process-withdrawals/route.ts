import { withServerResult } from "@/lib/server-result";
import { processWithdrawals } from "@/server/api/routes/payment";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 从URL参数中获取 withdrawalId
  const searchParams = req.nextUrl.searchParams;
  const withdrawalId = searchParams.get("withdrawalId") || undefined;

  const result = await withServerResult(async () => {
    const result = await processWithdrawals(withdrawalId);
    return result;
  });
  
  return NextResponse.json(result);
} 