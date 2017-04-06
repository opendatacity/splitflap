var gm = require('gm');
var fs = require('fs');

module.exports = {
	load:load,
	Image:Image
}

function load(filename, format, callback) {
	var img = gm(filename);
	img.size(function (err, size) {
		if (err) throw err;

		img.toBuffer(format, function (err, buffer) {
			if (err) throw err;
			callback(new Image(size.width, size.height, buffer));
		})
	});
}

function Image(width, height, buffer) {
	// wrappes an image buffer with specified width and height.

	var bufferLength, byteCount;
	if (!buffer) {
		// If there is no buffer, than create a new 8-bit-RGBA image buffer
		byteCount = 4;
		bufferLength = width*height*byteCount;
		buffer = new Buffer(bufferLength);
		buffer.fill(0);
	} else {
		// We have a buffer so lets estimate the image format
		byteCount = buffer.length/(width*height);
		// is byteCount == 3, we propably have an 8-bit-RGB image
		// is byteCount == 4, we propably have an 8-bit-RGBA image
		// everything else means, we are in trouble!
		if ((byteCount !== 3) && (byteCount !== 4)) throw Error('Received an image buffer, that is neither 8-Bit-RGB nor 8-Bit-RGBA.');
		bufferLength = width*height*byteCount;
	}

	function setColor3(x, y, color) {
		x = Math.round(x);
		y = Math.round(y);
		
		if ((x < 0) || (x >= width))  return;
		if ((y < 0) || (y >= height)) return;

		var index = (y*width + x)*3;
		
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[0]))), index+0);
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[1]))), index+1);
		buffer.writeUInt8(Math.max(0, Math.min(255, Math.round(color[2]))), index+2);
	}

	function getColor3(x, y) {
		x = Math.round(x);
		y = Math.round(y);
		
		if ((x < 0) || (x >= width))  return [0,0,0];
		if ((y < 0) || (y >= height)) return [0,0,0];

		var index = (y*width + x)*3;

		return [
			buffer.readUInt8(index+0),
			buffer.readUInt8(index+1),
			buffer.readUInt8(index+2)
		]
	}

	function setColor4(x, y, color) {
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

	function getColor4(x, y) {
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

	function save(filename, callback, duplicate) {
		var b = buffer;
		if (duplicate) b = new Buffer(buffer);

		var img = gm(b);

		switch (byteCount) {
			case 3: img._sourceFormatters.push(function (a) { a[0] = 'RGB:-';  }); break;
			case 4: img._sourceFormatters.push(function (a) { a[0] = 'RGBA:-'; }); break;
		}

		img.options({imageMagick: true});
		
		img.in('-size');
		img.in(width+'x'+height);
		img.in('-depth');
		img.in('8');

		img.write(filename, function (err) {
			if (err) throw err;
			if (callback) callback();
		});
	}

	return {
		buffer:buffer,
		save:save,
		setColor:(byteCount == 3) ? setColor3 : setColor4,
		getColor:(byteCount == 3) ? getColor3 : getColor4,
		width:width,
		height:height
	}
}