
var c = require('../config.js');
var png = require('../lib/png.js');

var async = require('async');

async.eachSeries(
	c.fonts,
	function (font, callback) {
		console.log('Generating Font "'+font.name+'"');

		var letters = font.letters.split('');
		var letterCount = letters.length;

		var imgFlaps = new png.Image(
			font.flapWidth*letterCount*c.frames,
			font.flapHeight
		)

		var aa = c.antialias;
		var aa2 = aa*aa;

		console.log('   Loading Letters');

		png.load('images/letters_'+font.name+'.png', 'rgba', function (imgLetters) {
			for (var f = 0; f < c.frames; f++) {
				console.log('   Rendering Frame '+(f+1)+' von '+c.frames);

				for (var x = 0; x < font.flapWidth; x++) {
					for (var y = 0; y < font.flapHeight; y++) {

						var pixels;
						if ((c.motionblurCount == 1) || ((f == 0) || (f == c.frames-1))) {
							pixels = getPixels(x,y,f/c.frames);
						} else {
							for (var l = 0; l < letterCount; l++) pixels[l] = [0,0,0,0];

							for (var m = 0; m < c.motionblurCount; m++) {
								var df = m/(c.motionblurCount-1);
								df = (df - 0.5) * c.motionblurStrength;
								var p = getPixels(x,y,(f+df)/c.frames);

								for (var l = 0; l < letterCount; l++) {
									var a = p[l][3];
									pixels[l][0] += p[l][0]*a;
									pixels[l][1] += p[l][1]*a;
									pixels[l][2] += p[l][2]*a;
									pixels[l][3] += a;
								}
							}

							for (var l = 0; l < letterCount; l++) {
								var a = pixels[l][3] + 1e-100;
								pixels[l][0] = pixels[l][0]/a;
								pixels[l][1] = pixels[l][1]/a;
								pixels[l][2] = pixels[l][2]/a;
								pixels[l][3] = a/c.motionblurCount;
							}
						}

						for (var l = 0; l < letterCount; l++) {
							var index = f + l*c.frames;
							var xi = index;

							var a = pixels[l][3]/255;
							pixels[l][0] = pixels[l][0]*a + (1-a)*c.backColor[0];
							pixels[l][1] = pixels[l][1]*a + (1-a)*c.backColor[1];
							pixels[l][2] = pixels[l][2]*a + (1-a)*c.backColor[2];
							pixels[l][3] = 255;

							imgFlaps.setColor(
								x + xi*font.flapWidth,
								y,
								pixels[l]
							)
						}
					}
				}
			}

			console.log('   Saving Texture');

			imgFlaps.save('../images/texture_'+font.name+'.png', callback);

			function getPixels(x0, y0, f) {

				var colors = [];
				for (var l = 0; l < letterCount; l++) colors[l] = [0,0,0,0];

				for (var dx = 0; dx < aa; dx++) {
					for (var dy = 0; dy < aa; dy++) {
						var x = x0 + (dx/aa + (1/aa-1)/2);
						var y = y0 + (dy/aa + (1/aa-1)/2);
						var resultStack = render(x,y,f);
						for (var l = 0; l < letterCount; l++) {
							var cSum = [0,0,0,0];

							resultStack.forEach(function (entry) {
								var color;
								switch (entry.type) {
									case 'texture':
										var xOffset = (entry.textureId + l + letterCount) % letterCount;
										color = imgLetters.getColor((entry.x + xOffset*font.flapWidth)*aa, (entry.y*aa));
									break;
									case 'color':
										color = entry.color;
									break;
								}
								var a = color[3]/255;
								cSum[0] = (1-a)*cSum[0] + a*color[0];
								cSum[1] = (1-a)*cSum[1] + a*color[1];
								cSum[2] = (1-a)*cSum[2] + a*color[2];
								cSum[3] = (1-a)*cSum[3] + a*255;
							})

							for (var ci = 0; ci < 4; ci++) colors[l][ci] += cSum[ci];
						}
					}
				}

				for (var l = 0; l < letterCount; l++) {
					var color = colors[l];
					var alpha = Math.max(1e-100, color[3])/255;
					color[0] = color[0]/alpha;
					color[1] = color[1]/alpha;
					color[2] = color[2]/alpha;
					color[3] = color[3]/aa2;
				}

				return colors;
			}

			function render(x, y, f) {
				var stack = [];
				var w = font.flapWidth;
				var h = font.flapHeight;
				var scale = Math.abs(Math.cos(f*Math.PI))+1e-100;
				var y2 = (y-h/2)/scale + h/2;
				if (y < h/2) {
					addTexture(1, x, y)
					if ((f < 0.5) && (y2 >= 0)) addTexture(0, x, y2)
				} else {
					addTexture(0, x, y)
					if ((f > 0.5) && (y2 < font.flapHeight)) addTexture(1, x, y2)
				}
				return stack;

				function addTexture(i,x,y) {
					if (Math.abs(y-h/2) < c.flapGap1) return
					if ((Math.abs(y-h/2) < c.flapGap2) && (Math.abs(x-w/2) > w/2-2*c.flapGap1)) return
					stack.push({type:'texture', textureId:i, x:x, y:y})
				}
			}
		})
	},
	function () {
		console.log('Finished')
	}
)
