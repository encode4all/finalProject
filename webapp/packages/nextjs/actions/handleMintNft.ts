"use server";

import { handleUpload } from "./handleIpfsUpload";
import scaffoldConfig from "~~/scaffold.config";

export async function handleMintNft(formData: FormData) {
  // upload

  const ipfsHash = await handleUpload(formData.get("nft_image") as Blob);
  // make API call to actually mint nft
  const fetchResp = await fetch(new URL("mint", scaffoldConfig.restApiBaseUrl).href, {
    method: "POST",
    body: JSON.stringify({ imageURI: ipfsHash }),
  });

  const jsonResp = await fetchResp.json();

  console.log("nft json Resp: ", jsonResp);
}
