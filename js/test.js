var audioContext = null;
var meter = null;
var wave = null;
var frequencyData = null;
var canvasContext = null;
var WIDTH=window.innerWidth;
var HEIGHT=window.innerHeight;
var rafID = null;
var maxR = WIDTH / 8;
var minR = maxR * 3 / 5;
var rangeR = maxR - minR;
var displayType = "a";
var color = "rgba(255, 255, 255, ";
var imSource = new Image();
var image = 0;
var randCol = 0;
var sampleRate = 44100;
var bufferSize = 1024;
var binWidth = 100; //any number really;
var bassVol = 0; // between 0 and 1;
var bassMax = 150; //high cutoff point for bass;
var bassMaxI = 1;
var averaging = 0.85;
var bassMinVol = .50; //to filter out background noise
var showFace = 0;
var faceURL = 0;
var img;
var faceRect = 0;

document.onkeypress = function (e) {
    e = e || window.event;
    var str = String.fromCharCode(e.keyCode);
    
    if(str === "1"||str ==="2"||str === "3")
    {
        changeType(str);
    }
    if(str === "q" || str ==="w" || str === "e" || str === "r" || str === "t")
    {
        document.getElementById('background').background = "img/" + str + '.jpg';
    }
    if(str === "a" || str === "s" || str === "d")
    {
        if(displayType.includes(str))
        {
            displayType = displayType.replace(str, "");

        }
        else
        {
            displayType += str;
        }
        
    }
    if(str === "z")
    {
        color = "rgba(255, 255, 255, ";
    }
    if(str === "x")
    {
        color = "rgba(255, 0, 0, ";
    }
    if(str === "c")
    {
        color = "rgba(0, 255, 0, ";
    }
    if(str === "v")
    {
        color = "rgba(0, 0, 255, ";
    }
    if(str === "b")
    {
        color = "rgba(255, 255, 0, ";
    }
    if(str === "n")
    {
        color = "rgba(0, 255, 255, ";
    }
    if(str === "m")
    {
        color = "rgba(255, 0, 255, ";
    }
    if(str === "l" || str === "h")
    {
        imSource.src = "img/" + str + ".png";
        image = 1;
    }
    if(str === "0")
    {
        color = "rgba(255, 255, 255, ";
        image = 0;
        randCol = 0;
    }
    if(str === "9")
    {
        randCol = 1;
    }
    if(str === "i")
    {
        var cann2 = document.getElementById('canvas2');
        var video = document.getElementById('video');
        if(showFace == 0)
        {
            cann2.style.display = "block";
            video.style.display = "block";
            showFace = 1
        }
        else
        {
            cann2.style.display = "none";
            video.style.display = "none";
            showFace = 0;
        }
    }
    if(str === "o")
    {
        var thesecondcanvas = document.createElement('canvas');
        //var thesecondcanvas = document.getElementById('secondcanvas');
        var secondcontext = thesecondcanvas.getContext('2d');
        secondcontext.canvas.height = 1000;
        secondcontext.canvas.width = 1000;
        secondcontext.clearRect(0, 0, thesecondcanvas.width, thesecondcanvas.height);
        //take a pic
        var video = document.getElementById('video');
        var thecanvas = document.createElement('canvas');
        var context2 = thecanvas.getContext('2d');
        context2.drawImage(video, 0, 0, 220, 150);

        var imgData = context2.getImageData(faceRect.x, faceRect.y, faceRect.width, faceRect.height);
        //var imgData = context2.getImageData(faceRect.x, faceRect.y, 100, 100);
        
        //secondcontext.putImageData(imgData, 30, 30);
        var xfactor = 2;
        var yfactor = 2;
        console.log(faceRect);
        // roundedImage(secondcontext, 0, 0, thesecondcanvas.width, thesecondcanvas.height, 10);
        // secondcontext.clip();

        // secondcontext.drawImage(video,faceRect.x * xfactor, faceRect.y * xfactor, faceRect.width * xfactor, faceRect.height * xfactor, 0, 0, 400, 400);
        // secondcontext.restore();


        secondcontext.beginPath();
        secondcontext.arc(500, 500, 500, 0, Math.PI * 2, true);
        secondcontext.closePath();
        secondcontext.clip();

        secondcontext.drawImage(video,faceRect.x * xfactor, faceRect.y * xfactor, faceRect.width * xfactor, faceRect.height * xfactor, 0, 0, 1000, 1000);

        secondcontext.beginPath();
        secondcontext.arc(0, 0, 500, 0, Math.PI * 2, true);
        secondcontext.clip();
        secondcontext.closePath();
        secondcontext.restore();


        //secondcontext.drawImage(video, 100, 100, faceRect.width * xfactor, faceRect.height * xfactor, 0, 0, 100, 100);

        var faceURL = thesecondcanvas.toDataURL();
        //create img
        img = document.createElement('img');
        img.setAttribute('src', faceURL);

    }
    if(str === "p")
    {
        imSource.src = img.src;
        console.log(imSource);
        image = 1;
    }
};

