const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Import the os module

// Configure the S3 client
const s3 = new AWS.S3({
    region: 'enam', // This might need to be adjusted based on your Cloudflare setup
    endpoint: process.env.S3_ENDPOINT, // Cloudflare S3 endpoint
    accessKeyId: process.env.ACCESS_KEY, // Your Cloudflare access key
    secretAccessKey: process.env.SECRET_KEY // Your Cloudflare secret key
  });

  const BUCKET_NAME = "imaginaries";
const DIRECTORY_PATH = path.join(os.homedir(), 'dev', 'miners_img'); // Use os.homedir() to get the home directory

async function uploadPngFilesToS3() {
    try {
        const files = fs.readdirSync(DIRECTORY_PATH);
        console.log(`Length: ${files.length}`)
        for (const file of files) {
            console.log(`Processing file: ${file}`)
            if (path.extname(file) === '.png') {
                const filePath = path.join(DIRECTORY_PATH, file);
                const objectName = path.basename(file).toLowerCase();
            
                // Function to check and upload a single file
                const checkAndUploadFile = async () => {
                    const params = {
                        Bucket: BUCKET_NAME,
                        Key: objectName
                    };
            
                    try {
                        await s3.headObject(params).promise();
                        console.log(`File ${objectName} already exists in S3, skipping upload.`);
                    } catch (error) {
                        if (error.code === 'NotFound') {
                            const uploadParams = {
                                Bucket: BUCKET_NAME,
                                Key: objectName,
                                Body: fs.createReadStream(filePath),
                                ContentType: 'image/png'
                            };
                            await s3.upload(uploadParams).promise();
                            console.log(`File ${objectName} uploaded to S3.`);
                        } else {
                            console.error(`Error with file ${objectName}: ${error}`);
                        }
                    }
                };
            
                // Call the function and handle errors locally
                checkAndUploadFile().catch(error => {
                    console.error(`Failed to process file ${objectName}: ${error}`);
                });
            }
        }
    } catch (error) {
        console.log(`Error reading directory or uploading files: ${error}`);
    }
}

uploadPngFilesToS3();