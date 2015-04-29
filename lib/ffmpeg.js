var child_process = require('child_process');
var async = require('async');

module.exports = function (filename) {
	var child = child_process.spawn('ffmpeg',
		[
			'-y',
			'-f','rawvideo',
			'-vcodec','rawvideo',
			'-s','1920x1080',
			'-pix_fmt','rgb24',
			'-r','60',
			'-i','-',
			'-an',
			'-c:v','libx264',

			'-s','960x540',
			'-r', '30',
			'-crf','16',
			'-pix_fmt','yuv420p', // quicktime
			'-g','30', // save for byte problems
			'-preset','ultrafast',
			'-tune','animation',

			//'-pix_fmt','yuv420p', // quicktime
			//'-g','48', // save for byte problems
			//'-tune','animation',
			//'-tune','zerolatency',
			//'-crf','20',
			//'-maxrate','400k',
			//'-bufsize','1835k',
			//'-vprofile','high',
			//'-level','4.2',
			//'-threads','4',
			// max bit rate 25Mbps
			filename
		]
	)

	child.on('error', function (err) {
		throw err
	})

	var me = {
		addFrame: function (buffer, callback) {
			child.stdin.write(buffer, callback)
		},
		addFrames: function (buffer, count, callback) {
			var i = 0;
			function next() {
				if (i < count) {
					child.stdin.write(buffer, function () {
						i++;
						next();
					});
				} else {
					callback();
				}
			}
			setImmediate(next);
		},
		close: function () {
			child.stdin.end();
		}
	}

	return me;
}
