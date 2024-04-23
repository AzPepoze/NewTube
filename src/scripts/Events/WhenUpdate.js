async function SetWhenUpdate() {
     return await ConvertToNewSave(await Load())
}

async function ShowUpdated() {
     // console.log("ShowUp")
     upbg = document.createElement('div')
     upbg.style = `
     width: 800px;
     height: 160px;
     position: fixed;
     z-index: 3000;
     transition: all 0.5s ease 0s;
     opacity: 0;
     display: flex;
     flex-direction: column;
     align-items: center;
     left: calc(50% - 400px);
     bottom: -160px;
     background: #00000087;
     border-radius: 20px;
     box-shadow: white 0px 0px 4px;
     backdrop-filter: blur(10px);
     `
 
     upbg.innerHTML = `
     <div style="
     width: 100%;
     height: 60%;
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: center;
     ">
     
     <img src=https://media.tenor.com/gNcXkIbCvpsAAAAj/tsurumaki-kokoro.gif"
     style="height:60%;
     padding: 20px;">
     <p style="
     font-size: 28px;
     padding: 10px;
     color: white;
     foweight: 700;
     fofamily: cursive !important;
     ">🎉</p>
     <img src=`+ chrome.runtime.getURL('icon/64.png') + `
     style="
     filter: drop-shadow(0px 0px 8px rgba(255,255,255,0.7));
     ">
     <p style="
     font-size: 28px;
     padding: 10px;
     color: white;
     foweight: 700;
     fofamily: cursive !important;
     "> Newtube `+ Ver + ` has updated! 🎉</p>
     <img src=https://media.tenor.com/gNcXkIbCvpsAAAAj/tsurumaki-kokoro.gif"
     style="height:60%;
     padding: 20px;">
     
     </div>
     
     
     <div id="sndUpdatedBlock" style="
     width: 100%;
     height: 25%;
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: center;
     ">
     
     </div>`
 
     var Body = await GetDocumentBody()
     Body.append(upbg)
     sndblock = document.getElementById('sndUpdatedBlock')
 
     okbut = document.createElement('div')
     okbut.className = `Reset`
     okbut.style = `
     width: 40%;
     height: 30px;
     box-shadow: inset rgb(87, 255, 188) 0px 0px 1px 1px;
     background: transparent;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 24px;
     foweight: 700;
     cursor: pointer;
     transition: all 0.2s ease 0s;
     padding: 5px;
     color: rgb(87, 255, 188);
     fofamily: cursive !important;
     `
     okbut.innerHTML = "Ok !"
 
     sndblock.append(okbut)
 
 
     setTimeout(() => {
         upbg.style.bottom = '10px'
         upbg.style.opacity = '1'
         setTimeout(() => {
             upbg.style.transition = "all 0.5s ease"
         }, 1000)
     }, 200);
 
     okbut.onclick = async function () {
         upbg.style.opacity = '0'
         upbg.style.bottom = '-130px'
         await MainSave({ "OldVer": Ver })
         setTimeout(() => {
             upbg.remove()
         }, 500)
     }
 
     changelogbt = document.createElement('div')
     changelogbt.className = `Reset`
     changelogbt.style = `
     width: 40%;
     height: 30px;
     box-shadow: inset rgb(255 201 87) 0px 0px 1px 1px;
     background: transparent;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 24px;
     foweight: 700;
     cursor: pointer;
     transition: all 0.2s ease 0s;
     padding: 5px;
     margin-left: 10px;
     color: rgb(255 201 87);
     fofamily: cursive !important;
     `
     changelogbt.innerHTML = "Visit NewTube github"
 
     changelogbt.onclick = async function () {
         window.open(
             'https://github.com/AzPepoze/Newtube',
             '_blank'
         )
     }
 
     sndblock.append(changelogbt)
 }