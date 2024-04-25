const fs = require('fs-extra');
const path = require('path');
const terser = require('terser');
const AdmZip = require('adm-zip');

// Terser options
const terserOptionsDefault = {
     module: false,
     compress: {
          unused: false,
          drop_console: true
     },
     mangle: {
          keep_fnames: true,
          keep_classnames: true
     }
};

const terserOptionsModule = {
     module: true,
     compress: {
          unused: false,
          drop_console: true
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

async function copyFiles(sourceDir, destDir) {
     try {
          await fs.mkdirp(destDir);

          const files = await fs.readdir(sourceDir);

          for (const file of files) {
               const sourcePath = path.join(sourceDir, file);
               const destPath = path.join(destDir, file);

               const stat = await fs.stat(sourcePath);

               if (stat.isDirectory()) {
                    await copyFiles(sourcePath, destPath); // Recursively copy subdirectories
               } else if (stat.isFile()) {
                    const isNotLibFile = !sourcePath.startsWith(path.join('src', 'scripts', 'libs'));
                    if (isNotLibFile) {
                         await fs.copyFile(sourcePath, destPath);
                         console.log(`Copied '${sourcePath}'`);

                         if (file.endsWith('.js')) {
                              await minifyFile(destPath);
                              console.log(`Minified '${destPath}'`);
                         }
                    } else {
                         await fs.copyFile(sourcePath, destPath);
                         console.log(`Copied '${sourcePath}'`);
                    }
               }
          }

          console.log(`Copied! ${sourceDir}`);
     } catch (error) {
          console.error('Error:', error);
     }
}



async function minifyFile(filePath) {
     try {
          const fileContent = await fs.readFile(filePath, 'utf8');

          let minified;
          try {
               minified = await terser.minify(fileContent, terserOptionsDefault);
          } catch (error) {
               minified = await terser.minify(fileContent, terserOptionsModule);
          }
          await fs.writeFile(filePath, minified.code);
     } catch (error) {
          console.error('Error minifying file:', error);
     }
}

async function Replace_for_Firefox_Text(data) {
     data = data.replace(/webkit-fill/g, 'moz');
     data = data.replace(/-webkit-mask-box/g, 'mask');

     data = data.replace(/webkit-slider-runnable-track/g, 'moz-range-track');
     data = data.replace(/webkit-slider-thumb/g, 'moz-range-thumb');

     return data
}

async function Replace_for_Firefox(filePath) {
     try {
          // Read the file
          let data = await fs.readFile(filePath, 'utf8');

          let modifiedContent;
          // Modify content based on file extension
          if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
               modifiedContent = await Replace_for_Firefox_Text(data);
          } else {
               console.log(`Skipping file '${filePath}'`);
               return; // Skip processing non-CSS and non-JS files
          }

          // Write the modified content back to the file
          await fs.writeFile(filePath, modifiedContent, 'utf8');
          console.log(`File '${filePath}' updated successfully!`);
     } catch (err) {
          console.error('Error:', err.message);
     }
}


async function update_Manifest_Firefox(manifestPath) {
     try {
          let data = await fs.readFile(manifestPath, 'utf8');
          data = data.replace(/"service_worker": "scripts\/Background.js"/g, '"scripts": ["scripts/Background.js"]');
          data = data.replace(/"options_page": "(.*)"/g, '"options_ui": { "page": "$1" }');
          await fs.writeFile(manifestPath, data, 'utf8');
          console.log('Manifest file updated successfully.');
     } catch (error) {
          console.error('Error updating manifest file:', error);
     }
}

function zipDirectory(sourceDir, zipFilePath) {
     const zip = new AdmZip();
     zip.addLocalFolder(sourceDir);
     zip.writeZip(zipFilePath);
     console.log(`Zip file created successfully: ${zipFilePath}`);
}


async function Replace_for_Firefox_Folder(folderPath) {
     try {
          const items = await fs.readdir(folderPath);
          for (const item of items) {
               const itemPath = path.join(folderPath, item);
               const stat = await fs.stat(itemPath);
               if (stat.isDirectory() && item === 'libs') {
                    console.log(`Skipping folder '${itemPath}'`);
                    continue; // Skip processing the 'libs' folder
               }
               if (stat.isDirectory()) {
                    await Replace_for_Firefox_Folder(itemPath); // Recursively process subdirectories
               } else if (stat.isFile()) {
                    await Replace_for_Firefox(itemPath); // Process files
               }
          }
     } catch (error) {
          console.error('Error replacing in folder:', error);
     }
}


(async () => {
     await clearFolder("dist/Chromium");
     await clearFolder("dist/Firefox");
     await clearFolder("release");

     await copyFiles('src', 'dist/Chromium');

     const sourceDirChromium = 'dist/Chromium';
     const destDirFirefox = 'dist/Firefox';

     if (!fs.existsSync(sourceDirChromium)) {
          console.error(`Source directory ${sourceDirChromium} does not exist.`);
          return;
     }

     if (!fs.existsSync(destDirFirefox)) {
          fs.mkdirSync(destDirFirefox, { recursive: true });
     }

     fs.copySync(sourceDirChromium, destDirFirefox);

     console.log(`Folder cloned successfully from ${sourceDirChromium} to ${destDirFirefox}.`);

     await update_Manifest_Firefox('dist/Firefox/manifest.json');

     // Replace text in JS and CSS files in destDirFirefox
     await Replace_for_Firefox_Folder(destDirFirefox);

     const releasesDir = 'release';

     if (!fs.existsSync(releasesDir)) {
          fs.mkdirSync(releasesDir);
     }

     const chromeZipPath = `${releasesDir}/Chromium.zip`;
     zipDirectory(sourceDirChromium, chromeZipPath);

     const firefoxZipPath = `${releasesDir}/Firefox.zip`;
     zipDirectory(destDirFirefox, firefoxZipPath);

     console.log(`Complete!`);
})();