"use server";

import tr from "googletrans";

/**
 * 翻译内容
 * @param content 内容
 * @param locale 语言
 * @returns 翻译后的内容
 */
export async function TranslateContent(content: string, locale: string) {
  try {
    const translation = await tr(content, { to: locale });
    return translation.text;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed";
  }
}
