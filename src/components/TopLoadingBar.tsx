"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TopLoadingBarProps {
  loading: boolean;
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ loading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      setVisible(true);
      setProgress(0);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + Math.random() * 5 + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 200);
    } else {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);
    }

    return () => clearInterval(timer);
  }, [loading]);

  return visible ? (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[3px]">
      <div
        className={cn(
          "h-full transition-all duration-300",
          "bg-[#00ff88]",
          "opacity-80 hover:opacity-100",
          "shadow-[0_0_6px_2px_rgba(0,255,136,0.4)]",
        )}
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  ) : null;
};
