import { createAppKit } from 'https://esm.sh/@reown/appkit'
import { EthersAdapter } from 'https://esm.sh/@reown/appkit-adapter-ethers'
import { base } from 'https://esm.sh/@reown/appkit/networks'
import { ethers } from 'https://esm.sh/ethers@6.x'

const projectId = 'a5f9260bc9bca570190d3b01f477fc45';
const voteManagerCA = '0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8';
const sbtRewardCA = '0x5ba23E827e684F8171983461f1D0FC3b41bECbC3';

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [base],
  projectId
});

async function fetchContractData() {
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    
    // ABI minimal untuk read data
    const abi = ["function totalSupply() view returns (uint256)"];
    
    try {
        const voteContract = new ethers.Contract(voteManagerCA, abi, provider);
        const sbtContract = new ethers.Contract(sbtRewardCA, abi, provider);

        // Contoh: Ambil total data
        const totalVotes = await voteContract.totalSupply();
        const totalSBT = await sbtContract.totalSupply();

        document.getElementById('vote-count').innerText = totalVotes.toString();
        document.getElementById('sbt-issued').innerText = totalSBT.toString();
    } catch (err) {
        console.error("Data fetch failed", err);
    }
}

// Auto fetch on load
fetchContractData();
setInterval(fetchContractData, 30000); // Update every 30s
