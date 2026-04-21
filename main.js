import { ethers } from 'https://esm.sh/ethers@6.10.0';

// CONFIG
const RPC_URL = "https://forno.celo.org";

const voteManagerCA = "0xBd24A97F05220d51c927FB36cF77bB83EfEa8d61";
const sbtRewardCA = "0x6B5f897Ad13B04Fccd172189Cb0E5C6487437FAc";

// ABI minimal + flexible
const ABI = [
  "function totalSupply() view returns (uint256)",
  "function totalVotes() view returns (uint256)",
  "function getTotalVotes() view returns (uint256)",
  "function vote()",
  "function castVote()"
];

let currentAccount = null;

// ================= WALLET =================

window.connectWallet = async function () {
  if (!window.ethereum) {
    document.getElementById("warning").innerText =
      "Open this app in MiniPay";
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa4ec" }]
    });

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    currentAccount = accounts[0];
    updateWalletUI();

  } catch (err) {
    console.error(err);
    setStatus("Wallet connection failed");
  }
};

function updateWalletUI() {
  const el = document.getElementById("wallet-address");

  if (!currentAccount) {
    el.innerText = "Not Connected";
    return;
  }

  el.innerText =
    currentAccount.slice(0,6) + "..." + currentAccount.slice(-4);
}

// ================= STATUS =================

function setStatus(text) {
  document.getElementById("status").innerText = text;
}

// ================= AUTO CONNECT =================

window.addEventListener("load", async () => {
  if (!window.ethereum) {
    document.getElementById("warning").innerText =
      "Open this app in MiniPay";
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_accounts"
  });

  if (accounts.length > 0) {
    currentAccount = accounts[0];
    updateWalletUI();
  }

  fetchData();
});

// ================= CONTRACT READ =================

async function safeCall(contract, method) {
  try {
    if (contract[method]) {
      const res = await contract[method]();
      return res.toString();
    }
  } catch (e) {}
  return null;
}

async function fetchData() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const vote = new ethers.Contract(voteManagerCA, ABI, provider);
    const sbt = new ethers.Contract(sbtRewardCA, ABI, provider);

    const voteValue =
      await safeCall(vote, "totalVotes") ||
      await safeCall(vote, "getTotalVotes") ||
      await safeCall(vote, "totalSupply") ||
      "--";

    const sbtValue =
      await safeCall(sbt, "totalSupply") ||
      "--";

    document.getElementById("vote-count").innerText = voteValue;
    document.getElementById("sbt-issued").innerText = sbtValue;

  } catch (err) {
    console.error(err);
    setStatus("Failed to load data");
  }
}

setInterval(fetchData, 15000);

// ================= VOTE =================

window.vote = async function () {
  if (!currentAccount) {
    setStatus("Connect wallet first");
    return;
  }

  try {
    setStatus("Waiting for confirmation...");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(voteManagerCA, ABI, signer);

    let tx;

    if (contract.vote) {
      tx = await contract.vote();
    } else if (contract.castVote) {
      tx = await contract.castVote();
    } else {
      throw new Error("No vote function found");
    }

    setStatus("Transaction sent...");

    await tx.wait();

    setStatus("Vote success ✅");

    fetchData();

  } catch (err) {
    console.error(err);
    setStatus("Vote failed ❌");
  }
};
