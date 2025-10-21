"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { detectPlatform } from "@/lib/platform-detection"
import { isFarcasterMiniapp, getFarcasterWalletContext } from "@/lib/farcaster-sdk"

interface WalletConnectProps {
  onConnect: (address: string) => void
  autoConnect?: boolean
}

export default function WalletConnect({ onConnect, autoConnect = false }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [platform, setPlatform] = useState<ReturnType<typeof detectPlatform> | null>(null)

  useEffect(() => {
    setIsClient(true)
    const detectedPlatform = detectPlatform()
    setPlatform(detectedPlatform)

    if (autoConnect && (detectedPlatform.isWalletApp || isFarcasterMiniapp())) {
      setTimeout(() => {
        handleConnect()
      }, 500)
    }
  }, [autoConnect])

  const handleConnect = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (isFarcasterMiniapp()) {
        const farcasterWallet = await getFarcasterWalletContext()
        if (farcasterWallet && farcasterWallet.address) {
          onConnect(farcasterWallet.address)
          setIsLoading(false)
          return
        }
      }

      if (!window.ethereum) {
        setError("No wallet found. Please install MetaMask or use WalletConnect.")
        setIsLoading(false)
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts && accounts.length > 0) {
        const address = accounts[0]

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })

        const baseChainId = "0x2105"
        const celoChainId = "0xa4ec"

        if (chainId !== baseChainId && chainId !== celoChainId) {
          setError("Please switch to Base or Celo network")
          setIsLoading(false)
          return
        }

        onConnect(address)
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
      setIsLoading(false)
    }
  }

  if (!isClient || !platform) return null

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>

        {isFarcasterMiniapp() && (
          <p className="text-green-400 text-sm mb-4">✓ Detected Farcaster - Auto-connecting with Farcaster wallet...</p>
        )}

        {platform.isWalletApp && !isFarcasterMiniapp() && (
          <p className="text-green-400 text-sm mb-4">✓ Detected {platform.walletAppName} - Auto-connecting...</p>
        )}

        {platform.isChromeOnly && (
          <p className="text-orange-400 text-sm mb-4">
            💡 For best experience, use Chrome browser or open from a wallet app
          </p>
        )}

        <p className="text-yellow-300 text-sm mb-6">Connect your wallet to start playing ChainGrid</p>

        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>

      <p className="text-yellow-600 text-xs text-center">Only Base and Celo networks are supported</p>
    </div>
  )
}
