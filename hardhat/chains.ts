import { defineChain } from 'viem';

export const neoXTestnet = defineChain({
  id: 0xba9304,
  name: 'Neo X Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Neo GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: { http: ['https://neoxt4seed1.ngd.network/'] },
  },
  blockExplorers: {
    default: {
      name: 'NeoXScan',
      url: 'https://xt4scan.ngd.network/"',
      apiUrl: 'https://xt4scan.ngd.network/api',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0x82096F92248dF7afDdef72E545F06e5be0cf0F99',
    },
    wgas10: {
      address: '0x1CE16390FD09040486221e912B87551E4e44Ab17',
    }
  },
});
