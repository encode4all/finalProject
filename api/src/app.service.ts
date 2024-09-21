import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
  TransactionReceipt,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as nftJson from './contractAssets/BasicOnChainNft.json';
import { TransactionFailedError, InvalidUrlError } from './Errors';

type NFTInfo = {
  name: string;
  symbol: string;
  address: Address;
  tokenCounter: bigint;
};

function serializeSafe<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (k, v) => {
      if (typeof v === 'bigint') return v.toString();

      return v;
    }),
  );
}

@Injectable()
export class AppService {
  publicClient: PublicClient;
  walletClient: WalletClient;
  constructor(private readonly configService: ConfigService) {
    const account = privateKeyToAccount(
      `0x${this.configService.get<string>('PRIVATE_KEY')}`,
    );
    // @ts-expect-error some issues here with the typings
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    } as any);

    this.walletClient = createWalletClient({
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
      chain: sepolia,
      account: account,
    });
  }

  private async getNFTContractMetadata(): Promise<NFTInfo> {
    const address = this.getContractAddressFor('nft');
    const [name, symbol, tokenCounter] = await Promise.all([
      this.publicClient.readContract({
        address,
        abi: nftJson.abi,
        functionName: 'name',
      }) as Promise<string>,
      this.publicClient.readContract({
        address,
        abi: nftJson.abi,
        functionName: 'symbol',
      }) as Promise<string>,
      this.publicClient.readContract({
        address,
        abi: nftJson.abi,
        functionName: 'getTokenCounter',
      }) as Promise<bigint>,
    ]);

    return {
      name,
      symbol,
      address,
      tokenCounter,
    };
  }

  private async waitTrxSuccess(trxHash: Address): Promise<TransactionReceipt> {
    const receipt: TransactionReceipt =
      await this.publicClient.waitForTransactionReceipt({
        hash: trxHash,
      });

    if (receipt?.status !== 'success') {
      throw new TransactionFailedError(trxHash);
    }

    return receipt;
  }

  private getContractAddressFor(contractKey: 'nft'): Address {
    switch (contractKey) {
      case 'nft':
        return this.configService.get<Address>('NFT_CONTRACT_ADDRESS');
      default:
        throw new Error(`contract address for ${contractKey} not found`);
    }
  }

  async mintNft(imageUri: string, description: string) {
    // save in DB so that we have different
    // validate that this is actually a URL
    try {
      new URL(imageUri);
    } catch (err) {
      console.error('Invalid url provided', err);
      throw new InvalidUrlError(imageUri);
    }

    const address = this.getContractAddressFor('nft');

    // @ts-expect-error some issues here with the typings
    const mintTx = await this.walletClient.writeContract({
      address,
      abi: nftJson.abi,
      functionName: 'mintNft',
      args: [imageUri, description],
    });

    await this.waitTrxSuccess(mintTx);

    return {
      mintTrxHash: mintTx,
    };
  }

  async getNftTokenUri(tokenId: number) {
    const address = this.getContractAddressFor('nft');
    // TODO check if it actually exists
    const tokenUri = await this.publicClient.readContract({
      address,
      abi: nftJson.abi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    return tokenUri as string;
  }

  async getNftMetadata() {
    const { tokenCounter, ...restOfInfo } = await this.getNFTContractMetadata();

    return {
      ...restOfInfo,
      tokenCounter: serializeSafe(tokenCounter),
    };
  }
}
