"use client";

export function DodoSwapWidget() {
  return (
    <div className="flex w-full items-center justify-center">
      <iframe
        src="https://swap.dodoex.io/mas_swap?full-screen=true"
        width="450px"
        height="500px"
        frameBorder="0"
        style={{ borderRadius: "16px" }}
      />
    </div>
  );
}
