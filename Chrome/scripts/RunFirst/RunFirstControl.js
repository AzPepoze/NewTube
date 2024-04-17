function FastInject(Name) {
     return new Promise(async function (res, rej) {
          var s = document.createElement('script');

          s.onload = function () {
               res()
          }

          s.id = "NewtubeGlobalScript"
          s.src = chrome.runtime.getURL(`scripts/${Name}`);

          if (document.head || document.body) {
               (document.head || document.body).appendChild(s);
          } else {
               document.addEventListener("DOMContentLoaded", function () {
                    (document.head || document.body).appendChild(s);
               }, { once: true });
          }
     })
}

async function FastInjectAfterLoad() {
     FastInject("RunFirst/EnableNewYoutubeLayout.js")
}


document.addEventListener("DOMContentLoaded", function () {
     FastInjectAfterLoad()
});  