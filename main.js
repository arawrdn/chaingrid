import { ethers } from 'https://esm.sh/ethers@6.10.0';

// ================= CONFIG =================

const RPC_URL = "https://forno.celo.org";

const voteManagerCA = "0xBd24A97F05220d51c927FB36cF77bB83EfEa8d61";
const sbtRewardCA = "0x6B5f897Ad13B04Fccd172189Cb0E5C6487437FAc";

const ABI = [
  "function totalSupply() view returns (uint256)",
  "function getTotalVotes() view returns (uint256)",
  "function totalVotes() view returns (uint256)"
];

let currentAccount = null;

// ================= WALLET =================

window.connectWallet = async function () {
  if (!window.ethereum) {
    alert("Open this in MiniPay or Opera Mini");
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

    if (err.code === 4001) {
      alert("User rejected connection");
    } else {
      alert("Wallet error");
    }
  }
};

function updateWalletUI() {
  const el = document.getElementById("wallet-address");

  if (!currentAccount) {
    el.innerText = "Not Connected";
    return;
  }

  el.innerText =
    currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
}

// ================= AUTO CONNECT =================

window.addEventListener("load", async () => {
  if (!window.ethereum) return;

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts"
    });

    if (accounts.length > 0) {
      currentAccount = accounts[0];
      updateWalletUI();
    }

    fetchContractData();

  } catch (err) {
    console.error("Auto connect error:", err);
  }
});

// ================= CONTRACT READ =================

async function safeRead(contract, methodName) {
  try {
    if (contract[methodName]) {
      const result = await contract[methodName]();
      return result.toString();
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function fetchContractData() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const voteContract = new ethers.Contract(voteManagerCA, ABI, provider);
    const sbtContract = new ethers.Contract(sbtRewardCA, ABI, provider);

    let voteValue =
      await safeRead(voteContract, "totalSupply") ||
      await safeRead(voteContract, "getTotalVotes") ||
      await safeRead(voteContract, "totalVotes") ||
      "--";

    let sbtValue =
      await safeRead(sbtContract, "totalSupply") ||
      "--";

    document.getElementById("vote-count").innerText = voteValue;
    document.getElementById("sbt-issued").innerText = sbtValue;

  } catch (err) {
    console.error("Fetch error:", err);

    document.getElementById("vote-count").innerText = "--";
    document.getElementById("sbt-issued").innerText = "--";
  }
}

// ================= AUTO REFRESH =================

setInterval(fetchContractData, 15000);

// ================= TRANSACTION =================

window.sendCUSD = async function () {
  if (!currentAccount) {
    alert("Connect wallet first");
    return;
  }

  const cUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  try {
    const to = prompt("Enter recipient address:");
    if (!to) return;

    const amount =
      "000000000000000000000000000000000000000000000000016345785d8a0000";

    const data =
      "0xa9059cbb" +
      to.replace("0x", "").padStart(64, "0") +
      amount;

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: currentAccount,
        to: cUSD,
        data
      }]
    });

    alert("Transaction sent");

  } catch (err) {
    console.error(err);
    alert("Transaction failed");
  }
};
