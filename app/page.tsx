"use client"

import { useState, useEffect } from "react"
import WalletConnect from "@/components/wallet-connect"
import GameBoard from "@/components/game-board"
import Leaderboard from "@/components/leaderboard"
import { Button } from "@/components/ui/button"
import { shouldAutoConnect } from "@/lib/platform-detection"
import { initFarcasterSDK, isFarcasterMiniapp } from "@/lib/farcaster-sdk"

export default function Home() {
  // State untuk menangani Hydration (Wajib untuk Next.js 15)
  const [hasMounted, setHasMounted] = useState(false)
  
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0)
  const [autoConnect, setAutoConnect] = useState(false)
  const [isFarcaster, setIsFarcaster] = useState(false)

  useEffect(() => {
    // Tandai bahwa komponen sudah terpasang di browser
    setHasMounted(true)

    // Inisialisasi SDK
    initFarcasterSDK()
    setIsFarcaster(isFarcasterMiniapp())

    // Cek Session
    const stored = localStorage.getItem("chaingrid_user")
    if (stored) {
      try {
        const { username, address } = JSON.parse(stored)
        setUsername(username)
        setWalletAddress(address)
        setIsConnected(true)
      } catch (e) {
        localStorage.removeItem("chaingrid_user")
      }
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
      const newUser = {
        username: tempUsername.trim(),
        address: walletAddress,
      }
      setUsername(newUser.username)
      setIsConnected(true)
      localStorage.setItem("chaingrid_user", JSON.stringify(newUser))
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

  // JANGAN me-render apapun sebelum mounted untuk menghindari Hydration Error
  if (!hasMounted) {
    return <div className="min-h-screen bg-black" /> 
  }

  // Tampilan jika Belum Connect
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tighter italic">ChainGrid</h1>
            <p className="text-yellow-300/80 text-xs sm:text-sm uppercase tracking-widest">Daily Crypto Word Search</p>
            {isFarcaster && (
              <div className="mt-3 inline-block bg-purple-900/30 border border-purple-500/50 px-3 py-1 rounded-full">
                <p className="text-purple-400 text-[10px] font-bold uppercase">Farcaster Mode</p>
              </div>
            )}
          </div>

          {!showUsernameInput ? (
            <div className="space-y-4">
              <WalletConnect onConnect={handleWalletConnect} autoConnect={autoConnect} />
            </div>
          ) : (
            <div className="bg-zinc-900 border-2 border-yellow-400 p-6 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <h2 className="text-lg font-bold mb-4 text-white text-center">Set Your Game Profile</h2>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full bg-black border-2 border-yellow-400/50 text-yellow-400 p-3 rounded-lg mb-4 placeholder-yellow-800 focus:outline-none focus:border-yellow-400 transition-all text-center font-bold"
                maxLength={15}
              />
              <Button
                onClick={handleUsernameSubmit}
                disabled={!tempUsername.trim()}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 py-6 text-lg transition-transform active:scale-95"
              >
                START PLAYING
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Tampilan Dashboard Game (Jika sudah Connect)
  return (
    <div className="min-h-screen bg-black text-yellow-400 p-3 sm:p-4 md:p-6 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-yellow-400/20 pb-6">
          <div>
            <h1 className="text-3xl font-bold italic tracking-tighter">ChainGrid</h1>
            <p className="text-yellow-300/70 text-sm italic">Playing as <span className="text-yellow-400 font-bold">{username}</span></p>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black bg-transparent w-full sm:w-auto px-6"
          >
            Log Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Game Board Section */}
          <div className="lg:col-span-2">
            <GameBoard username={username} walletAddress={walletAddress} onGameComplete={handleGameComplete} />
          </div>

          {/* Leaderboard Section */}
          <div className="w-full">
            <Leaderboard key={refreshLeaderboard} />
          </div>
        </div>

        <footer className="text-center text-yellow-700 text-[10px] sm:text-xs py-8 uppercase tracking-widest opacity-50">
          Built for the Base Ecosystem • @aradeawardana97
        </footer>
      </div>
    </div>
  )
}