function roundedImage(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function randColor(){
    return "rgba( " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", ";
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    maxR = WIDTH / 8;
    minR = maxR * 3 / 5;
    rangeR = maxR - minR;
    resizeParticleCanvas(canvas);
}
function getRadius(vol) {

    return minR + rangeR * Math.sqrt((vol));
}

function getSquare(rect)
{
    if(rect.width > rect.height)
    {
        rect.y = rect.y - ((rect.width - rect.height)/2)
        rect.height = rect.width;
    }
    else
    {
        rect.x = rect.x - ((rect.height - rect.width)/2)
        rect.width = rect.height;
    }
    return rect;
}

window.onload = function() {
    var video = document.getElementById('video');
      var canvas = document.getElementById('canvas2');
      var context = canvas.getContext('2d');
      var tracker = new tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      tracking.track('#video', tracker, { camera: true });
      tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            faceRect = getSquare(rect);
          context.strokeStyle = '#a64ceb';
          context.strokeRect(faceRect.x, faceRect.y, faceRect.width, faceRect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + faceRect.x + 'px', faceRect.x + faceRect.width + 5, faceRect.y + 11);
          context.fillText('y: ' + faceRect.y + 'px', faceRect.x + faceRect.width + 5, faceRect.y + 22);
        });
      });
      
    // grab our canvas
    canvasContext = document.getElementById( "canvas" ).getContext("2d");
    
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // grab an audio context
    audioContext = new AudioContext();
    window.addEventListener('resize', resizeCanvas, false);
    createParticles();
    resizeCanvas();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

function getBassVol(array) {
    var sum = 0;
    var max = 0;
    for(i = 0; i < bassMaxI; i++)
    {
        sum += array[i];
        if(array[i] > max)
        {
            max = array[i];
        }
    }
    return Math.max(bassVol * averaging, (sum/(255 * bassMaxI) - bassMinVol) / (1 - bassMinVol));
    //return Math.max(bassVol * averaging, (max/255 - bassMinVol) / (1 - bassMinVol));
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    //wave = createWaveAnalyser(audioContext);
    wave = audioContext.createAnalyser();
    wave.fftSize = 2048;
    mediaStreamSource.connect(wave);
    frequencyData = new Uint8Array(wave.frequencyBinCount);
    bufferSize = wave.frequencyBinCount;
    sampleRate = audioContext.sampleRate;
    binWidth = sampleRate/bufferSize;
    bassMaxI = Math.ceil(bassMax/binWidth);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
    // clear the background
    if(randCol == 1)
    {
        color = randColor();
    }
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    wave.getByteFrequencyData(frequencyData);
    drawParticles(canvasContext, meter.volume, color, image, imSource);
    //drawParticles(canvasContext, bassVol, color, image, imSource);
    bassVol = getBassVol(frequencyData);
    // draw a bar based on the current volume
    //canvasContext.fillRect(HEIGHT / 4, HEIGHT / 4, meter.volume*WIDTH*3, HEIGHT / 2);
    
    //for(i = 0; i < meter.wave.length; i++)
    //{
    //    canvasContext.fillRect(0 + i, HEIGHT/2, 5, meter.wave[i] * HEIGHT/2);
    //}
    for(i = 0; i < frequencyData.length; i++)
    {
        /*if(displayType.includes("a"))
        {
            canvasContext.fillStyle = color + "1)";
            canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
            canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
        }*/
        
        if(displayType.includes("a"))
        {
            canvasContext.fillStyle = color + "1)"
            canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
            canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
        }
    }
    if(image == 1)
    {
        var radd = getRadius(bassVol);
        canvasContext.drawImage(imSource, WIDTH/2 - radd, HEIGHT/2 - radd, radd * 2, radd * 2 );
    }
    else
    {
        canvasContext.beginPath();
        //canvasContext.arc(WIDTH / 2, HEIGHT / 2, getRadius(meter.volume), 0, 2 * Math.PI);
        canvasContext.arc(WIDTH / 2, HEIGHT / 2, getRadius(bassVol), 0, 2 * Math.PI);
        //canvasContext.arc(WIDTH / 2, HEIGHT / 2, getVScale(meter.volume), 0, 2 * Math.PI);
        canvasContext.fillStyle = color + "1)";
        canvasContext.fill();
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = color + "1)";
        canvasContext.stroke();
    }
    for(i = 0; i < frequencyData.length/2; i++)
    {
        if(displayType.includes("s"))
        {
            canvasContext.strokeStyle = color + ".3)";
            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.lineTo(WIDTH/2 + getRadius(bassVol) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.lineTo(WIDTH/2 + getRadius(bassVol) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.lineTo(WIDTH/2 + getRadius(bassVol) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(bassVol)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.lineTo(WIDTH/2 + getRadius(bassVol) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.stroke();
                
        }
            if(displayType.includes("d"))
            {
                canvasContext.strokeStyle = "rgba(0, 0, 0, .3)";
                canvasContext.beginPath();
                canvasContext.moveTo(WIDTH/2 + getRadius(bassVol) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
                canvasContext.lineTo(WIDTH/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
                canvasContext.stroke();

                canvasContext.beginPath();
                canvasContext.moveTo(WIDTH/2 + getRadius(bassVol) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
                canvasContext.lineTo(WIDTH/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
                canvasContext.stroke();

                canvasContext.beginPath();
                canvasContext.moveTo(WIDTH/2 + getRadius(bassVol) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
                canvasContext.lineTo(WIDTH/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
                canvasContext.stroke();

                canvasContext.beginPath();
                canvasContext.moveTo(WIDTH/2 + getRadius(bassVol) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(bassVol)) * Math.sin(Math.PI * i / frequencyData.length * 2));
                canvasContext.lineTo(WIDTH/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(bassVol)- frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2));
                canvasContext.stroke();
            }
    }

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );

}