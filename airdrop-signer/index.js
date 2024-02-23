const { ethers } = require("ethers");
const claimantAddresses = require('./addresses.json');
const fs = require('fs');

// Usage: bun run index.js

// Admin wallet private key
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
const adminWallet = new ethers.Wallet(adminPrivateKey)

async function signClaimantAddresses() {
    const results = []
    for (let address of claimantAddresses) {
        const hash = ethers.solidityPackedKeccak256(["address"], [address]);
        const signature = await adminWallet.signMessage(ethers.getBytes(hash));

        console.log(`Address: ${address}`);
        console.log(`Hash: ${hash}`);
        console.log(`Signature: ${signature}`);
        console.log('-----------------------');

        results.push({
            address:address.toLowerCase(),
            hash,
            signature
        });
    }

    // Save the results to a file
    fs.writeFileSync('signatures.json', JSON.stringify(results, null, 2));
}

signClaimantAddresses().catch(console.error);
