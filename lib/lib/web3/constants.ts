import { base, celo, Chain } from 'wagmi/chains';

// 1. FINAL ABI
// ABI dari Leaderboard.sol yang Anda dapatkan
export const LEADERBOARD_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "player", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256" }
		],
		"name": "ScoreSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"name": "bestScores",
		"outputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPlayers",
		"outputs": [
			{ "internalType": "address[]", "name": "", "type": "address[]" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"name": "players",
		"outputs": [
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "newScore", "type": "uint256" }
		],
		"name": "submitScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// 2. FINAL CONTRACT ADDRESSES
// Menggunakan CA yang Anda berikan untuk Base Mainnet (8453) dan Celo Mainnet (42220)
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
    [base.id]: "0xbe9694C20CBE0B28b0fDC7365a80be36b9520126", // Base CA
    [celo.id]: "0x4641A6a6E03937E995E89386EAD65cE347b41799", // Celo CA
};

export const SUPPORTED_CHAINS: readonly [Chain, ...Chain[]] = [base, celo];
