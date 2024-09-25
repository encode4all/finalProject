"use client";

// "use server"; // taking this off, and making it client side for showcase purposes

import scaffoldConfig from "~~/scaffold.config";

export async function handleMintNft(formData: FormData) {
  console.log("debug formData: ", Array.from(formData.entries()));

  // make API call to actually mint nft
  const fetchResp = await fetch(new URL("nft/mint", scaffoldConfig.restApiBaseUrl).href, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      forAddress: formData.get("nft_for_address"),
    }),
  });

  const jsonResp = await fetchResp.json();

  console.log("nft json Resp: ", jsonResp);

  if (!fetchResp.ok) {
    return Promise.reject(fetchResp.statusText);
  }
}
