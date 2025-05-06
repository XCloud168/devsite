import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import SwapWidget from "./widget";
import { SwapIcon } from "@/components/ui/icon";

interface SwapModalProps {
  isOpen?: boolean;
  onClose?: () => void;
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
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex cursor-pointer items-center gap-1 hover:scale-105">
          <div className="h-4 w-4">
            <SwapIcon className="fill-[#1F72E5] dark:fill-[#FFFFA7]" />
          </div>
          <p className="text-[#1F72E5] dark:text-[#FFFFA7]">
            {" "}
            {t("signals.signal.quickSwap")}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="min-h-[500px] sm:max-w-[500px]">
        <DialogHeader>
          {/*<div className="absolute right-4 top-4">*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"*/}
          {/*    onClick={onClose}*/}
          {/*  >*/}
          {/*    <X className="h-4 w-4" />*/}
          {/*    <span className="sr-only">Close</span>*/}
          {/*  </button>*/}
          {/*</div>*/}
          <DialogTitle className="text-center text-2xl">
            {t("Swap.title")}
          </DialogTitle>
        </DialogHeader>
        <SwapWidget fromToken={fromToken} toToken={toToken} />
      </DialogContent>
    </Dialog>
  );
}
