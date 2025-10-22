// hooks/useWeb3Leaderboard.ts

import { useChainId, useReadContract, useReadContracts } from 'wagmi';
import { CONTRACT_ADDRESSES, LEADERBOARD_ABI } from '../lib/web3/constants';

interface LeaderboardEntry {
    address: string;
    score: number;
}

export const useWeb3Leaderboard = () => {
    const chainId = useChainId();
    const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const isChainSupported = !!contractAddress;

    // 1. Fetch array alamat semua pemain (memanggil getAllPlayers)
    const { 
        data: playerAddresses, 
        isLoading: isLoadingAddresses 
    } = useReadContract({
        address: contractAddress,
        abi: LEADERBOARD_ABI,
        functionName: 'getAllPlayers',
        chainId: chainId,
        query: { enabled: isChainSupported }
    });

    // 2. Siapkan panggilan massal untuk mendapatkan skor setiap pemain
    const scoreCalls = (playerAddresses as `0x${string}`[] || []).map(address => ({
        address: contractAddress as `0x${string}`,
        abi: LEADERBOARD_ABI,
        functionName: 'bestScores', // Fungsi view otomatis untuk mapping
        args: [address]
    }));

    // 3. Ambil semua skor secara efisien
    const { 
        data: scoresData, 
        isLoading: isLoadingScores 
    } = useReadContracts({
        contracts: scoreCalls,
        query: {
            enabled: isChainSupported && !!playerAddresses && playerAddresses.length > 0,
        }
    });

    // 4. Proses, filter, dan urutkan data
    const leaderboard: LeaderboardEntry[] = (playerAddresses || [])
        .map((address, index) => ({
            address: address,
            score: scoresData?.[index]?.result ? Number(scoresData[index].result) : 0, 
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    return {
        leaderboard,
        isLoading: isLoadingAddresses || isLoadingScores,
        isSupportedChain: isChainSupported,
    };
};
