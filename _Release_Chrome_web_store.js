const fs = require('fs');

let ChromeWebstoreUpload;

async function loadChromeWebstoreUpload() {
     const module = await import('chrome-webstore-upload');
     ChromeWebstoreUpload = module.default;
}

let clientId, clientSecret, refreshToken;

function Set_CLIENT_ID(id) {
     clientId = id;
}

function Set_CLIENT_SECRET(secret) {
     clientSecret = secret;
}

function Set_REFRESH_TOKEN(token) {
     refreshToken = token;
}

async function updateExtension(extensionId, Extension_Zip) {
     if (!clientId || !clientSecret || !refreshToken) {
          console.error('Please set client ID, client secret, and refresh token before updating the extension.');
          return;
     }

     try {
          await loadChromeWebstoreUpload();
          const uploader = new ChromeWebstoreUpload({
               extensionId,
               clientId,
               clientSecret,
               refreshToken
          });

          // Upload the extension
          await uploader.uploadExisting(fs.createReadStream(Extension_Zip));
          console.log('Extension uploaded successfully!');

          // Publish the extension
          await uploader.publish();
          console.log('Extension published successfully!');
     } catch (error) {
          console.error('Error updating extension:', error);
     }
}


const Chrome_web_store_keys = require('./_API_KEYS.json').Chrome_web_store;
Set_CLIENT_ID(Chrome_web_store_keys.CLIENT_ID);
Set_CLIENT_SECRET(Chrome_web_store_keys.CLIENT_SECRET);
Set_REFRESH_TOKEN(Chrome_web_store_keys.REFRESH_TOKEN);

const extensionId = 'dnjjchajjdnfbjhjclmilicgheglcopj';
const Extension_Zip = './release/Chromium.zip';

updateExtension(extensionId, Extension_Zip);
