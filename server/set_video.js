var fs = require('fs');
var path = require('path');
var c = require('../config.js');

var videoFolder = './web/video/';
var feedFolder = './web/feeds/';

var videoFeedTemplate = fs.readFileSync('./data/feed_video.template', 'utf8');

var monitore = [
	{ name:'monitor1', stages:['STG-1','STG-4','STG-7','STG-10']},
	{ name:'monitor2', stages:['STG-2','STG-5','STG-8','STG-11']},
	{ name:'monitor3', stages:['STG-3','STG-6','STG-9','STG-T' ]}
]

var filename = process.argv[2]+'.mp4';
var localFilename = videoFolder + filename;

if (!fs.existsSync(localFilename)) {
	console.error('File does not exists: "'+localFilename+'"');
	process.exit();
}

var filesize = fs.statSync(localFilename).size;

console.log('Switching to "'+filename+'" ('+filesize+')');



monitore.forEach(function (monitor) {
	monitor = monitor.name;

	var feed = videoFeedTemplate.replace(/\{\{.*?\}\}/g, function (key) {
		key = key.substr(2, key.length-4);
		switch (key) {
			case 'monitor': return monitor;
			case 'host': return c.host;
			case 'filename': return filename;
			case 'hash': return filename;
			case 'filesize': return filesize;
			default:
				console.error('Unknown template key "'+key+'"');
		}
	})
	var feedName = feedFolder+monitor+'.rss';
	console.log('Write "'+feedName+'"');
	fs.writeFileSync(feedName, feed, 'utf8');
})