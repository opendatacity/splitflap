
var c = require('./config.js');
var svg = require('./lib/svg.js');

var letters = c.letters.split('');

var aa = c.antialias;

var img = new svg(aa*c.letterCount*c.flapWidth, aa*c.flapHeight);

letters.forEach(function (letter, index) {
	var r  = aa*c.flapRadius;
	var g1 = aa*c.flapGap1;
	var g2 = aa*c.flapGap2;
	var x0 = aa*index*c.flapWidth;
	var x2 = x0 + aa*c.flapWidth-1;
	var x1 = (x0+x2)/2;
	var y0 = 0;
	var y2 = aa*c.flapHeight-1;
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
	], c.flapColor);

	img.drawText(x1, y1, letter, aa*c.flapHeight*0.8, c.fontColor);

})

img.save('images/letters.png');


