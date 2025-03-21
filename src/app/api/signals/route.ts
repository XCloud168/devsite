import { type NextRequest, NextResponse } from "next/server";

import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { fromZodError } from "@/lib/errors";
import { getSignalsByPaginated } from "@/server/api/routes/signal";
import { z, ZodError } from "zod";

const getSignalsByPaginatedSchema = z.object({
  page: z.number().min(1).optional().describe("页码"),
  filter: z.object({
    categoryCode: z.string().describe("信号分类码"),
    providerType: z
      .enum([
        SIGNAL_PROVIDER_TYPE.ANNOUNCEMENT,
        SIGNAL_PROVIDER_TYPE.TWITTER,
        SIGNAL_PROVIDER_TYPE.NEWS,
      ])
      .optional()
      .describe("信号提供者类型"),
    providerId: z.string().optional().describe("信号提供者ID"),
    entityId: z.string().optional().describe("实体ID"),
    signalId: z.string().optional().describe("信号ID"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      page,
      filter: { categoryCode, providerType, providerId, entityId, signalId },
    } = getSignalsByPaginatedSchema.parse(body);

    // 调用服务端函数
    const result = await getSignalsByPaginated(page, {
      categoryCode,
      providerType,
      providerId,
      entityId,
      signalId,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
