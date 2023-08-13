import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const modeConfig = {
  id: 919,
  name: "Mode Testnet",
  network: "Mode",
  nativeCurrency: {
    decimals: 18,
    name: "Mode Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.mode.network/"] },
    default: { http: ["https://sepolia.mode.network/"] },
  },
};

const { chains } = configureChains(
  [modeConfig],
  [
    alchemyProvider({ apiKey: "Rwja692xoss6YsaqbUDRNVwpjZrO4ltM" }),
    publicProvider(),
  ]
);
const config = createConfig(
  getDefaultConfig({
    appName: "Your App Name",
    alchemyId: "Rwja692xoss6YsaqbUDRNVwpjZrO4ltM",
    // walletConnectProjectId,
    chains,
  })
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig config={config}>
    <ConnectKitProvider theme="midnight">
      <App />
    </ConnectKitProvider>
  </WagmiConfig>
);
