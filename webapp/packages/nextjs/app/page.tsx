"use client";

import { FormEvent, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { handleMintNft } from "~~/actions/handleMintNft";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [isMinting, setIsMinting] = useState(false);

  function mintAndNotify(e: FormEvent<HTMLFormElement>) {
    console.log("debuh: ", e.target as HTMLFormElement);
    const formData = new FormData(e.currentTarget);
    e.preventDefault();

    if (isMinting) {
      return;
    }

    setIsMinting(true);

    handleMintNft(formData)
      .then(resp => {
        console.log("is this ok: ", resp);
        setIsMinting(false);
      })
      .catch(err => {
        console.error(err);
        setIsMinting(false);
      });

    return;
  }

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
            <Address address={connectedAddress} />
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
                  <button className="bg-blue-500 text-white p-4 rounded" disabled={isMinting}>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {!connectedAddress && (
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
            <p>Please connect your account to start</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
