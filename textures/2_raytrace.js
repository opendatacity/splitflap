
var c = require('./config.js');
var png = require('./lib/png.js');

var imgFlaps = new png.Image(
	c.flapWidth*c.letterCount,
	c.flapHeight*c.frames
)

var aa = c.antialias;
var aa2 = aa*aa;

console.log('Loading Letters');

png.load('images/letters.png', function (imgLetters) {
	for (var f = 0; f < c.frames; f++) {
		console.log('Rendering Frame '+(f+1)+' von '+c.frames);

		for (var x = 0; x < c.flapWidth; x++) {
			for (var y = 0; y < c.flapHeight; y++) {
				var pixels = getPixels(x,y,f/c.frames);
				for (var l = 0; l < c.letterCount; l++) {
					imgFlaps.setColor(
						x + l*c.flapWidth,
						y + f*c.flapHeight,
						pixels[l]
					)
				}
			}
		}
	}

	console.log('Saving Texture');

	imgFlaps.save('../info-beamer/texture.png');

	function getPixels(x0, y0, f) {

		var colors = [];
		for (var l = 0; l < c.letterCount; l++) colors[l] = [0,0,0,0];

		for (var dx = 0; dx < aa; dx++) {
			for (var dy = 0; dy < aa; dy++) {
				var x = x0 + (dx/aa + (1/aa-1)/2);
				var y = y0 + (dy/aa + (1/aa-1)/2);
				var resultStack = render(x,y,f);
				for (var l = 0; l < c.letterCount; l++) {
					var cSum = [0,0,0,0];

					resultStack.forEach(function (entry) {
						var color;
						switch (entry.type) {
							case 'texture':
								var xOffset = (entry.textureId + l + c.letterCount) % c.letterCount;
								color = imgLetters.getColor(entry.x + xOffset*c.flapWidth*aa, entry.y);
							break;
							case 'color':
								color = entry.color;
							break;
						}
						var a = color[3]/255;
						cSum[0] = (1-a)*cSum[0] + color[0];
						cSum[1] = (1-a)*cSum[1] + color[1];
						cSum[2] = (1-a)*cSum[2] + color[2];
						cSum[3] = (1-a)*cSum[3] + a*255;
					})

					for (var ci = 0; ci < 4; ci++) colors[l][ci] += cSum[ci];
				}
			}
		}

		for (var l = 0; l < c.letterCount; l++) {
			var color = colors[l];
			var alpha = Math.max(1e-10, color[3])/255;
			color[0] = color[0]/alpha;
			color[1] = color[1]/alpha;
			color[2] = color[2]/alpha;
			color[3] = color[3]/aa2;
		}

		return colors;
	}

	function render(x, y, f) {
		var stack = [];
		var h = c.flapHeight;
		var scale = Math.abs(Math.cos(f*Math.PI))+1e-10;
		var y2 = (y-h/2)/scale + h/2;
		if (y < h/2) {
			stack.push({type:'texture', textureId:1, x:x, y:y})
			if ((f < 0.5) && (y2 > 0)) {
				stack.push({type:'texture', textureId:0, x:x, y:y2})
			}
		} else {
			stack.push({type:'texture', textureId:0, x:x, y:y})
			if ((f > 0.5) && (y2 < c.flapHeight)) {
				stack.push({type:'texture', textureId:1, x:x, y:y2})
			}
		}
		return stack;
	}
})
