var SendingImage

async function UploadImageByAPI(File, ProgressCallback) {
     return new Promise((resolve, reject) => {
          if (SendingImage) {
               SendingImage.abort();
          }

          if (!File) {
               reject("Error : No File! ┑(￣Д ￣)┍");
          }

          var SentOBJ = new FormData();
          SentOBJ.append("image", File);

          SendingImage = new XMLHttpRequest();
          SendingImage.open('POST', 'https://api.imgbb.com/1/upload?key=7a66c339da2a9aefedd8ad5e6c62e89f');

          SendingImage.upload.addEventListener('progress', async function (e) {
               percent_completed = (e.loaded / e.total) * 100;
               ProgressCallback(percent_completed.toFixed(2))
          });

          SendingImage.onreadystatechange = function () {
               if (SendingImage.readyState === 4 && SendingImage.status === 200) {
                    var Recive = null

                    try {
                         Recive = JSON.parse(SendingImage.response)
                    } catch (error) {
                         Recive = JSON.parse(SendingImage.response.split("\n")[SendingImage.response.split("\n").length - 1])
                    }

                    if (Recive["success"] == true) {
                         resolve(Recive.data.url)
                    } else {
                         reject("Error : Make sure your image not over 32MB then try again (＞︿＜)")
                    }

                    SendingImage = null

               } else if (SendingImage.readyState === 4 && SendingImage.status !== 200) {
                    reject(`Error : ${SendingImage.status}`)
               }
          }
          
          SendingImage.send(SentOBJ);
     })
}