"use client";

import { useState, useEffect } from 'react';
import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains'; // Import the appropriate chain
import { useAccount } from 'wagmi'; // Re-add wagmi import

import NftAbi from "../../../../hardhat/artifacts/contracts/BasicOnChainNft.sol/BasicOnChainNft.json"; // Adjust the import path as needed
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { handleMintNft } from "~~/actions/handleMintNft";
import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

const Home: NextPage = () => {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const NftContract = scaffoldConfig.nftContractAddress;
  const { address: connectedAddress } = useAccount(); // Use wagmi's useAccount hook


  async function fetchBalance() {
    if (!connectedAddress || !NftContract) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      });

      const contract = getContract({
        address: NftContract,
        abi: NftAbi.abi,
        client: publicClient,
      });
      
      const result = await contract.read.balanceOf([connectedAddress]);
      if (typeof result === 'bigint' || typeof result === 'number') {
        const balanceValue = typeof result === 'bigint' ? result : BigInt(result);
        setBalance(balanceValue);
        setIsMinted(balanceValue > 0n);
      } else {
        console.warn('Unexpected result type from balanceOf:', typeof result);
        setBalance(null);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [connectedAddress, NftContract]);

  async function mintAndNotify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isMinting) {
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      const resp = await handleMintNft(formData);
      console.log("Mint response:", resp);
      setIsMinted(true);
      setError(null);
      await fetchBalance(); // Call fetchBalance after successful minting
    } catch (err) {
      console.error(err);
      setIsMinted(false);
      setError(err instanceof Error ? err : new Error('Failed to mint NFT. Please try again.'));
    } finally {
      setIsMinting(false);
    }
  }

  console.log("NFT Contract address:", NftContract);

  const NFTDisplay = () => {
    return (
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
        <h3 className="text-xl font-bold mb-2">Your NFT</h3>
        {isLoading ? (
          <p>Loading balance...</p>
        ) : error ? (
          <p>Error fetching balance</p>
        ) : balance !== null && balance > BigInt(0) ? (
          <>
            <p>You own {balance.toString()} NFT</p>
            <div className="w-32 h-32 bg-gray-300 rounded-lg mt-4">
              {/* Placeholder for NFT image */}
            </div>
          </>
        ) : (
          <p>You don't own any NFTs yet</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress || ''} />
          </div>
        </div>

        {connectedAddress && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <BugAntIcon className="h-8 w-8 fill-secondary" />
                <p>Mint NTF</p>
                <div>
                  
                  <button>Preview NFT</button>
                </div>
                <form onSubmit={mintAndNotify}>
                <input type="hidden" name="nft_for_address" value={connectedAddress || ''} />
                <button className="bg-blue-500 text-white p-4 rounded" disabled={isMinting}>
                  {isMinting ? "Minting..." : "Submit"}
                </button>
                {isMinted && <p className="text-green-500 mt-2">NFT minted successfully!</p>}
                </form>
              </div>
              <NFTDisplay />
            </div>
          </div>
        )}


        {!connectedAddress && (
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
            <p>Please connect your account to start</p>
          </div>
        )}

  {error && <p className="text-red-500 mt-2">{error.message}</p>} 
      </div>
    </>
  );
};

export default Home;
