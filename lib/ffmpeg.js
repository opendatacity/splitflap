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
			'-preset','ultrafast',
			'-tune','animation',
			'-crf','16',
			filename
		]
	)

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
