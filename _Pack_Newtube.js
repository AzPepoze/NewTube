(async () => {
     const fs = require('fs-extra');
     const path = require('path');
     const terser = require('terser');
     const AdmZip = require('adm-zip');

     // Terser options
     const terserOptionsDefault = {
          module: false,
          compress: {
               unused: false
          },
          mangle: {
               keep_fnames: true,
               keep_classnames: true
          }
     };

     const terserOptionsModule = {
          module: true,
          compress: {
               unused: false
          },
          mangle: false
     };

     async function clearFolder(folderPath) {
          try {
               await fs.emptyDir(folderPath);
               console.log(`Successfully cleared the folder: ${folderPath}`);
          } catch (err) {
               console.error(`Error clearing the folder: ${err}`);
          }
     }

     await clearFolder("dist/Chromium");
     await clearFolder("dist/Firefox");
     await clearFolder("release");

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
                         // Check if the file is within src/scripts/libs/
                         const isLibFile = !sourcePath.startsWith(path.join('src', 'scripts', 'libs'));
                         if (isLibFile) {
                              await fs.copyFile(sourcePath, destPath);
                              console.log(`${sourcePath}\nCopied!`);

                              // If it's a JavaScript file, minify it
                              if (file.endsWith('.js')) {
                                   await minifyFile(destPath);
                                   console.log(`Minified!`);
                              }
                         } else {
                              // If it's within src/scripts/libs/, just copy without minifying
                              await fs.copyFile(sourcePath, destPath);
                              console.log(`${sourcePath}\nCopied! (without minification)`);
                         }
                         console.log('-----------------');
                    }
               }

               console.log(`Copied! ${sourceDir}`);

               console.log('-----------------');
          } catch (error) {
               console.error('Error:', error);
          }
     }


     // Function to minify a JavaScript file
     async function minifyFile(filePath) {
          try {
               const fileContent = await fs.readFile(filePath, 'utf8');

               let minified;
               try {
                    minified = await terser.minify(fileContent, terserOptionsDefault);
               } catch (error) {
                    minified = await terser.minify(fileContent, terserOptionsModule);
               }
               minified = minified.code.replace(/console\.log\(.*?\);?/g, '');
               await fs.writeFile(filePath, minified.code);
          } catch (error) {
               console.error('Error minifying file:', error);
          }
     }

     // Copy all files from src folder to dist/Chromium folder and then minify JavaScript files
     await copyFiles('src', 'dist/Chromium');

     //--------------------------------------------------------------------------

     const sourceDirChromium = 'dist/Chromium';
     const destDirFirefox = 'dist/Firefox';

     // Ensure the source directory exists
     if (!fs.existsSync(sourceDirChromium)) {
          console.error(`Source directory ${sourceDirChromium} does not exist.`);
          return;
     }

     // Ensure the destination directory exists
     if (!fs.existsSync(destDirFirefox)) {
          fs.mkdirSync(destDirFirefox, { recursive: true });
     }

     // Clone the folder recursively
     fs.copySync(sourceDirChromium, destDirFirefox);

     console.log(`Folder cloned successfully from ${sourceDirChromium} to ${destDirFirefox}.`);

     //--------------------------------------------------------------------------

     // Replace text in the manifest.json file

     const manifestPathFirefox = 'dist/Firefox/manifest.json';

     // Function to update manifest file
     function updateManifest() {
          return new Promise((resolve, reject) => {
               fs.readFile(manifestPathFirefox, 'utf8', (err, data) => {
                    if (err) {
                         reject(err);
                         return;
                    }

                    // Replace text in the manifest content
                    data = data.replace(/"service_worker": "scripts\/Background.js"/g, '"scripts": ["scripts/Background.js"]');
                    data = data.replace(/"options_page": "(.*)"/g, '"options_ui": { "page": "$1" }');

                    // Write the modified content back to the manifest.json file
                    fs.writeFile(manifestPathFirefox, data, 'utf8', (err) => {
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
     zipDirectory(sourceDirChromium, chromeZipPath);

     // Zip Firefox directory
     const firefoxZipPath = `${releasesDir}/Firefox.zip`;
     zipDirectory(destDirFirefox, firefoxZipPath);

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
