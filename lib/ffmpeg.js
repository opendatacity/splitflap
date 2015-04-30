var child_process = require('child_process');
var async = require('async');
var fs = require('fs');

module.exports = function (filename) {
	var log = fs.createWriteStream(filename+'.log');

	var child = child_process.spawn('ffmpeg',
		[
			'-loglevel','debug',
			'-y',
			'-f','rawvideo',
			'-vcodec','rawvideo',
			'-s','1920x1080',
			'-pix_fmt','rgb24',
			'-r','60',
			'-i','-',
			'-an',
			'-c:v','libx264',

			//'-s','960x540',
			//'-r', '30',
			//'-crf','24',
			//'-pix_fmt','yuv420p', // quicktime
			//'-g','30', // save for byte problems
			//'-preset','ultrafast',
			//'-tune','animation',

			
			'-pix_fmt','yuv420p',
			'-g','48', // save for byte problems
			'-tune','animation',
			'-tune','zerolatency',
			'-crf','20',
			'-maxrate','4M',
			'-bufsize','1835k',
			'-vprofile','high',
			'-level','4.2',
			'-threads','4',
			filename
		]
	)

	child.stdout.pipe(log);
	child.stderr.pipe(log);

	child.on('error', function (err) {
		throw err
	})

	var sum = 0;
	var me = {
		addFrame: function (buffer, callback) {
			child.stdin.write(buffer, callback)
		},
		addFrames: function (buffer, count, callback) {
			var i = 0;
			function next() {
				if (i < count) {
					sum += buffer.length;
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
