import { withServerResult } from "@/lib/server-result";

/**
 * 翻译推特内容
 * @param content 推特内容
 * @param language 语言
 * @returns 翻译后的内容
 */
export async function translateTweet(content: string, language: string) {
  return withServerResult(async () => {
    const result = await translate(content, language);
    return result;
  });
}
