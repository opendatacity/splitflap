
var c = require('./config.js');
var mvg = require('./lib/mvg.js');

c.fonts.forEach(function (font) {
	render(font);
})

function render(font) {
	var letters = font.letters.split('');
	var letterCount = letters.length;

	var aa = c.antialias;
	var w = font.flapWidth;
	var h = font.flapHeight;

	var img = new mvg(aa*letterCount*w, aa*h);

	console.log('Generating Letters');

	letters.forEach(function (letter, index) {
		var r  = aa*c.flapRadius;
		var g1 = aa*c.flapGap1;
		var g2 = aa*c.flapGap2;
		var x0 = aa*index*w;
		var x2 = x0 + aa*w-1;
		var x1 = (x0+x2)/2;
		var y0 = 0;
		var y2 = aa*h-1;
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
		], font.flapColor);

		img.drawText(x1, y1, letter, aa*font.fontSize, font.fontColor, font.fontName);

	})
	img.save('images/letters_'+font.name+'.png');
}


