async function WaitAvatar() {
     return new Promise(resolve => {
          if (document.getElementById("avatar-btn")) {
               return resolve(document.getElementById("avatar-btn"));
          }

          if (document.querySelector("ytd-topbar-menu-button-renderer")) {
               return resolve(document.querySelector("ytd-topbar-menu-button-renderer"));
          }

          const observer = new MutationObserver(mutations => {
               if (document.getElementById("avatar-btn")) {
                    resolve(document.getElementById("avatar-btn"));
                    observer.disconnect();
               }
               if (document.querySelector("ytd-topbar-menu-button-renderer")) {
                    resolve(document.querySelector("ytd-topbar-menu-button-renderer"));
                    observer.disconnect();
               }
          });

          observer.observe(document.body, {
               childList: true,
               subtree: true
          });
     });
}

async function ChangeToDarkMode() {
     await WaitAvatar()

     try {
          document.getElementById("avatar-btn").click()
     } catch (e) {
          document.getElementsByTagName("ytd-topbar-menu-button-renderer")[0].click()
     }

     await waitForElm("ytd-toggle-theme-compact-link-renderer")
     document.getElementsByTagName("ytd-toggle-theme-compact-link-renderer")[0].click()
     await waitForElmByID("submenu")
     await waitForElm("ytd-compact-link-renderer")
     document.getElementById("submenu").getElementsByTagName("ytd-compact-link-renderer")[2].click()
}