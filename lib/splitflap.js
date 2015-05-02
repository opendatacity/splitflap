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

	me.renderMovie = function (screenplay, filename, callback) {
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
			if (now - lastTime < 3000) return;
			var time = (frameCount-frameNo)*(now-startTime)/frameNo;
			console.log((time/1000).toFixed(1));
			lastTime = now;
		}

		async.eachSeries(frames, function (frame, callback) {
			renderState(frame.state, img);
			pipe.addFrames(img.buffer, frame.count, function () {
				checkTime();
				callback();
			});
			frameNo += frame.count;
		}, function () {
			pipe.close();
			if (callback) callback();
		})
	}

	init();

	function renderState(state, img) {
		flaps.forEach(function (flap, index) {
			if (!flap.fontBuffer) {
				flap.fontBuffer = flap.font.image.buffer;
				flap.fontWidth  = flap.font.image.width;
				flap.fontHeight = flap.font.image.height;
			}

			var value = Math.round(state[index]);
			var offsetX = value % c.frames;
			var offsetY = Math.floor(value/c.frames);
			for (var y = 0; y < flap.h; y++) {
				var offset = ((y+offsetY*flap.h)*flap.fontWidth + offsetX*flap.w)*3;
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
		var frames = c.frames/c.speed;
		var states = [];
		var n = (maxLetterCount+1)*frames;
		var maxSpeedDiff = c.frames;

		for (var i = 0; i < n; i++) states[i] = new Array(flaps.count);

		flaps.forEach(function (flap, index) {
			var v0 = state0[index];
			var v1 = state1[index];
			if (v1 < v0) v1 += flap.spriteCount;
			var maxFrames = (v1-v0)/c.speed;

			var r = -Math.random()*maxSpeedDiff;

			var broken = Math.random() < 0.02;
			if (v1 == v0) broken = false;
			var vbroken = v1 - (broken ? c.frames : 0);
			var fbroken = (n-maxFrames)*Math.random() + maxFrames;

			for (var i = 0; i < n; i++) {
				var vend = Math.min(v1, Math.max(vbroken, (i-fbroken)*c.speed+v1));

				r += (Math.random()-0.5);
				if (r >  maxSpeedDiff) r =  maxSpeedDiff;
				if (r < -maxSpeedDiff) r = -maxSpeedDiff;

				var v = v0 + r + i*c.speed;
				if (v < v0) v = v0;
				if (v > vend) v = vend;

				if (i == n-1) v = v1;

				states[i][index] = Math.round(v) % flap.spriteCount;
			}
		})
		states.forEach(callback);
	}

	function calcState(state) {
		var result = {};
		Object.keys(state).forEach(function (key) {
			var text = state[key];
			text = cleanUpText(text).trim();

			// Calculating Rest Word Length, like: 3210543210210
			var wordLength = [];
			var j = 0;
			for (var i = text.length-1; i >= 0; i--) {
				var code = text.charCodeAt(i);
				if ((code == 10) || (code == 32)) {
					j = 0;
				} else {
					j++;
				}
				wordLength[i] = j;
			}

			field = fields[key];

			var states = field.flaps.map(function () { return 0 });

			var index = 0;
			var ellipsis = false;

			for (var i = 0; i < text.length; i++) {
				var char = text.charAt(i);
				var code = text.charCodeAt(i);
				if (code == 10) {
					// force break
					index = field.nextLine[index];
				} else if ((code == 32) && (field.col[index] == 0)) {
					//ignore spaces in the beginning
				} else if (field.row[wordLength[i]+index-1] != field.row[index]) {
					// word break
					if (field.row[index] == field.rowCount-1) {
						// last line
						if (!ellipsis) {
							add(index, '…');
							ellipsis = true;
						}
					}
					index = field.nextLine[index];
					add(index, char);
					index++;
				} else {
						add(index, char);
					index++;
				}
			}

			function add(index, char) {
				if (index < field.flaps.length) {
					states[index] = field.font.lookup(char)*c.frames;
				} else {
					if (!ellipsis) {
						states[field.flaps.length-1] = field.font.lookup('…')*c.frames;
						ellipsis = true;
					}
				}
			}

			result[key] = states;
		})
		return flaps.map(function (flap) {
			return result[flap.key][flap.fieldIndex];
		})
	}

	function init() {
		var y0 = 0;

		async.each(lines,
			function (line, callback) {
				if (!fonts[line.font]) {
					fonts[line.font] = initFont(line.font, callback);
				} else {
					setImmediate(callback);
				}
				line.font = fonts[line.font];

				if (line.font.letterCount > maxLetterCount) maxLetterCount = line.font.letterCount;
				
				if (!fields[line.key]) fields[line.key] = { flaps:[], font:line.font, nextLine:[], col:[], row:[], rowCount:0 };
				var field = fields[line.key];

				y0 += line.dy;
				var x = line.x;
				var nextLine = field.flaps.length + line.length;
				for (var i = 0; i < line.length; i++) {
					var entry = {
						x:x,
						y:y0,
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
					field.nextLine.push(nextLine);
					field.row.push(field.rowCount);
					field.col.push(i);
					x += line.font.width + line.gap;
				}

				field.rowCount++;
				y0 += line.font.height;
			},
			function () {
				initialized(me)
			}
		)
	}

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
	text = text.replace(/¡/g, '!');

	text = text.replace(/[„“]/g, '\"');
	text = text.replace(/[’]/g, '\'');
	text = text.replace(/[ÀÁÅĄĂÂĀ]/g, 'A');
	text = text.replace(/[ČĆĊ]/g, 'C');
	text = text.replace(/[Ď]/g, 'D');
	text = text.replace(/[ÈÉĚĘÊĒĖ]/g, 'E');
	text = text.replace(/[Ġ]/g, 'G');
	text = text.replace(/[Ħ]/g, 'H');
	text = text.replace(/[ÍÎĮĪ]/g, 'I');
	text = text.replace(/[ŁĽ]/g, 'L');
	text = text.replace(/[ÓØÕ]/g, 'O');
	text = text.replace(/[ŠŚŞ]/g, 'S');
	text = text.replace(/[ŤŢ]/g, 'T');
	text = text.replace(/[ŮÚŪ]/g, 'U');
	text = text.replace(/[Ý]/g, 'Y');
	text = text.replace(/[ŽŹ]/g, 'Z');

	return text;
}