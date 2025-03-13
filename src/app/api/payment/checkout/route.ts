import { NextRequest, NextResponse } from "next/server";

import { checkout } from "@/server/api/routes/payment";

export async function POST(req: NextRequest) {
  try {
    const { planType, chain } = await req.json();

    const result = await checkout(planType, chain);
    if (result.error) {
      return NextResponse.json(
        {
          error:
            result.error instanceof Error
              ? result.error.message
              : String(result.error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
