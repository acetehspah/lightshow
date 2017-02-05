var length = 1600;
var x = new Array(length);
var y = new Array(length);
var size = new Array(length);
var dx = new Array(length);
var dy = new Array(length);
var time = new Array(length);
var minRad = 1;
var rangeRad = 2;
var rangeScale = 5;
var rangeD = 40;
var minTime = 25;
var rangeTime = 25;
var WIDTH = 0;
var HEIGHT = 0;


function createParticles() {
	for(i = 0; i < length; i++)
	{
		time[i] = 0;
	}
}

function resizeParticleCanvas(canvas) {
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
}

function drawParticles(canvas, volume) {
	for(i = 0; i < length; i++)
	{
		if(time[i] < 1)
		{
			//x[i] = Math.random() * WIDTH;
			//y[i] = Math.random() * HEIGHT;
			x[i] = WIDTH/2;
			y[i] = HEIGHT/2;

			size[i] = minRad + Math.random() * rangeRad;
			//dx[i] = Math.sign(x[i] - WIDTH/2) * rangeD * Math.random();
			//dy[i] = Math.sign(y[i] - HEIGHT/2) * rangeD * Math.random();
			dx[i] = Math.random() * rangeD - rangeD/2;
			dy[i] = Math.random() * rangeD - rangeD/2;
			time[i] = minTime + Math.random() * rangeTime;
		}
		canvas.beginPath();
		canvas.arc(x[i], y[i], size[i] + ((minTime + rangeTime - time[i]) / (minTime + rangeTime)) * rangeScale, 0, 2 * Math.PI);
		canvas.fillStyle = "rgba(255, 255, 255," + (time[i] / (minTime + rangeTime)) + ")";
		canvas.fill();
		//canvas.stroke();
		//canvas.fillRect(x[i], y[i], size[i] + ((minTime + rangeTime - time[i]) / (minTime + rangeTime)) * rangeScale, size[i] + ((minTime + rangeTime - time[i]) / (minTime + rangeTime)) * rangeScale);

		time[i] -= volume * 2;
		x[i] += dx[i] * volume * 2;
		y[i] += dy[i] * volume * 2;
	}
}