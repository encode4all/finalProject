"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { OurNFTInteraction } from "~~/components/OurNFT/OurNFTInteraction";
import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { OurNFTContractInfo } from "~~/types/app";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [contract, setContract] = useState<OurNFTContractInfo | null>(null);

  useEffect(() => {
    fetch(new URL("nft/info", scaffoldConfig.restApiBaseUrl))
      .then(resp => resp.json())
      .then(resp => {
        setContract(resp.result);
      })
      .catch(err => {
        alert(`Failed to fetch NFT contract info: ${err.message}`);
      });
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Welcome to our NFT App</h1>
        {connectedAddress && (
          <div style={{ fontSize: "1.2rem", justifyContent: "space-around" }} className="flex">
            Connected Address: <Address address={connectedAddress} />
          </div>
        )}
      </div>

      {connectedAddress && contract && (
        <OurNFTInteraction contract={contract} connectedAddress={connectedAddress as `Ox${string}`} />
      )}
      {!connectedAddress && <p>Please connect your account to start</p>}
    </div>
  );
};

export default Home;
