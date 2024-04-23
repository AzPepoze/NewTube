(async () => {
     const fs = require('fs-extra');
     const path = require('path');
     const terser = require('terser');
     const AdmZip = require('adm-zip');

     // Terser options
     const terserOptions = {
          compress: {
               unused: false
          },
          mangle: {
               keep_fnames: true,
               toplevel: false
          }
     }

     // Function to copy files recursively from source directory to destination directory
     async function copyFiles(sourceDir, destDir) {
          try {
               await fs.mkdirp(destDir);

               const files = await fs.readdir(sourceDir);

               for (const file of files) {
                    const sourcePath = path.join(sourceDir, file);
                    const destPath = path.join(destDir, file);

                    if ((await fs.stat(sourcePath)).isDirectory()) {
                         await copyFiles(sourcePath, destPath); // Recursively copy subdirectories
                    } else {
                         await fs.copyFile(sourcePath, destPath);
                         console.log(`Copied: ${sourcePath} to ${destPath}`);

                         // If it's a JavaScript file, minify it
                         if (file.endsWith('.js')) {
                              await minifyFile(destPath);
                         }
                    }
               }

               console.log(`All files copied successfully from ${sourceDir} to ${destDir}`);
          } catch (error) {
               console.error('Error:', error);
          }
     }

     // Function to minify a JavaScript file
     async function minifyFile(filePath) {
          try {
               const fileContent = await fs.readFile(filePath, 'utf8');
               const minified = await terser.minify(fileContent, terserOptions);
               await fs.writeFile(filePath, minified.code);
               console.log(`Minified: ${filePath}`);
          } catch (error) {
               console.error('Error minifying file:', error);
          }
     }

     // Copy all files from src folder to dist/Chromium folder and then minify JavaScript files
     await copyFiles('src', 'dist/Chromium');

     //--------------------------------------------------------------------------

     const sourceDir = 'dist/Chromium';
     const destinationDir = 'dist/Firefox';

     // Ensure the source directory exists
     if (!fs.existsSync(sourceDir)) {
          console.error(`Source directory ${sourceDir} does not exist.`);
          return;
     }

     // Ensure the destination directory exists
     if (!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir, { recursive: true });
     }

     // Clone the folder recursively
     fs.copySync(sourceDir, destinationDir);

     console.log(`Folder cloned successfully from ${sourceDir} to ${destinationDir}.`);

     //--------------------------------------------------------------------------

     // Replace text in the manifest.json file

     const manifestPath = 'dist/Firefox/manifest.json';

     // Function to update manifest file
     function updateManifest() {
          return new Promise((resolve, reject) => {
               fs.readFile(manifestPath, 'utf8', (err, data) => {
                    if (err) {
                         reject(err);
                         return;
                    }

                    // Replace text in the manifest content
                    data = data.replace(/"service_worker": "scripts\/Background.js"/g, '"scripts": ["scripts/Background.js"]');
                    data = data.replace(/"options_page": "(.*)"/g, '"options_ui": { "page": "$1" }');

                    // Write the modified content back to the manifest.json file
                    fs.writeFile(manifestPath, data, 'utf8', (err) => {
                         if (err) {
                              reject(err);
                              return;
                         }
                         console.log('Manifest file updated successfully.');
                         resolve();
                    });
               });
          });
     }

     try {
          // Update the manifest file
          await updateManifest();
     } catch (error) {
          console.error('Error updating manifest file:', error);
          return;
     }

     //--------------------------------------------------------------------------

     const releasesDir = 'release';

     // Ensure the release directory exists
     if (!fs.existsSync(releasesDir)) {
          fs.mkdirSync(releasesDir);
     }

     // Zip Chromium directory
     const chromeZipPath = `${releasesDir}/Chromium.zip`;
     zipDirectory(sourceDir, chromeZipPath);

     // Zip Firefox directory
     const firefoxZipPath = `${releasesDir}/Firefox (Unstable).zip`;
     zipDirectory(destinationDir, firefoxZipPath);

     //--------------------------------------------------------------------------

     // Function to zip a directory
     function zipDirectory(sourceDir, zipFilePath) {
          // Create a new instance of AdmZip
          const zip = new AdmZip();

          // Add the contents of the source directory to the zip
          zip.addLocalFolder(sourceDir);

          // Write the zip file to disk
          zip.writeZip(zipFilePath);

          console.log(`Zip file created successfully: ${zipFilePath}`);
     }

     console.log(`Complete!`);
})();
