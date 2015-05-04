var fs = require('fs');
var path = require('path');
var request = require('request');
var c = require('../config.js');
var Splitflap = require('../lib/splitflap.js');

var pause = 15;
var knownHashsFilename = './data/knownHashs.json';
var videoFolder = './web/video/';
var feedFolder = './web/feeds/';

var feedTemplate = fs.readFileSync('./data/feed.template', 'utf8');

var flaps = [
	{key:'header',   font:'800', x:48, dy:48, length:29, gap:3},

	{key:'time1',    font:'400', x:48, dy:90, length:29, gap:3},
	{key:'title1',   font:'800', x:48, dy:14, length:29, gap:3},
	{key:'title1',   font:'800', x:48, dy:14, length:29, gap:3},
	{key:'speaker1', font:'400', x:48, dy:14, length:29, gap:3},

	{key:'time2',    font:'400', x:48, dy:90, length:29, gap:3},
	{key:'title2',   font:'800', x:48, dy:14, length:29, gap:3},
	{key:'title2',   font:'800', x:48, dy:14, length:29, gap:3},
	{key:'speaker2', font:'400', x:48, dy:14, length:29, gap:3}
]

var state0 = {
	header:   '',
	time1:    '',
	title1:   '',
	speaker1: '',
	time2:    '',
	title2:   '',
	speaker2: ''
}

var monitore = [
	{ name:'monitor1', stages:['STG-1','STG-4','STG-7','STG-10']},
	{ name:'monitor2', stages:['STG-2','STG-5','STG-8','STG-11']},
	{ name:'monitor3', stages:['STG-3','STG-6','STG-9','STG-T' ]}
]

var knownHashs = {};
if (fs.existsSync(knownHashsFilename)) {
	knownHashs = fs.readFileSync(knownHashsFilename, 'utf8');
	knownHashs = JSON.parse(knownHashs);
}


