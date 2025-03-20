import { withServerResult } from "@/lib/server-result";
import { checkPayment } from "@/server/api/routes/payment";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const result = await withServerResult(async () => {
    const body = await req.json();
    const { paymentId } = body;

    const result = await checkPayment(paymentId);

    return result;
  });
  return NextResponse.json(result);
}
