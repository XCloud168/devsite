import { type NextRequest, NextResponse } from "next/server";

import { fromZodError } from "@/lib/errors";
import { getTweetsByPaginated } from "@/server/api/routes/tweets";
import { z, ZodError } from "zod";

const getTweetsByPaginatedSchema = z.object({
  page: z.number().min(1).optional().describe("页码"),
  filter: z.object({
    followed: z.boolean().optional().describe("是否关注"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      page,
      filter: { followed },
    } = getTweetsByPaginatedSchema.parse(body);
    console.log(page, followed);

    // 调用服务端函数
    const result = await getTweetsByPaginated(page, {
      followed,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
