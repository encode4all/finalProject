"use client";

import { useState, useEffect } from 'react';
import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import NftAbi from "../../../../hardhat/artifacts/contracts/BasicOnChainNft.sol/BasicOnChainNft.json";
import type { NextPage } from "next";
import { handleMintNft } from "~~/actions/handleMintNft";
import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

const Home: NextPage = () => {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState('');
  const [addressTo, setAddressTo] = useState('');

  const NftContract = scaffoldConfig.nftContractAddress;
  const { address: connectedAddress } = useAccount();

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
      await fetchBalance();
    } catch (err) {
      console.error(err);
      setIsMinted(false);
      setError(err instanceof Error ? err : new Error('Failed to mint NFT. Please try again.'));
    } finally {
      setIsMinting(false);
    }
  }

  const handleReclaimSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement the reclaim functionality
    console.log('Reclaim submitted', { secretAnswer, addressTo });
  };

  console.log("NFT Contract address:", NftContract);

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Scaffold-ETH 2</h1>
        {connectedAddress && (
          <p style={{ fontSize: '1.2rem' }}>Connected Address: <Address address={connectedAddress} /></p>
        )}
      </div>

      {connectedAddress && (
        <div style={{
          width: '100%',
          backgroundColor: '#385183',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Pane 1: Mint NFT */}
            <div style={{
              border: '2px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '200px',
              backgroundColor: '#385183'
            }}>
              <h2 style={{ marginBottom: '15px' }}>Mint NFT</h2>
              <form onSubmit={mintAndNotify}>
                <input type="hidden" name="nft_for_address" value={connectedAddress || ''} />
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }} disabled={isMinting}>
                  {isMinting ? "Minting..." : "Mint"}
                </button>
              </form>
              {isMinted && <p style={{ color: '#2ab441', marginTop: '10px' }}>NFT minted successfully!</p>}
            </div>

            {/* Pane 2: Your NFT */}
            <div style={{
              border: '2px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '200px',
              backgroundColor: '#385183'
            }}>
              <h2 style={{ marginBottom: '15px' }}>Your NFT</h2>
              {isLoading ? (
                <p>Loading balance...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>Error fetching balance</p>
              ) : balance !== null && balance > 0n ? (
                <p>You own {balance.toString()} NFT</p>
              ) : (
                <p>You don't own any NFTs yet</p>
              )}
            </div>
          </div>

          {/* Pane 3: Reclaim NFT */}
          <div style={{
            border: '2px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#385183',
            marginTop: '20px',
            width: '100%'
          }}>
            <h2 style={{ marginBottom: '15px' }}>Reclaim NFT</h2>
            <form onSubmit={handleReclaimSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="secretAnswer" style={{ display: 'block', marginBottom: '5px' }}>Secret Answer:</label>
                <input
                  type="text"
                  id="secretAnswer"
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="addressTo" style={{ display: 'block', marginBottom: '5px' }}>Address To:</label>
                <input
                  type="text"
                  id="addressTo"
                  value={addressTo}
                  onChange={(e) => setAddressTo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              <button type="submit" style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Reclaim
              </button>
            </form>
          </div>
        </div>
      )}
      {!connectedAddress && <p>Please connect your account to start</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
};

export default Home;
