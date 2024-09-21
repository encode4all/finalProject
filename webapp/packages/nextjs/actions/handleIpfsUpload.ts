"use server";

import { Ethereum, Network, TatumSDK } from "@tatumio/tatum";
import scaffoldConfig from "~~/scaffold.config";

function initClient() {
  return TatumSDK.init<Ethereum>({
    network: Network.ETHEREUM_SEPOLIA,
    verbose: true,
    apiKey: {
      v4: scaffoldConfig.tatumV4Key,
    },
  });
}

export async function handleUpload(nft_content: Blob) {
  console.log("inside handleUpload");
  const tatumClient = await initClient();
  //   console.log("client is: ", tatumClient.address, tatumClient.id, tatumClient);
  //   const nftFile = formData.get("nft_image") as Blob;
  //   console.log("file uploaded", nftFile), tatumClient;

  const result = await tatumClient.ipfs.uploadFile({ file: nft_content });
  console.log("result from pushing to ipfs: ", JSON.stringify(result));

  if (result.status !== "SUCCESS") {
    throw new Error("Failed to upload to ipfs");
  }

  Promise.resolve().then(() => tatumClient.destroy());

  return result.data.ipfsHash;
}
