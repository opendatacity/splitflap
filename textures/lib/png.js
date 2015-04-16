var gm = require('gm');
var fs = require('fs');

module.exports = {
	load:load,
	Image:Image
}

function load(filename, callback) {
	var img = gm(filename);
	img.size(function (err, size) {
		if (err) throw err;
		img.toBuffer('rgba', function (err, buffer) {
			if (err) throw err;
			callback(new Image(size.width, size.height, buffer));
		})
	});
}

function Image(width, height, buffer) {
	var bufferLength = width*height*4;
	if (!buffer) {
		buffer = new Buffer(bufferLength);
		buffer.fill(0);
	}
	if (buffer.length != bufferLength) throw Error();

	function setColor(x, y, color) {
		x = Math.round(x);
		y = Math.round(y);
		
		if ((x < 0) || (x >= width))  return;
		if ((y < 0) || (y >= height)) return;

		var index = (y*width + x)*4;
		
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[0]))), index+0);
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[1]))), index+1);
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[2]))), index+2);
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[3]))), index+3);
	}

	function getColor(x, y) {
		x = Math.round(x);
		y = Math.round(y);
		
		if ((x < 0) || (x >= width))  return [0,0,0,0];
		if ((y < 0) || (y >= height)) return [0,0,0,0];

		var index = (y*width + x)*4;

		return [
			buffer.readUInt8(index+0),
			buffer.readUInt8(index+1),
			buffer.readUInt8(index+2),
			buffer.readUInt8(index+3)
		]
	}

	function save(filename) {
		var img = gm(buffer);
		img._sourceFormatters.push(function (a) { a[0] = 'RGBA:-'; })

		img.options({imageMagick: true});
		img.in('-size');
		img.in(width+'x'+height);
		img.in('-depth');
		img.in('8');
		img.write(filename, function (err) {
			if (err) throw err;
		});
	}

	return {
		buffer:buffer,
		save:save,
		setColor:setColor,
		getColor:getColor,
		width:width,
		height:height
	}
}