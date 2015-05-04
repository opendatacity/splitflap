var fs = require('fs');
var path = require('path');
var c = require('../config.js');

var videoFolder = './web/video/';
var feedFolder = './web/feeds/';

var videoFeedTemplate = fs.readFileSync('./data/feed_video.template', 'utf8');

var monitore = [
	{ name:'monitor1', id:1 },
	{ name:'monitor2', id:2 },
	{ name:'monitor3', id:3 }
]

var filenameG = process.argv[2]+'.mp4';



monitore.forEach(function (monitor) {
	var filename = filenameG.replace(/%/g, monitor.id);
	var localFilename = videoFolder + filename;

	if (!fs.existsSync(localFilename)) {
		console.error('File does not exists: "'+localFilename+'"');
		process.exit();
	}

	var filesize = fs.statSync(localFilename).size;

	console.log('Switching to "'+filename+'" ('+filesize+')');


	monitor = monitor.name;

	var feed = videoFeedTemplate.replace(/\{\{.*?\}\}/g, function (key) {
		key = key.substr(2, key.length-4);
		switch (key) {
			case 'monitor': return monitor;
			case 'host': return c.host;
			case 'filename': return filename;
			case 'hash': return (Math.random()*10000000000).toFixed(0);
			case 'filesize': return filesize;
			default:
				console.error('Unknown template key "'+key+'"');
		}
	})
	var feedName = feedFolder+monitor+'.rss';
	console.log('Write "'+feedName+'"');
	fs.writeFileSync(feedName, feed, 'utf8');
})