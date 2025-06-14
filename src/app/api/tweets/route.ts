import { type NextRequest, NextResponse } from "next/server";

import { fromZodError } from "@/lib/errors";
import { getTweetsByPaginated } from "@/server/api/routes/tweets";
import { z, ZodError } from "zod";

const getTweetsByPaginatedSchema = z.object({
  filter: z.object({
    tweetUid: z.string().optional().describe("推特uid"),
    followed: z.boolean().optional().describe("是否关注"),
    hasContractAddress: z.boolean().optional().describe("是否包含合约地址"),
  }),
  cursor: z.string().optional().describe("游标（上一页最后一条推文的创建时间）"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      filter,
      cursor,
    } = getTweetsByPaginatedSchema.parse(body);
    console.log(filter, cursor);

    // 调用服务端函数
    const result = await getTweetsByPaginated(filter, cursor);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(fromZodError(error), { status: 422 });
    }
    throw error;
  }
}
