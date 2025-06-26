import { withServerResult } from "@/lib/server-result";
import { processWithdrawals } from "@/server/api/routes/payment";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await withServerResult(async () => {
    const result = await processWithdrawals();
    return result;
  });
  
  return NextResponse.json(result);
} 