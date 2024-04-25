const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const readline = require('readline');

const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
});

const octokit = new Octokit({
     auth: require('./_API_KEYS.json').Github
});

let owner;
function Set_Owner(params) {
     owner = params
}

let repo;
function Set_Repo(params) {
     repo = params
}

async function confirm_ask(question) {
     return new Promise((resolve, reject) => {
          rl.question(`${question} (y/n) `, (answer) => {
               if (answer.toLowerCase() === 'y') {
                    resolve(true);
               } else if (answer.toLowerCase() === 'n') {
                    resolve(false);
               } else {
                    console.log('Invalid input. Please enter either y or n.');
                    resolve(confirm_ask(question));
               }
          });
     });
}

async function GetVersion(filePath) {
     try {
          const manifest = require(filePath);
          return manifest.version;
     } catch (error) {
          console.error("Error reading manifest file:", error);
          return null;
     }
}

async function CheckIfReleaseExists(tag) {
     try {
          const releases = await octokit.repos.listReleases({
               owner,
               repo
          });

          for (const release of releases.data) {
               if (release.tag_name === tag) {
                    return release;
               }
          }

          return null;
     } catch (error) {
          console.error(`Error checking release existence: ${error.message}`);
          return null;
     }
}

async function RemoveReleaseByTag(tag) {
     try {
          const release = await octokit.repos.getReleaseByTag({
               owner,
               repo,
               tag
          });

          await octokit.repos.deleteRelease({
               owner,
               repo,
               release_id: release.data.id
          });

          console.log(`Release with tag ${tag} removed.`);
     } catch (error) {
          console.error(`Error removing release: ${error.message}`);
     }
}

async function CreateRelease(version, message) {
     try {
          if (!await confirm_ask(`Release ${version}?`)) {
               rl.close();
               return;
          }

          if (await CheckIfReleaseExists(version)) {
               if (!await confirm_ask(`Release ${version} already exists, replace?`)) {
                    rl.close();
                    return;
               }
               await RemoveReleaseByTag(version);
          }

          if (!message) {
               message = `Release ${version}`
          }

          const release = await octokit.repos.createRelease({
               owner,
               repo,
               tag_name: version,
               name: `Release ${version}`,
               body: message
          });

          console.log(`Release ${version} created`);

          console.log("Release URL:", release.data.html_url);

          return release.data.id;
     } catch (error) {
          console.error(`Error creating release: ${error.message}`);
          return null;
     }
}

async function Release(filePath, fileName, releaseId) {
     try {
          const zipFileContent = fs.readFileSync(filePath);
          await octokit.repos.uploadReleaseAsset({
               owner,
               repo,
               release_id: releaseId,
               name: fileName,
               data: zipFileContent
          });
          console.log(`${fileName} uploaded`);
     } catch (error) {
          console.error(`Error uploading ${fileName}:`, error);
     }
}

//-----------------------------------------------------------------------------

(async () => {
     try {
          Set_Owner("AzPepoze")
          Set_Repo("NewTube")

          const version = await GetVersion("./src/manifest.json");
          if (!version) return;

          const releaseId = await CreateRelease(version);
          if (!releaseId) return;

          await Release("release/Chromium.zip", `NewTube_${version}_Chromium.zip`, releaseId);
          await Release("release/Firefox.zip", `NewTube_${version}_Firefox_Unstable.zip`, releaseId);

          rl.close();
     } catch (error) {
          console.error("Error:", error);
     }
})();