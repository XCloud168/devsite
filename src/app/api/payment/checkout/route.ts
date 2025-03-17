import { type NextRequest, NextResponse } from "next/server";

import { checkout } from "@/server/api/routes/payment";
import { createError } from "@/lib/errors";
import { withServerResult } from "@/lib/server-result";
import { type PLAN_TYPE, type SUPPORTED_CHAIN } from "@/types/constants";

export async function POST(req: NextRequest) {
  const result = await withServerResult(async () => {
    const body = await req.json();
    const { planType, chain } = body;

    // 参数验证
    if (!planType || !chain) {
      throw createError.invalidParams("Missing required parameters");
    }

    // 调用服务端函数
    const payment = await checkout(
      planType as PLAN_TYPE,
      chain as SUPPORTED_CHAIN,
    );
    return payment;
  });

  return NextResponse.json(result);
}
