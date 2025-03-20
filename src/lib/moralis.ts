import { env } from "@/env";
import dayjs from "dayjs";
import Moralis from "moralis";

// Function to initialize Moralis
async function initializeMoralis() {
  await Moralis.start({
    apiKey: env.MORALIS_API_KEY,
  });
}

// Call the initialization function once
initializeMoralis();

export async function getERC20Transfers(
  receiverAddress: string,
  contractAddress: string,
  chain: string,
) {
  const fromDate = dayjs().subtract(300, "minutes").toISOString();
  const transfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
    address: receiverAddress,
    chain: chain,
    contractAddresses: [contractAddress],
    fromDate: fromDate,
    order: "DESC",
  });
  for (const transfer of transfers.result) {
    console.log(transfer.toJSON());
  }
  return transfers;
}
