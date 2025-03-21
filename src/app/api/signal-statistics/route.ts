import { type NextRequest, NextResponse } from "next/server";

import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { fromZodError } from "@/lib/errors";
import { getTagStatistics } from "@/server/api/routes/signal";
import { z, ZodError } from "zod";

const getSignalStatisticsSchema = z.object({
  type: z
    .enum(Object.values(SIGNAL_PROVIDER_TYPE) as [string, ...string[]])
    .describe("信号提供者类型"),
  filter: z.object({
    entityId: z.string().describe("实体ID"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      filter: { entityId },
    } = getSignalStatisticsSchema.parse(body);

    // 调用服务端函数
    const result = await getTagStatistics(type as SIGNAL_PROVIDER_TYPE, {
      entityId,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
