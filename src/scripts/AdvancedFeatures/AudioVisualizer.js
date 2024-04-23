if (await GetLoad("VisualT") == true) {

     setTimeout(async () => {
          // we have to connect the MediaElementSource with the analyser
          // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
          await FindVideo()

          var audioCtx = new AudioContext()
          var audioSrc = audioCtx.createMediaElementSource(v)
          var analyser = audioCtx.createAnalyser()

          audioSrc.connect(analyser)
          analyser.connect(audioCtx.destination)

          analyser.fftSize = 1024;

          // we're ready to receive some data!
          canvas3 = document.createElement('canvas')
          canvas3.id = "Newtube_Visaulizer"

          canvas3.style = `position: fixed;
         z-index: 1;
         bottom: 0px;
         pointer-events: none;
         filter: drop-shadow(0px 0px 3px white);`
          canvas3.width = 1920
          canvas3.height = 250

          var cwidth = canvas3.width,
               cheight = canvas3.height,
               meterWidth = 5, //width of the meters in the spectrum
               gap = 4, //gap between meters
               capHeight = 2,
               capStyle = '#fff',
               meterNum = 1024, //count of the meters
               capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame

          YTAPP.insertBefore(canvas3, YTAPP.firstChild)

          ctx = canvas3.getContext('2d'),
               gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(1, '#ffffff00');
          gradient.addColorStop(0.5, '#ffffff');
          gradient.addColorStop(0, '#ffffff');
          // loop
          async function renderFrame() {
               var array = new Uint8Array(analyser.frequencyBinCount);
               analyser.getByteFrequencyData(array);
               var step = 1; //sample limited data from the total array
               ctx.clearRect(0, 0, cwidth, cheight);
               for (var i = 0; i < meterNum; i++) {
                    var value = array[i * step]
                    value = ((value * value) / 500) - 20
                    if (capYPositionArray.length < Math.round(meterNum)) {
                         capYPositionArray.push(value);
                    };
                    ctx.fillStyle = capStyle;
                    //draw the cap, with transition effect
                    if (value < capYPositionArray[i]) {
                         ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                    } else {
                         ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                         capYPositionArray[i] = value;
                    };
                    ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                    ctx.fillRect(i * 12 /*meterWidth+gap*/, cheight - value + capHeight, meterWidth, cheight); //the meter
               }
               requestAnimationFrame(renderFrame);
          }
          renderFrame();
     }, 1000);
}