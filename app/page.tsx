"use client"

import { useState, useEffect } from "react"
import WalletConnect from "@/components/wallet-connect"
import GameBoard from "@/components/game-board"
import Leaderboard from "@/components/leaderboard"
import { Button } from "@/components/ui/button"
import { shouldAutoConnect } from "@/lib/platform-detection"
import { initFarcasterSDK, isFarcasterMiniapp } from "@/lib/farcaster-sdk"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0)
  const [autoConnect, setAutoConnect] = useState(false)
  const [isFarcaster, setIsFarcaster] = useState(false)

  useEffect(() => {
    initFarcasterSDK()
    setIsFarcaster(isFarcasterMiniapp())

    const stored = localStorage.getItem("chaingrid_user")
    if (stored) {
      const { username, address } = JSON.parse(stored)
      setUsername(username)
      setWalletAddress(address)
      setIsConnected(true)
    } else {
      setAutoConnect(shouldAutoConnect())
    }
  }, [])

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setShowUsernameInput(true)
  }

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername)
      setIsConnected(true)
      localStorage.setItem(
        "chaingrid_user",
        JSON.stringify({
          username: tempUsername,
          address: walletAddress,
        }),
      )
      setShowUsernameInput(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setUsername("")
    setWalletAddress("")
    setTempUsername("")
    localStorage.removeItem("chaingrid_user")
  }

  const handleGameComplete = () => {
    setRefreshLeaderboard((prev) => prev + 1)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-sm slide-up">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bounce-in">ChainGrid</h1>
            <p className="text-yellow-300 text-xs sm:text-sm md:text-base">Daily Crypto Word Search</p>
            {isFarcaster && <p className="text-green-400 text-xs mt-2">Running in Farcaster</p>}
          </div>

          {!showUsernameInput ? (
            <div className="slide-down">
              <WalletConnect onConnect={handleWalletConnect} autoConnect={autoConnect} />
            </div>
          ) : (
            <div className="bg-gray-900 border-2 border-yellow-400 p-4 sm:p-6 rounded-lg slide-up">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">Enter Username</h2>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Your username"
                className="w-full bg-black border-2 border-yellow-400 text-yellow-400 p-2 sm:p-3 rounded mb-4 placeholder-yellow-600 text-transition focus:outline-none focus:border-yellow-300 text-sm sm:text-base"
                maxLength={20}
              />
              <Button
                onClick={handleUsernameSubmit}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 btn-transition text-sm sm:text-base py-2 sm:py-3"
              >
                Start Playing
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4 slide-down">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">ChainGrid</h1>
            <p className="text-yellow-300 text-xs sm:text-sm md:text-base">Welcome, {username}</p>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black bg-transparent btn-transition w-full sm:w-auto text-xs sm:text-sm md:text-base py-2 sm:py-3"
          >
            Disconnect
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* Game Board */}
          <div className="lg:col-span-2 slide-up">
            <GameBoard username={username} walletAddress={walletAddress} onGameComplete={handleGameComplete} />
          </div>

          {/* Leaderboard */}
          <div className="slide-up">
            <Leaderboard key={refreshLeaderboard} />
          </div>
        </div>

        <div className="text-center text-yellow-600 text-xs sm:text-sm py-3 sm:py-4 border-t border-yellow-900 fade-in">
          Powered by @aradeawardana97
        </div>
      </div>
    </div>
  )
}
