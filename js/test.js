var audioContext = null;
var meter = null;
var wave = null;
var frequencyData = null;
var canvasContext = null;
var WIDTH=window.innerWidth;
var HEIGHT=window.innerHeight;
var rafID = null;
var maxR = WIDTH / 4;
var minR = maxR * 2 / 5;
var rangeR = maxR - minR;


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    maxR = WIDTH / 4;
    minR = maxR * 2 / 5;
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
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    wave.getByteFrequencyData(frequencyData);
    
    drawParticles(canvasContext, meter.volume);

    // draw a bar based on the current volume
    //canvasContext.fillRect(HEIGHT / 4, HEIGHT / 4, meter.volume*WIDTH*3, HEIGHT / 2);
    canvasContext.beginPath();
    canvasContext.arc(WIDTH / 2, HEIGHT / 2, getRadius(meter.volume), 0, 2 * Math.PI);
    //canvasContext.arc(WIDTH / 2, HEIGHT / 2, getVScale(meter.volume), 0, 2 * Math.PI);
    canvasContext.fillStyle = "white";
    canvasContext.fill();
    canvasContext.lineWidth = 10;
    canvasContext.strokeStyle = "white";
    canvasContext.stroke();
    //for(i = 0; i < meter.wave.length; i++)
    //{
    //    canvasContext.fillRect(0 + i, HEIGHT/2, 5, meter.wave[i] * HEIGHT/2);
    //}
    try{
    for(i = 0; i < frequencyData.length; i++)
    {
        //canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2, 1, -frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2, 1, frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2, 1, -frequencyData[i]);
        //canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2, 1, frequencyData[i]);
        canvasContext.fillRect(WIDTH/2 - i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/8, 1, frequencyData[i] * 2 / 255 * HEIGHT / 8);
        canvasContext.fillRect(WIDTH/2 + i, HEIGHT/2 - frequencyData[i] / 255 * HEIGHT/8, 1, frequencyData[i] * 2 / 255 * HEIGHT / 8);
    }
    }
    catch(err) {
        alert(err.message);
    }

    

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );

}