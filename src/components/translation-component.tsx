"use client";

import { TranslateContent } from "@/server/api/routes/translate";
import LanguageDetect from "languagedetect";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface TranslationComponentProps {
  lang?: string;
  content: string;
}

const LOCALE_DISPLAY_NAME = {
  zh: "中文",
  "zh-CN": "中文",
  en: "English",
};

const TranslationComponent: React.FC<TranslationComponentProps> = ({
  lang,
  content,
}) => {
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpand, setShouldShowExpand] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const t = useTranslations();
  const currentLocale = useLocale();
  const langdetect = new LanguageDetect();

  const detectLanguage = (text: string) => {
    const languages = langdetect.detect(text);
    const langDetect = languages?.[0]?.[0] ?? "unknown";
    if (langDetect === "english") return "en";
    if (langDetect === "chinese") return "zh";
    return langDetect;
  };

  const sourceLanguage = lang ?? detectLanguage(content);
  const handleTranslate = async () => {
    if (translatedContent) {
      setTranslatedContent(null);
      return;
    }

    setIsLoading(true);
    const translation = await TranslateContent(content, currentLocale);
    setTranslatedContent(translation);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      // 假设每行高度约为20px (可根据你的实际行高调整)
      const lineHeight = 20;
      const contentHeight = contentRef.current.scrollHeight;
      const lines = contentHeight / lineHeight;

      setShouldShowExpand(lines > 4);
    }
  }, [content]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <div className="relative">
        <p
          ref={contentRef}
          className={`transition-all duration-200 ${
            isExpanded ? "" : "line-clamp-3"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
        <div className="flex items-center">
          {shouldShowExpand && (
            <Button
              variant="link"
              onClick={toggleExpand}
              className="gap-0 pl-0 decoration-[#949C9E]"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-2 w-2" color="#949C9E" />
                  <p className="text-xs text-[#949C9E]">
                    {t("common.collapse")}
                  </p>
                </>
              ) : (
                <>
                  <ChevronDown className="h-2 w-2" color="#949C9E" />
                  <p className="text-xs text-[#949C9E]">{t("common.expand")}</p>
                </>
              )}
            </Button>
          )}

          {currentLocale != sourceLanguage && (
            <Button
              variant="link"
              onClick={handleTranslate}
              className="gap-1 pl-0 decoration-[#949C9E]"
            >
              {/*<Languages size={8} color="#949C9E" />*/}
              <p className="text-xs text-[#949C9E]">
                {t.rich("common.translate", {
                  locale:
                    LOCALE_DISPLAY_NAME[
                      currentLocale as keyof typeof LOCALE_DISPLAY_NAME
                    ],
                })}
              </p>
            </Button>
          )}
        </div>
        {isLoading && (
          <div className="p-3">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {translatedContent && (
          <p
            className="rounded-xl bg-[#2B2C2C] p-3"
            dangerouslySetInnerHTML={{ __html: translatedContent }}
          ></p>
        )}
      </div>
    </div>
  );
};

export default TranslationComponent;
