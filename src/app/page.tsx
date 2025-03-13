"use client";

import SwapModal from "@/components/swap/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HomePage() {
  const [isSwapOpen, setIsSwapOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Button
          size="lg"
          onClick={() => setIsSwapOpen(true)}
          className="mx-auto"
        >
          快捷交易
        </Button>
      </div>

      <SwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />
    </main>
  );
}
