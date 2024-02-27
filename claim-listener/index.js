const AWS = require('aws-sdk');
const ethers = require('ethers');

// Configure the S3 client to use Cloudflare's endpoint
const s3 = new AWS.S3({
    region: 'enam', // This might need to be adjusted based on your Cloudflare setup
    endpoint: process.env.S3_ENDPOINT, // Cloudflare S3 endpoint
    accessKeyId: process.env.ACCESS_KEY, // Your Cloudflare access key
    secretAccessKey: process.env.SECRET_KEY // Your Cloudflare secret key
  });

// edge case: if the recipient is the owner, we don't want to copy the image
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

const BUCKET_NAME = "imaginaries";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    }
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);

contract.on('Claimed', async (recipient, tokenId, event) => {
    if (recipient.toLowerCase() === OWNER_ADDRESS.toLowerCase()) {
        console.log(`Recipient is the owner, skipping: recipient=${recipient}, tokenId=${tokenId}`);
        return;
    }
    handleClaimed(recipient, tokenId, event);
});

function handleClaimed(recipient, tokenId, event) {
    console.log(`Claimed event received: recipient=${recipient}, tokenId=${tokenId}`);
    recipient = recipient.toLowerCase();

    const metadata = {
        "name": "Heurist Imaginaries",
        "description": "A gift for early supporters of Heurist. Imaginaries are a collection of 500 NFTs generated by Stable Diffusion models on https://imagine.heurist.ai",
        "image": `https://imaginaries.heurist.ai/${tokenId}.png`
    }

    const jsonString = JSON.stringify(metadata);

    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `${tokenId}`, // fix: no .json
        Body: jsonString,
        ContentType: "application/json"
    };

    s3.putObject(uploadParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Upload succeeded", data);
        }
    });

    const copyParams = {
        CopySource: `${BUCKET_NAME}/${recipient}.png`,
        Bucket: BUCKET_NAME,
        Key: `${tokenId}.png`
    };

    s3.copyObject(copyParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("CopyObject succeeded", data);
        }
    });
}