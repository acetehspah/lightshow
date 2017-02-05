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
    if(str === "p" || str === "l" || str === "h")
    {
        imSource.src = "img/" + str + ".png";
        image = 1;
    }
    if(str === "0")
    {
        imSource.src = null;
        color = "rgba(255, 255, 255, ";
        image = 0;
        randCol = 0;
    }
    if(str === "9")
    {
        randCol = 1;
    }
};

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

    return minR + rangeR * vol;
}

window.onload = function() {

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
    frequencyData = new Uint8Array(wave.frequencyBinCount * 2);


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
    // draw a bar based on the current volume
    //canvasContext.fillRect(HEIGHT / 4, HEIGHT / 4, meter.volume*WIDTH*3, HEIGHT / 2);
    if(image == 1)
    {
        var radd = getRadius(meter.volume)
        canvasContext.drawImage(imSource, WIDTH/2 - radd, HEIGHT/2 - radd, radd * 2, radd * 2 );
    }
    else
    {
        canvasContext.beginPath();
        canvasContext.arc(WIDTH / 2, HEIGHT / 2, getRadius(meter.volume), 0, 2 * Math.PI);
        //canvasContext.arc(WIDTH / 2, HEIGHT / 2, getVScale(meter.volume), 0, 2 * Math.PI);
        canvasContext.fillStyle = color + "1)";
        canvasContext.fill();
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = color + "1)";
        canvasContext.stroke();
    }
    //for(i = 0; i < meter.wave.length; i++)
    //{
    //    canvasContext.fillRect(0 + i, HEIGHT/2, 5, meter.wave[i] * HEIGHT/2);
    //}
    for(i = 0; i < frequencyData.length/4; i++)
    {
        //canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2, 1, -frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2, 1, frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2, 1, -frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2, 1, frequencyData[i]);
        if(displayType.includes("a"))
        {
            canvasContext.fillStyle = color + "1)"
            canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
            canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/20, 1, frequencyData[i] * 2 / 255 * HEIGHT / 20);
        
        }
        if(displayType.includes("s"))
        {
            canvasContext.strokeStyle = color + ".3)";
            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.lineTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.lineTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.lineTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(meter.volume)+ frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.lineTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.stroke();

            
        }
        if(displayType.includes("d"))
        {
            canvasContext.strokeStyle = "rgba(0, 0, 0, .3)";
            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.lineTo(WIDTH/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2) + Math.PI), HEIGHT/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2) + Math.PI));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.lineTo(WIDTH/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.cos(-(Math.PI * i / frequencyData.length * 2)), HEIGHT/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.sin(-(Math.PI * i / frequencyData.length * 2)));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.lineTo(WIDTH/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2 + Math.PI), HEIGHT/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2 + Math.PI));
            canvasContext.stroke();

            canvasContext.beginPath();
            canvasContext.moveTo(WIDTH/2 + getRadius(meter.volume) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(meter.volume)) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.lineTo(WIDTH/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.cos(Math.PI * i / frequencyData.length * 2), HEIGHT/2 + (getRadius(meter.volume)- frequencyData[i]/255*HEIGHT/20) * Math.sin(Math.PI * i / frequencyData.length * 2));
            canvasContext.stroke();
        }
    }

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );

}