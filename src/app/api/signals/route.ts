import { type NextRequest, NextResponse } from "next/server";

import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { fromZodError } from "@/lib/errors";
import { getSignalsByPaginated } from "@/server/api/routes/signal";
import { z, ZodError } from "zod";

const getSignalsByPaginatedSchema = z.object({
  filter: z.object({
    categoryId: z.string().describe("类别ID"),
    providerType: z.nativeEnum(SIGNAL_PROVIDER_TYPE).optional().describe("提供者类型"),
    providerId: z.string().optional().describe("提供者ID"),
    entityId: z.string().optional().describe("实体ID"),
    signalId: z.string().optional().describe("信号ID"),
  }),
  cursor: z.string().optional().describe("游标（上一页最后一条信号的时间）"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      filter: { categoryId, providerType, providerId, entityId, signalId },
      cursor,
    } = getSignalsByPaginatedSchema.parse(body);

    // 调用服务端函数
    const result = await getSignalsByPaginated(
      {
        categoryId,
        providerType,
        providerId,
        entityId,
        signalId,
      },
      cursor,
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
