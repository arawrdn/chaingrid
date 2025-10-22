"use client"

import { useWeb3Leaderboard } from "@/hooks/useWeb3Leaderboard"
import { useAccount } from "wagmi"

export default function Leaderboard() {
  const { leaderboard, isLoading, isSupportedChain } = useWeb3Leaderboard()
  const { isConnected } = useAccount()

  const entries = leaderboard.slice(0, 10)

  return (
    <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg card-transition">
      
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        Global Leaderboard (On-Chain)
      </h2>
      
      {isLoading ? (
        <p className="text-blue-400 text-sm sm:text-base">Loading on-chain scores from Base/Celo...</p>
      ) : !isConnected ? (
        <p className="text-yellow-600 text-sm sm:text-base">Connect your wallet to see the scores!</p>
      ) : !isSupportedChain ? (
        <p className="text-red-500 text-sm sm:text-base">Unsupported Network. Switch to Base or Celo Mainnet.</p>
      ) : entries.length === 0 ? (
        <p className="text-yellow-600 text-xs sm:text-sm">No scores yet recorded on this chain. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div
              key={entry.address}
              className={`flex justify-between items-center bg-gray-800 p-2 sm:p-3 rounded card-transition hover:bg-gray-700`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-yellow-400 text-sm sm:text-base truncate">
                  #{idx + 1} {entry.address.slice(0, 6)}...{entry.address.slice(-4)} 
                </div>
                <div className="text-yellow-600 text-xs">
                  {entry.address}
                </div>
              </div>
              <div className="text-base sm:text-lg font-bold text-yellow-400 ml-2">{entry.score}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-yellow-600 text-xs mt-3 sm:mt-4 text-center">
        Scores are the best score per wallet, stored on Base and Celo.
      </p>
    </div>
  )
}
