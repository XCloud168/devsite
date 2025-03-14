import { NextRequest, NextResponse } from "next/server";

import { getSignalsByPaginated } from "@/server/api/routes/signal";
import { SIGNAL_PROVIDER_TYPE } from "@/types/constants";
import { z } from "zod";

const getSignalsByPaginatedSchema = z.object({
  page: z.number().min(1).optional(),
  filter: z.object({
    providerType: z.string().transform((val) => val as SIGNAL_PROVIDER_TYPE),
    providerId: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    page,
    filter: { providerType, providerId },
  } = getSignalsByPaginatedSchema.parse(body);

  // 调用服务端函数
  const result = await getSignalsByPaginated(page, {
    providerType,
    providerId,
  });

  return NextResponse.json(result);
}
