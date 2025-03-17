import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import SwapWidget from "./widget";
import { DodoSwapWidget } from "./dodo-widget";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromChain?: string;
  toChain?: string;
  fromToken?: string;
  toToken?: string;
}

export default function SwapModal({
  isOpen,
  onClose,
  fromChain,
  toChain,
  fromToken,
  toToken,
}: SwapModalProps) {
  const t = useTranslations("Swap");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
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
          <DialogTitle className="text-center text-2xl">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <DodoSwapWidget />
      </DialogContent>
    </Dialog>
  );
}
