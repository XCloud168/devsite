import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import SwapWidget from "./widget";
import { SwapIcon } from "@/components/ui/icon";
import { X } from "lucide-react";

interface SwapModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  fromChain?: string;
  toChain?: string;
  fromToken?: string;
  toToken?: string;
}

export default function SwapModal({
  fromChain,
  toChain,
  fromToken,
  toToken,
  isOpen,
  onClose,
}: SwapModalProps) {
  const t = useTranslations();

  return (
    <Dialog open={isOpen}>
      <DialogContent className="min-h-[500px] sm:max-w-[500px]">
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <DialogTitle className="mt-4 text-center text-2xl">
            {t("Swap.title")}
          </DialogTitle>
        </DialogHeader>
        <SwapWidget
          fromToken={fromToken}
          toToken={toToken}
          fromChain={fromChain}
          toChain={toChain}
        />
      </DialogContent>
    </Dialog>
  );
}
