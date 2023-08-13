import { Chain } from "wagmi";
export const mode = {
    id: 919,
    name: 'Mode Testnet',
    network: 'Mode',
    nativeCurrency: {
      decimals: 18,
      name: 'Mode Testnet',
      symbol: 'ETH',
    },
    rpcUrls: {
      public: { http: ['https://sepolia.explorer.mode.network/'] },
      default: { http: ['https://sepolia.explorer.mode.network/'] },
    },
} as const satisfies Chain