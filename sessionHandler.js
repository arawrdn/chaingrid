import { ethers } from 'ethers';

export const createGameSession = async (mainSigner, sessionManagerAddress) => {
    // 1. Generate an ephemeral (temporary) wallet
    const ephemeralWallet = ethers.Wallet.createRandom();
    
    // 2. Define session duration (e.g., 1 hour)
    const duration = 3600; 

    const abi = ["function createSession(address _sessionKey, uint256 _duration) external"];
    const contract = new ethers.Contract(sessionManagerAddress, abi, mainSigner);

    // 3. Register the session key on-chain
    const tx = await contract.createSession(ephemeralWallet.address, duration);
    await tx.wait();

    // 4. Store the private key in sessionStorage (temporary browser memory)
    sessionStorage.setItem('fof_session_key', ephemeralWallet.privateKey);
    
    return ephemeralWallet.address;
};

export const getSessionSigner = (provider) => {
    const privKey = sessionStorage.getItem('fof_session_key');
    if (!privKey) return null;
    return new ethers.Wallet(privKey, provider);
};
