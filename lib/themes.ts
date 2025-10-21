export interface Theme {
  name: string
  clues: string[]
  words: string[]
}

export const DAILY_THEMES: Theme[] = [
  {
    name: "Trade",
    clues: ["Positive sentiment", "Technical indicator", "Price surge", "Exit scam", "Bearish action"],
    words: ["BULLISH", "SIGNAL", "PUMP", "RUG", "SELLING"],
  },
  {
    name: "Blockchain",
    clues: ["Layer 2 solution", "Binance chain", "Ethereum", "New L2", "African blockchain"],
    words: ["POLYGON", "BSC", "ETHEREUM", "BASE", "CELO"],
  },
  {
    name: "Web3",
    clues: ["Crypto storage", "Decentralized app", "Code execution", "Digital asset", "Distributed ledger"],
    words: ["WALLET", "DAPP", "SMART", "TOKEN", "CHAIN"],
  },
  {
    name: "NFT",
    clues: ["Create NFT", "Digital art", "Lowest price", "New release", "Uncommon item"],
    words: ["MINT", "ART", "FLOOR", "DROP", "RARE"],
  },
  {
    name: "Meme",
    clues: ["Shiba Inu", "Frog meme", "Sad wojak", "Price increase", "Price decrease"],
    words: ["DOGE", "PEPE", "WOJAK", "PUMP", "DIP"],
  },
  {
    name: "Market",
    clues: ["Price chart", "Trading volume", "Large holders", "Entry point", "OHLC visualization"],
    words: ["CANDLE", "CHART", "VOLUME", "WHALES", "ENTRY"],
  },
  {
    name: "Security",
    clues: ["Rug pull", "Fraudulent scheme", "Code review", "Key storage", "Confidence"],
    words: ["RUG", "SCAM", "AUDIT", "WALLET", "TRUST"],
  },
  {
    name: "Exchange",
    clues: ["Trade instruction", "Trading pair", "Cash trading", "Leverage trading", "Integration interface"],
    words: ["ORDER", "PAIR", "SPOT", "MARGIN", "API"],
  },
  {
    name: "DeFi",
    clues: ["Loan protocol", "Borrow funds", "Lock tokens", "Interest earnings", "Yield farming"],
    words: ["LEND", "BORROW", "STAKE", "YIELD", "FARM"],
  },
  {
    name: "Layer2",
    clues: ["Ethereum scaling", "Arbitrum", "Optimistic rollup", "Zero-knowledge", "Scroll network"],
    words: ["BASE", "ARBITRUM", "OPTIMISM", "ZKSYNC", "SCROLL"],
  },
  {
    name: "Metaverse",
    clues: ["Virtual property", "Digital identity", "Gaming world", "In-game currency", "Create content"],
    words: ["LAND", "AVATAR", "GAME", "TOKEN", "BUILD"],
  },
  {
    name: "Airdrop",
    clues: ["Receive tokens", "Complete action", "Reward system", "Wallet address", "Passive income"],
    words: ["CLAIM", "TASK", "POINTS", "WALLET", "EARN"],
  },
  {
    name: "Tokenomics",
    clues: ["Total coins", "Burn tokens", "Create tokens", "Market cap", "Incentive system"],
    words: ["SUPPLY", "BURN", "MINT", "CAP", "REWARD"],
  },
  {
    name: "Onchain",
    clues: ["Blockchain transaction", "Gas cost", "Transaction fee", "Data block", "Confirm transaction"],
    words: ["TX", "GAS", "FEE", "BLOCK", "VERIFY"],
  },
  {
    name: "GasFee",
    clues: ["Minimum fee", "Transaction limit", "Urgent fee", "Blockchain transaction", "Data block"],
    words: ["BASEFEE", "LIMIT", "PRIORITY", "TX", "BLOCK"],
  },
  {
    name: "Stablecoin",
    clues: ["Tether", "USD Coin", "Decentralized stablecoin", "Price stability", "Fiat currency"],
    words: ["USDT", "USDC", "DAI", "PEG", "FIAT"],
  },
  {
    name: "Bullrun",
    clues: ["All-time high", "Moon price", "Green candles", "Fear of missing out", "Price surge"],
    words: ["ATH", "MOON", "GREEN", "FOMO", "RALLY"],
  },
  {
    name: "Bearish",
    clues: ["Red candles", "Price dump", "Market fear", "Panic selling", "Recovery phase"],
    words: ["RED", "DUMP", "FEAR", "CAPITULATE", "REBOUND"],
  },
  {
    name: "Wallet",
    clues: ["Secret key", "Cryptographic key", "Public address", "Secure storage", "Recovery phrase"],
    words: ["PRIVATE", "KEY", "ADDRESS", "SAFE", "SEED"],
  },
  {
    name: "Launchpad",
    clues: ["New venture", "Token sale", "Digital asset", "Initial offering", "Early access"],
    words: ["PROJECT", "SALE", "TOKEN", "PUBLIC", "WHITELIST"],
  },
  {
    name: "Degen",
    clues: ["High risk", "Meme coin", "Price surge", "Price crash", "Risky investment"],
    words: ["GAMBLE", "MEME", "PUMP", "DUMP", "APE"],
  },
  {
    name: "CEX",
    clues: ["Binance", "OKX", "Bybit", "Kucoin", "Gate.io"],
    words: ["BINANCE", "OKX", "BYBIT", "KUCOIN", "GATE"],
  },
  {
    name: "DEX",
    clues: ["Uniswap", "Sushiswap", "Token exchange", "Liquidity", "Trading pool"],
    words: ["UNISWAP", "SUSHI", "SWAP", "LIQUIDITY", "POOL"],
  },
  {
    name: "Validator",
    clues: ["Network computer", "Lock tokens", "Earn rewards", "Blockchain network", "Authorize transaction"],
    words: ["NODE", "STAKE", "REWARD", "CHAIN", "SIGN"],
  },
  {
    name: "Mining",
    clues: ["Graphics processor", "Electricity", "Computational work", "Data block", "Incentive"],
    words: ["GPU", "POWER", "HASH", "BLOCK", "REWARD"],
  },
  {
    name: "Community",
    clues: ["Decentralized organization", "Discussion board", "Chat platform", "Voting system", "Collaboration"],
    words: ["DAO", "FORUM", "DISCORD", "VOTE", "SHARE"],
  },
  {
    name: "GameFi",
    clues: ["Interactive game", "Earn tokens", "Digital asset", "Mission", "Collectible"],
    words: ["PLAY", "EARN", "TOKEN", "QUEST", "NFT"],
  },
  {
    name: "Alpha",
    clues: ["Insider information", "Trading signal", "Private group", "Early access", "Market insight"],
    words: ["LEAK", "CALL", "GROUP", "ENTRY", "SIGNAL"],
  },
  {
    name: "AirdropHunter",
    clues: ["Receive tokens", "Wallet address", "Experience points", "Complete action", "Passive income"],
    words: ["CLAIM", "WALLET", "XP", "TASK", "FARM"],
  },
]
