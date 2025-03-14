"use client";

import { useQRCode } from "next-qrcode";

interface QRCodeProps {
  text: string;
  width?: number;
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  className?: string;
}

export function QRCode({
  text,
  width = 200,
  darkColor = "#000000FF",
  lightColor = "#FFFFFFFF",
  margin = 2,
  className,
}: QRCodeProps) {
  const { Canvas } = useQRCode();

  return (
    <div className={`rounded-lg p-4 ${className || ""}`}>
      <Canvas
        text={text}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          errorCorrectionLevel: "M",
          margin,
          width,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        }}
      />
    </div>
  );
}
