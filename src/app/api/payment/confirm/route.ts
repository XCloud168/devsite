import { NextRequest, NextResponse } from "next/server";

import { confirmPayment } from "@/server/api/routes/payment";
import { withServerResult } from "@/lib/server-result";
import { createError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const result = await withServerResult(async () => {
    const body = await req.json();
    const { paymentId } = body;

    // 参数验证
    if (!paymentId) {
      throw createError.invalidParams("Missing payment ID");
    }

    // 调用服务端函数
    const payment = await confirmPayment(paymentId);
    return payment;
  });

  return NextResponse.json(result);
}
