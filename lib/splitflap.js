var c = require('../config.js');
var png = require('./png.js');
var ffmpeg = require('./ffmpeg.js');
var async = require('async');

var knownFonts = {};
c.fonts.forEach(function (font) {
	knownFonts[font.name] = font;
})

module.exports = function (lines, initialized) {
	var me = {};

	var fonts = {};
	var flaps = [];
	var fields = {};
	var maxLetterCount = 0;
	var y = 0;

	me.render = function (screenplay, filename) {
		var frames = [];
		var currentState = calcState(screenplay.shift());

		frames.push({state:currentState, count:1 });
		screenplay.forEach(function (value) {
			if (typeof value != 'number') {
				// new state
				var newState = calcState(value);
				blendStates(currentState, newState, function (state) {
					frames.push({state:state, count:1});
				})
				currentState = newState;
			} else {
				// keep state
				frames.push({state:currentState, count:Math.round(value*c.fps) });
			}
		})

		var img = new png.Image(1920, 1080, new Buffer(1920*1080*3));
		for (var i = 0; i < 1920*1080; i++) {
			img.buffer.writeUInt8(c.backColor[0], i*3+0);
			img.buffer.writeUInt8(c.backColor[1], i*3+1);
			img.buffer.writeUInt8(c.backColor[2], i*3+2);
		}

		var pipe = ffmpeg(filename);
		var frameNo = 0;
		var frameCount = 0;
		frames.forEach(function (frame) { frameCount += frame.count })

		var startTime = (new Date()).getTime();
		var lastTime = startTime;
		function checkTime() {
			var now = (new Date()).getTime();
			if (now - lastTime < 1000) return;
			var time = (frameCount-frameNo)*(now-startTime)/frameNo;
			console.log((time/1000).toFixed(1));
			lastTime = now;
		}

		async.eachSeries(frames, function (frame, callback) {
			//console.log(frameNo);
			renderState(frame.state, img);
			pipe.addFrames(img.buffer, frame.count, function () {
				checkTime()
				callback()
			});
			//img.save('frames/'+frameNo+'.png', callback, true);
			frameNo += frame.count;
		}, function () {
			pipe.close();
		})

		//console.log(frames.map(function (frame) { return frame.state.join('\t') }).join('\n'));
	}

	function renderState(state, img) {
		flaps.forEach(function (flap, index) {
			if (!flap.fontBuffer) {
				flap.fontBuffer = flap.font.image.buffer;
				flap.fontWidth  = flap.font.image.width;
				flap.fontHeight = flap.font.image.height;
			}

			var value = state[index];
			for (var y = 0; y < flap.h; y++) {
				var offset = (y*flap.fontWidth + value*flap.w)*3;
				var length = flap.w*3;
				flap.fontBuffer.copy(
					img.buffer,
					((y+flap.y)*1920+flap.x)*3,
					offset,
					offset+length
				)
			}
		})
	}

	function blendStates(state0, state1, callback) {
		var state = state0.slice(0);
		for (var i = 0; i < maxLetterCount*c.frames; i++) {
			flaps.forEach(function (flap, index) {
				if (state[index] != state1[index]) {
					state[index] = (state[index]+1) % flap.spriteCount;
				}
			})
			callback(state.slice(0));
		}
	}

	function calcState(state) {
		var result = {};
		Object.keys(state).forEach(function (key) {
			var text = state[key];
			text = cleanUpText(text);
			field = fields[key];
			result[key] = field.flaps.map(function (v, index) {
				return field.font.lookup(text.charAt(index))*c.frames;
			})
		})
		return flaps.map(function (flap) {
			return result[flap.key][flap.fieldIndex];
		})
	}

	async.each(lines,
		function (line, callback) {
			if (!fonts[line.font]) {
				fonts[line.font] = initFont(line.font, callback);
			} else {
				setImmediate(callback);
			}
			line.font = fonts[line.font];

			if (line.font.letterCount > maxLetterCount) maxLetterCount = line.font.letterCount;
			
			if (!fields[line.key]) fields[line.key] = { flaps:[], font:line.font };
			var field = fields[line.key];

			y += line.dy;
			var x = line.x;
			for (var i = 0; i < line.length; i++) {
				var entry = {
					x:x,
					y:y,
					w:line.font.width,
					h:line.font.height,
					font:line.font,
					spriteCount:line.font.spriteCount,
					key:line.key,
					fieldIndex:field.flaps.length,
					flapIndex:flaps.length
				}
				field.flaps.push(entry);
				flaps.push(entry);
				x += line.font.width + line.gap;
			}
			y += line.font.height;
		},
		function () {
			initialized(me)
		}
	)

	function initFont(name, callback) {
		var letters = knownFonts[name].letters;
		var result = {
			image:       false,
			letters:     letters,
			letterCount: letters.length,
			spriteCount: letters.length*c.frames,
			width:       knownFonts[name].flapWidth,
			height:      knownFonts[name].flapHeight,
			lookup:      function (char) {
				if (char.length == 0) return 0;
				char = char.toUpperCase();
				var result = letters.indexOf(char);
				if (result < 0) throw Error('"'+char+'" ('+char.charCodeAt(0)+') not found in "'+letters+'"');
				return result;
			}
		}
		png.load('../images/texture_'+name+'.png', 'rgb', function (image) {
			result.image = image;
			setImmediate(callback)
		})
		return result;
	}
}

function cleanUpText(text) {
	text = text.toUpperCase();
	text = text.replace(/–/g, '-');
	text = text.replace(/Ä/g, 'AE');
	text = text.replace(/Ö/g, 'OE');
	text = text.replace(/Ü/g, 'UE');
	text = text.replace(/ß/g, 'SS');

	return text;
}