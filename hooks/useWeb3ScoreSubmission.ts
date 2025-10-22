// hooks/useWeb3ScoreSubmission.ts

import { useChainId, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, LEADERBOARD_ABI } from '../lib/web3/constants'; 

export const useWeb3ScoreSubmission = () => {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = 
        useWaitForTransactionReceipt({ hash });

    const submitScore = (score: number) => {
        if (!isConnected) {
            console.error("Wallet not connected.");
            alert("Harap hubungkan wallet Anda untuk menyimpan skor on-chain.");
            return;
        }

        if (!contractAddress) {
            console.error(`Contract not found for chainId: ${chainId}`);
            alert("Jaringan saat ini tidak didukung untuk submit skor.");
            return;
        }
        
        // Memanggil fungsi submitScore
        writeContract({
            address: contractAddress,
            abi: LEADERBOARD_ABI,
            functionName: 'submitScore',
            args: [BigInt(score)], 
            chainId,
        });
    };

    return { 
        submitScore, 
        isSubmitting: isPending || isConfirming, 
        isSuccess: isConfirmed,
        error: writeError || confirmError
    };
};
