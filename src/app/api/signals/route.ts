import { NextRequest, NextResponse } from "next/server";

import { getSignalsByPaginated } from "@/server/api/routes/signal";
import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { z, ZodError } from "zod";
import { fromZodError } from "@/lib/errors";

const getSignalsByPaginatedSchema = z.object({
  page: z.number().min(1).optional().describe("页码"),
  filter: z.object({
    providerType: z
      .enum([SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT, SIGNAL_PROVIDER_TYPE.TWITTER])
      .describe("信号提供者类型"),
    providerId: z.string().optional().describe("信号提供者ID"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      page,
      filter: { providerType, providerId },
    } = getSignalsByPaginatedSchema.parse(body);
    console.log(page, providerType, providerId);

    // 调用服务端函数
    const result = await getSignalsByPaginated(page, {
      providerType,
      providerId,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
