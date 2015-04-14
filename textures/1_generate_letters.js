
var config = require('./config.js');
var svg = require('./lib/svg.js');

var letters = config.letters.split('');

var aa = config.antialias;

var img = new svg(aa*letters.length*config.flapWidth, aa*config.flapHeight);

letters.forEach(function (letter, index) {
	var r  = aa*config.flapRadius;
	var g1 = aa*config.flapGap1;
	var g2 = aa*config.flapGap2;
	var x0 = aa*index*config.flapWidth;
	var x2 = x0 + aa*config.flapWidth-1;
	var x1 = (x0+x2)/2;
	var y0 = 0;
	var y2 = aa*config.flapHeight-1;
	var y1 = (y0+y2)/2;

	
	img.drawPath([
		'M', [x1,y0],
		'L', [x2-r,y0],
		'A', [r,r], 0, [0,1], [x2,y0+r],
		'L', [x2,y2-r],
		'A', [r,r], 0, [0,1], [x2-r,y2],
		'L', [x0+r,y2],
		'A', [r,r], 0, [0,1], [x0,y2-r],
		'L', [x0,y0+r],
		'A', [r,r], 0, [0,1], [x0+r,y0],
		'Z'
	], config.flapColor);

	img.drawText(x1, y1, letter, aa*config.flapHeight*0.8, config.fontColor);

})

img.save('test.png');