Splitflap(flaps, function (splitflap) {
	var todos = {};
	var queue = {};
	var todoCount = 0;
	var todoRunning = false;

	checkData();
	setInterval(checkData, c.sessions.updateDataEvery*1000);

	checkFeed();
	setInterval(checkFeed, c.sessions.updateFeedEvery*1000);

	function checkFeed() {
		console.log('checkFeed');

		var time = (new Date()).getTime();

		monitore.forEach(function (monitor) {
			monitor = monitor.name;
			var nextEntry = false;
			Object.keys(queue).forEach(function (key) {
				var entry = queue[key];
				if (entry.monitor != monitor) return;
				if (entry.startTime > time) return;
				if (!nextEntry) return (nextEntry = entry);
				if (nextEntry.startTime < entry.startTime) nextEntry = entry;
			})

			if (!nextEntry) return console.error('Entry not found');

			var feed = feedTemplate.replace(/\{\{.*?\}\}/g, function (key) {
				key = key.substr(2, key.length-4);
				switch (key) {
					case 'monitor': return monitor;
					case 'host': return c.host;
					case 'filename': return nextEntry.filename;
					case 'hash': return nextEntry.hash;
					case 'filesize': return nextEntry.filesize;
					default:
						console.error('Unknown template key "'+key+'"');
				}
			})
			var filename = feedFolder+monitor+'.rss';
			console.log('Write "'+filename+'"');
			fs.writeFileSync(filename, feed, 'utf8');
		})
	}

	function checkTodo() {
		if (todoRunning) return;
		todoRunning = true;

		var _todos = Object.keys(todos).map(function (key) { return todos[key]; });

		if (_todos.length <= 0) {
			todoRunning = false;
			return;
		}

		console.log('checkTodo');

		_todos.sort(function (a,b) { return b.order - a.order; })
		var todo = _todos.pop();

		console.log('Generating "'+todo.filename+'"');
		splitflap.renderMovie(todo.screenplay, videoFolder+'temp.mp4', function () {
			checkFolder(path.dirname(videoFolder+todo.filename));
			fs.renameSync(videoFolder+'temp.mp4', videoFolder+todo.filename)

			knownHashs[todo.hash] = {
				filename: todo.filename,
				filesize: fs.statSync(videoFolder+todo.filename).size
			}

			fs.writeFileSync(knownHashsFilename, JSON.stringify(knownHashs, null, '\t'), 'utf8');
			
			todoRunning = false;
			delete todos[todo.hash];

			checkTodo();
		});
	}

	function checkData() {
		console.log('checkData');

		queue = {};
		var sessions = loadData();
		var time0 = (new Date()).getTime()/1000;
		todoCount = 0;

		for (var t = 0; t < c.sessions.future; t += c.sessions.loopTimeStep) {
			var time = Math.floor((time0 + t)/c.sessions.loopTimeStep)*c.sessions.loopTimeStep;
			var time_str = (new Date((time+2*3600)*1000)).toISOString().substr(0,16);

			monitore.forEach(function (monitor) {
				var screenplay = [state0,0];

				monitor.stages.forEach(function (stage) {
					var s0 = false; // current session
					var s1 = false; // next session

					sessions.forEach(function (session) {
						if (session.location != stage) return;
						if ((session.beginT <= time) && (time <= session.endT)) s0 = session;
						if (session.beginT > time) {
							if (!s1) {
								s1 = session;
							} else {
								if (session.beginT < s1.beginT) s1 = session;
							}
						}
					})

					var state = {
						header:   stage,
						time1:    s0 ? 'now running: '+sessionTime(s0) : 'ready for boarding',
						title1:   s0 ? s0.title : '',
						speaker1: s0 ? s0.speakers : '',
						time2:    s1 ? 'next: '+sessionTime(s1) : '',
						title2:   s1 ? s1.title : '',
						speaker2: s1 ? s1.speakers : ''
					}

					screenplay.push(state, pause);
				})

				screenplay.push(state0);

				var hash = splitflap.getHash(screenplay);

				if (knownHashs[hash] && !queue[hash]) {
					queue[hash] = {
						hash:hash,
						monitor:monitor.name,
						startTime:(new Date(time*1000)).getTime(),
						filename:knownHashs[hash].filename,
						filesize:knownHashs[hash].filesize
					}
				}
				if (!knownHashs[hash] && !todos[hash]) {
					todos[hash] = {
						hash:hash,
						startTime:(new Date(time*1000)),
						filename:monitor.name+'/'+time_str+'_'+hash+'.mp4',
						order:todoCount,
						screenplay:screenplay
					}
					todoCount++;
				}
			})
		}

		checkTodo();
	}
})

function sessionTime(session) {
	return [
		session.begin.getHours(),
		':',
		(session.begin.getMinutes()+100).toFixed(0).substr(1),
		'-',
		session.end.getHours(),
		':',
		(session.end.getMinutes()+100).toFixed(0).substr(1)
	].join('');
}

function loadData() {
	var sessions;
	try {
		sessions = JSON.parse(fs.readFileSync('./data/sessions.json', 'utf8'));
	} catch (e) {
		sessions = [];
	}

	request('http://data.re-publica.de/data/rp15/sessions.json').pipe(fs.createWriteStream('./data/sessions.json'))

	sessions = sessions.filter(function (session) {
		if (!session.begin) return false;
		if (!session.end) return false;
		if (!session.duration) return false;
		if (!session.location) return false;

		session.begin = new Date(session.begin);
		session.beginT = session.begin.getTime()/1000;
		session.end = new Date(session.end);
		session.endT = session.end.getTime()/1000;
		session.location = session.location.label_de;
		session.speakers = session.speakers.map(function (speaker) { return speaker.name }).join(', ');

		return true;
	})
	return sessions;
}

function checkFolder(folder) {
	if (!fs.existsSync(folder)) {
		checkFolder(path.dirname(folder));
		fs.mkdirSync(folder);
	}
}