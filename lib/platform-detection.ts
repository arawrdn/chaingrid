export interface PlatformInfo {
  isWalletApp: boolean
  walletAppName: string | null
  isChromeOnly: boolean
  browserName: string
}

export function detectPlatform(): PlatformInfo {
  if (typeof window === "undefined") {
    return {
      isWalletApp: false,
      walletAppName: null,
      isChromeOnly: false,
      browserName: "unknown",
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  let walletAppName: string | null = null
  let isWalletApp = false

  // Detect wallet apps
  if (userAgent.includes("okxwallet") || userAgent.includes("okx")) {
    walletAppName = "OKX"
    isWalletApp = true
  } else if (userAgent.includes("rainbow")) {
    walletAppName = "Rainbow"
    isWalletApp = true
  } else if (userAgent.includes("farcaster")) {
    walletAppName = "Farcaster"
    isWalletApp = true
  } else if (userAgent.includes("bitget")) {
    walletAppName = "Bitget"
    isWalletApp = true
  } else if (userAgent.includes("metamask")) {
    walletAppName = "MetaMask"
    isWalletApp = true
  } else if (userAgent.includes("trust")) {
    walletAppName = "Trust Wallet"
    isWalletApp = true
  }

  // Detect browser
  let browserName = "Unknown"
  if (userAgent.includes("chrome") && !userAgent.includes("chromium")) {
    browserName = "Chrome"
  } else if (userAgent.includes("safari")) {
    browserName = "Safari"
  } else if (userAgent.includes("firefox")) {
    browserName = "Firefox"
  } else if (userAgent.includes("edge")) {
    browserName = "Edge"
  }

  return {
    isWalletApp,
    walletAppName,
    isChromeOnly: browserName !== "Chrome" && !isWalletApp,
    browserName,
  }
}

export function shouldAutoConnect(): boolean {
  const platform = detectPlatform()
  return platform.isWalletApp
}

export function shouldShowWalletPopup(): boolean {
  const platform = detectPlatform()
  return platform.isChromeOnly
}
