export async function initFarcasterSDK() {
  try {
    if (typeof window === "undefined") return

    // Check if SDK is already loaded
    if ((window as any).FarcasterMiniApp) {
      handleFarcasterSDKReady()
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk@latest"
    script.async = true

    script.onload = () => {
      handleFarcasterSDKReady()
    }

    script.onerror = () => {
      console.log("[v0] Could not load Farcaster SDK - continuing without it")
    }

    document.head.appendChild(script)
  } catch (error) {
    console.log("[v0] Error initializing Farcaster SDK:", error)
  }
}

function handleFarcasterSDKReady() {
  try {
    const sdk = (window as any).FarcasterMiniApp

    if (sdk && sdk.ready) {
      sdk.ready()
    }

    if (sdk && sdk.context) {
      sdk
        .context()
        .then((context: any) => {
          if (context && context.user && context.user.wallet) {
            sessionStorage.setItem("farcasterWallet", JSON.stringify(context.user.wallet))
            sessionStorage.setItem("farcasterUser", JSON.stringify(context.user))
          }
        })
        .catch((error: any) => {
          console.log("[v0] Could not get Farcaster context:", error)
        })
    }
  } catch (error) {
    console.log("[v0] Farcaster SDK not available in this context")
  }
}

export function isFarcasterMiniapp(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).FarcasterMiniApp
}

export async function getFarcasterWalletContext(): Promise<any> {
  try {
    // First check if we have cached context
    const cached = sessionStorage.getItem("farcasterWallet")
    if (cached) {
      return JSON.parse(cached)
    }

    const sdk = (window as any).FarcasterMiniApp
    if (sdk && sdk.context) {
      const context = await sdk.context()
      if (context?.user?.wallet) {
        sessionStorage.setItem("farcasterWallet", JSON.stringify(context.user.wallet))
        return context.user.wallet
      }
    }
  } catch (error) {
    console.log("[v0] Could not get Farcaster wallet context:", error)
  }
  return null
}

export async function getFarcasterUser(): Promise<any> {
  try {
    const cached = sessionStorage.getItem("farcasterUser")
    if (cached) {
      return JSON.parse(cached)
    }

    const sdk = (window as any).FarcasterMiniApp
    if (sdk && sdk.context) {
      const context = await sdk.context()
      if (context?.user) {
        sessionStorage.setItem("farcasterUser", JSON.stringify(context.user))
        return context.user
      }
    }
  } catch (error) {
    console.log("[v0] Could not get Farcaster user:", error)
  }
  return null
}

export async function openFarcasterProfile(fid: number) {
  try {
    const sdk = (window as any).FarcasterMiniApp
    if (sdk && sdk.viewProfile) {
      await sdk.viewProfile({ fid })
    }
  } catch (error) {
    console.log("[v0] Could not open Farcaster profile:", error)
  }
}

export async function composeFarcasterCast(text: string) {
  try {
    const sdk = (window as any).FarcasterMiniApp
    if (sdk && sdk.composeCast) {
      await sdk.composeCast({ text })
    }
  } catch (error) {
    console.log("[v0] Could not compose cast:", error)
  }
}

export async function closeFarcasterMiniapp() {
  try {
    const sdk = (window as any).FarcasterMiniApp
    if (sdk && sdk.close) {
      await sdk.close()
    }
  } catch (error) {
    console.log("[v0] Could not close miniapp:", error)
  }
}
