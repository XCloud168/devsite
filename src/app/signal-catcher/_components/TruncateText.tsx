import React, { useEffect, useRef, useState } from "react";

interface TruncateTextProps {
  text: string;
  className?: string;
  maxHeight?: number; // 允许自定义最大高度（默认 400px）
}

const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  className = "",
  maxHeight = 200,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [text, maxHeight]);

  return (
    <div
      ref={contentRef}
      className={`relative ${className} ${
        isOverflowing
          ? `max-h-[${maxHeight}px] line-clamp-[10] overflow-hidden`
          : "max-h-full"
      }`}
    >
      {text}
    </div>
  );
};

export default TruncateText;
