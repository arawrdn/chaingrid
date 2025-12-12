import React from 'react';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletConnect } from 'wagmi/connectors'; 
import { SUPPORTED_CHAINS } from '../lib/web3/constants'; 

const queryClient = new QueryClient();

const WALLETCONNECT_PROJECT_ID = '9d223614796ed232ccb4903dce656eab'; 

const config = createConfig({
  
  chains: SUPPORTED_CHAINS, 
  transports: {
    [SUPPORTED_CHAINS[0].id]: http(), 
    [SUPPORTED_CHAINS[1].id]: http(), 
  },
  connectors: [
    walletConnect({ 
        projectId: WALLETCONNECT_PROJECT_ID, 
        showQrModal: false, 
    }),
    // ... Tambahkan konektor lain jika diperlukan
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
