"use server";

import { handleUpload } from "./handleIpfsUpload";
import scaffoldConfig from "~~/scaffold.config";

export async function handleMintNft(formData: FormData) {
  // upload

  const description = formData.get("nft_description");
  const ipfsHash = await handleUpload(formData.get("nft_image") as Blob);
  const imageUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  // make API call to actually mint nft
  const fetchResp = await fetch(new URL("nft/mint", scaffoldConfig.restApiBaseUrl).href, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      imageUri,
      description,
    }),
  });

  const jsonResp = await fetchResp.json();

  console.log("nft json Resp: ", jsonResp);

  if (!fetchResp.ok) {
    return Promise.reject(fetchResp.statusText);
  }
}
