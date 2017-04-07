var child_process = require('child_process');
var async = require('async');
var fs = require('fs');
var c = require('../config.js');

var parameters = {
	lossless: [
		'-c:v','prores'
	],
	preview: [
		'-c:v','libx264',
		'-s',Math.round(c.width/2)+'x'+Math.round(c.height/2),
		'-crf','16',
		'-pix_fmt','yuv420p', // quicktime
		'-g','30', // save for byte problems
		'-preset','ultrafast',
		'-tune','animation',
	],
	player_hq: [
		//'-preset','ultrafast',
		'-pix_fmt','yuv420p',
		//'-g','48', // save for byte problems
		'-tune','animation',
		'-crf','20',
		'-maxrate','8M',
		//'-bufsize','1835k',
		'-vprofile','high',
		'-level','4.2',
	]
}

module.exports = function (filename, profile) {
	var log = fs.createWriteStream(filename+'.log');

	if (!profile) profile = 'player_hq';
	if (!parameters[profile]) {
		throw new Error('Unknown profile "'+profile+'". Expected: '+Object.keys(parameters).join(', '));
	}

	var args =[
		'-loglevel','debug',
		'-y',
		'-f','rawvideo',
		'-vcodec','rawvideo',
		'-s',c.width+'x'+c.height,
		'-pix_fmt','rgb24',
		'-r','60',
		'-i','-',
		'-an',
		'-threads','4'
	];
	args = args.concat(parameters[profile]);
	args.push(filename);

	var child = child_process.spawn('ffmpeg', args);

	child.stdout.pipe(log);
	child.stderr.pipe(log);

	child.on('error', err => {throw err})
	child.stdin.on('error', err => {throw err})
	//child.stdout.on('data', data => console.log(data.toString('utf8')));
	//child.stderr.on('data', data => console.log(data.toString('utf8')));

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
						setImmediate(next);
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
