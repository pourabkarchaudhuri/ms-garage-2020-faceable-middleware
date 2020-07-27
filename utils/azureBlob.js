const {
    StorageSharedKeyCredential,
    BlobServiceClient
    } = require('@azure/storage-blob');
const {AbortController} = require('@azure/abort-controller')

const fs = require("fs");
const path = require("path");
const getStream = require('into-stream');

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;


console.log(ACCOUNT_ACCESS_KEY);
const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

async function uploadLocalFile(containerClient, buffer, mimeType, fileName) {
    // filePath = path.resolve(filePath);

    // const fileName = path.basename(filePath);

    // const blobClient = containerClient.getBlobClient(fileName);
    // const blockBlobClient = blobClient.getBlockBlobClient();
    // const containerClient = blobServiceClient.getContainerClient("facelock");;
    console.log(mimeType);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName + '.jpeg');
    const stream = getStream(buffer);

    // return await blockBlobClient.uploadFile(filePath,aborter);
    return await blockBlobClient.uploadStream(stream,  uploadOptions.bufferSize, uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: 'image/jpeg' } })
}

async function execute(buffer, mimeType, filename, containerName) {

    // const containerName = "facelock";
    // const localFilePath = "./README.md";

    const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

    const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,credentials);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    // const blobClient = containerClient.getBlobClient(blobName);
    // const blockBlobClient = blobClient.getBlockBlobClient();
    
    const aborter = AbortController.timeout(30 * ONE_MINUTE);
    
    
    const result = await uploadLocalFile(containerClient, buffer, mimeType, filename);
    console.log(`Local file is uploaded`);
    return result;
}

// execute().then(() => console.log("Done")).catch((e) => console.log(e));

exports.upload = async (buffer, mimeType, filename, containerName) => {
   const uploadResult = await execute(buffer, mimeType, filename, containerName);
   return uploadResult;
}