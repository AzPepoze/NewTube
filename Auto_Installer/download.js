const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// Replace with your repository details
const repoOwner = 'AzPepoze';
const repoName = 'NewTube';
const branchName = 'main'; // Change to the desired branch
const zipFileName = 'NT_Chrome.zip'; // Name of the zip file to download
const outputFolder = 'NT_Chrome';

// GitHub API URL for the raw content of the zip file
const zipFileUrl = `https://github.com/${repoOwner}/${repoName}/raw/${branchName}/${zipFileName}`;

// Function to download a file
async function downloadFile(url, filePath) {
    const writer = fs.createWriteStream(filePath);

    return axios({
        method: 'get',
        url: url,
        responseType: 'stream',
    }).then(response => {
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    });
}

// Function to extract a zip file
function extractZip(zipFilePath, outputDir) {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);
    fs.unlinkSync(zipFilePath);
}

// Create output folder if not exists
const outputDir = path.join(__dirname, outputFolder);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const zipFilePath = path.join(outputDir, zipFileName);

downloadFile(zipFileUrl, zipFilePath)
    .then(() => {
        console.log(`Downloaded ${zipFileName}`);

        // Extract the downloaded zip file
        extractZip(zipFilePath, outputDir);

        console.log(`Successfully extracted ${zipFileName}`);
    })
    .catch(err => {
        console.error(`Error downloading ${zipFileName}: ${err.message}`);
        if (fs.existsSync(zipFilePath)) {
            fs.unlinkSync(zipFilePath);
        }
    });
