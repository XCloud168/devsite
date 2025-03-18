import RealtimeSignal from "@/components/signals/realtime-signal";
import TranslationComponent from "@/components/translation-component";
import { SIGNAL_PROVIDER_TYPE } from "@/lib/constants";
import { getSignalsByPaginated } from "@/server/api/routes/signal";

export default async function HomePage() {
  const getSignalList = async (
    providerType: SIGNAL_PROVIDER_TYPE,
    { signalId }: { signalId?: string },
  ) => {
    return await getSignalsByPaginated(1, {
      providerType,
      signalId,
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <TranslationComponent
          content="🎉In the last week, Masbate captured and pushed a total of 22 Token growth signals. Masbate users have seen highest ROI of 1331.41% by investing using Signal Catchers!
🎖️The top3 performing tokens as of now are as follows.
🔥Top1  $BMT 📈335.16%
🔥Top2  $APU 📈161.44%
🔥Top3  $RED 📈 87.42%
Are these tokens in your investment portfolio?  Join the limited time free trial of Masbate to receive timely and accurate webs signals: https://masbate.xyz
#memecoin  #masbate #Web3  #BTC️The top3 performing tokens as of now are as follows.
🔥Top1  $BMT 📈335.16%
🔥Top2  $APU 📈161.44%
🔥Top3  $RED 📈 87.42%
Are these tokens in your investment portfolio?  Join the limited time free trial of Masbate to receive timely and accurate webs signals: https://masbate.xyz
#memecoin  #masbate #Web3  #BTC🎖️The top3 performing tokens as of now are as follows.
🔥Top1  $BMT 📈335.16%
🔥Top2  $APU 📈161.44%
🔥Top3  $RED 📈 87.42%
Are these tokens in your investment portfolio?  Join the limited time free trial of Masbate to receive timely and accurate webs signals: https://masbate.xyz
#memecoin  #masbate #Web3  #BTC"
        />
      </div>

      <RealtimeSignal />
    </main>
  );
}
