import { FeaturedBanner } from "./_components/featured-banner";
import { FeaturedList } from "@/app/signal-catcher/_components/featured-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizeable";
import { KolComponent } from "@/app/signal-catcher/_components/kol-component";

export default async function SignalPage() {
  return (
    <div className="w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={50}>
          <div className="block h-full items-center justify-center">
            <KolComponent />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} maxSize={50} minSize={30}>
          <div className="block h-full items-center justify-center">
            <FeaturedBanner />
            <FeaturedList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
