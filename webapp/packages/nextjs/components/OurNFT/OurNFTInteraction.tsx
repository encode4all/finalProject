"use client";

import { useEffect, useState } from "react";
import nftJson from "../../../../../hardhat/artifacts/contracts/BasicOnChainNft.sol/BasicOnChainNft.json";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { http } from "viem";
import { sepolia } from "viem/chains";
import { createConfig, useReadContract, useWriteContract } from "wagmi";
import { type UseWriteContractReturnType } from "wagmi";
import { handleMintNft } from "~~/actions/handleMintNft";
import { OurNFTContractInfo } from "~~/types/app";

type Address = `Ox${string}`;

type TProps = {
  connectedAddress: Address;
  contract: OurNFTContractInfo;
};

export const OurNFTInteraction = (props: TProps) => {
  const { connectedAddress, contract } = props;

  const [errorMinting, setErrorMinting] = useState<Error | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState("");
  const [addressTo, setAddressTo] = useState(connectedAddress);

  const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  });

  const {
    data: balance,
    isLoading: isLoadingNftBalance,
    isError: isErrorFetchingBalance,
  } = useReadContract({
    address: contract.address,
    abi: nftJson.abi,
    args: [connectedAddress],
    functionName: "balanceOf",
  });

  useEffect(() => {
    setIsMinted(balance ? (balance as bigint) > 0n : false);
  }, [connectedAddress, contract?.address, balance]);

  async function mintAndNotify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isMinting) {
      return;
    }

    setIsMinting(true);
    setErrorMinting(null);

    try {
      const resp = await handleMintNft(formData);
      console.log("Mint response:", resp);
      setIsMinted(true);
      setErrorMinting(null);
    } catch (err) {
      console.error(err);
      setIsMinted(false);
      setErrorMinting(err instanceof Error ? err : new Error("Failed to mint NFT. Please try again."));
    } finally {
      setIsMinting(false);
    }
  }

  const {
    writeContract: claimOwnershipFn,
    isError: claimOwnershipIsError,
    isPending: claimOwnershipLoading,
    error: claimOwnershipError,
  }: UseWriteContractReturnType = useWriteContract({});

  const [newBalance, setNewBalance] = useState<bigint | null>(null);

  const readAndSetNewBalance = async () => {
    const result = await readContract(wagmiConfig, {
      address: contract.address,
      abi: nftJson.abi,
      args: [connectedAddress],
      functionName: "balanceOf",
    });

    console.log("balance of current ", result);

    setNewBalance(result as bigint);
  };

  const handleTransactionSubmitted = async (txHash: `0x${string}`) => {
    const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: txHash,
    });

    // // at this point the tx was mined
    if (transactionReceipt.status === "success") {
      readAndSetNewBalance();
    }
  };

  const handleReclaimSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (claimOwnershipLoading) {
      return;
    }
    // TODO: Implement the reclaim functionality
    console.log("Reclaim submitted", { secretAnswer, addressTo });

    claimOwnershipFn(
      {
        args: [addressTo || connectedAddress, secretAnswer, 0],
        address: contract.address,
        abi: nftJson.abi,
        functionName: "claimOwnership",
      },
      {
        onSuccess: handleTransactionSubmitted,
      },
    );
  };

  if (!connectedAddress || !contract?.address) {
    return <p>Connect your wallet and ensure contract is available</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#385183",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Pane 1: Mint NFT */}
        <div
          style={{
            border: "2px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "200px",
            backgroundColor: "#385183",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>
            Mint NFT `{contract?.name}({contract?.symbol})`{" "}
          </h2>
          {contract && <pre>{JSON.stringify(contract, null, 4)}</pre>}
          <form onSubmit={mintAndNotify}>
            <input type="hidden" name="nft_for_address" value={connectedAddress} />
            <p> NFT is already minted, minting disabled </p>
            {!(contract?.tokenCounter && contract?.tokenCounter > 0) && (
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : "Mint"}
              </button>
            )}
          </form>
          {isMinted && <p style={{ color: "#2ab441", marginTop: "10px" }}>NFT minted successfully!</p>}
        </div>

        {/* Pane 2: Your NFT */}
        <div
          style={{
            border: "2px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "200px",
            backgroundColor: "#385183",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Your NFT</h2>
          {isLoadingNftBalance ? (
            <p>Loading balance...</p>
          ) : isErrorFetchingBalance ? (
            <p style={{ color: "red" }}>Error fetching balance</p>
          ) : (balance as bigint) > 0n ? (
            <p>You own {balance?.toString()} NFT</p>
          ) : (
            <p>You don&apos;t own any NFTs yet</p>
          )}
          {newBalance && newBalance !== balance && <p>Your new balance is now {newBalance?.toString()} NFT</p>}
        </div>
      </div>

      {/* Pane 3: Reclaim NFT */}
      <div
        style={{
          border: "2px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#385183",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Reclaim NFT</h2>
        <form onSubmit={handleReclaimSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="secretAnswer" style={{ display: "block", marginBottom: "5px" }}>
              Secret Answer:
            </label>
            <input
              type="text"
              id="secretAnswer"
              required
              value={secretAnswer}
              onChange={e => setSecretAnswer(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="addressTo" style={{ display: "block", marginBottom: "5px" }}>
              Address To:
            </label>
            <input
              type="text"
              required
              id="addressTo"
              value={addressTo}
              onChange={e => setAddressTo(e.target.value as any)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Claim
          </button>
        </form>
      </div>

      {errorMinting && <p style={{ color: "red" }}>{errorMinting.message}</p>}
      {claimOwnershipIsError && <p style={{ color: "red" }}>{claimOwnershipError.message}</p>}
    </div>
  );
};
