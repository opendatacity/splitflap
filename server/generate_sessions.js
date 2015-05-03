var fs = require('fs');
var c = require('../config.js');
var Splitflap = require('../lib/splitflap.js');

var pause = 10;

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
var todos = {};
var todoCount = 0;

Splitflap(flaps, function (splitflap) {
	check(splitflap);
	setInterval(
		function () {
			check(splitflap)
		},
		c.sessions.every*1000
	)
})

function check(splitflap) {
	var sessions = loadData();
	var time0 = (new Date()).getTime()/1000;
	for (var t = 0; t < c.sessions.future; t += c.sessions.step) {
		var time = Math.floor((time0 + t)/c.sessions.step)*c.sessions.step;
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
					time1:    s0 ? 'now running: '+sessionTime(s0) : 'ready for boarding …',
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
			var name = monitor.name+'/'+time_str+'_'+hash;
			if (!knownHashs[hash] && !todos[hash]) {
				todos[hash] = {
					hash:hash,
					name:name,
					screenplay:screenplay,
					order:todoCount
				}
				todoCount++;
			}
		})
	}
}

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
	var sessions = JSON.parse(fs.readFileSync('./data/sessions.json', 'utf8'));
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

/*
var state1 = {
	header:   'Stage 1',
	time1:    'now running: 12:15-13:15',
	title1:   'IMMERSIVE JOURNALISM: USING VIRTUAL REALITY FOR NEWS AND NONFICTION',
	speaker1: 'NONNY DE LA PENA',
	time2:    'next: 13:30-14:30',
	title2:   'LIVING IN THE ELECTROMAGNETIC SPECTRUM',
	speaker2: 'JAMES BRIDLE'
}

var state2 = {
	header:   'Stage 4',
	time1:    'now running: 12:15-13:15',
	title1:   'DIGITALES EUROPA - ANALOGES URHEBERRECHT: WIE SCHAFFEN WIR DIE WENDE?',
	speaker1: 'HAKAN TANRIVERDI, JULIA REDA',
	time2:    'next: 13:30-14:30',
	title2:   'BEST PRACTICE: DIE VIRALE KAMPAGE DES UMWELTMINISTERIUMS #ZIEK',
	speaker2: 'SEBASTIAN BACKHAUS, JULIA MUSSGNUG, BARBARA HENDRICKS, MICHAEL SCHROEREN'
}

var state3 = {
	header:   'Stage 7',
	time1:    'now running: nothing',
	title1:   '',
	speaker1: '',
	time2:    'next: 13:30-14:45',
	title2:   'WER HAT DIE MACHT? KONVERGENTE MEDIEN ZWISCHEN WETTBEWERB UND KONTROLLE',
	speaker2: 'JAN KOTTMANN, VOLKER GRASSMUCK, PHILIPP OTTO, BERNHARD PÖRKSEN'
}

var state4 = {
	header:   'Stage 10',
	time1:    'now running: 12:15-13:15',
	title1:   'MEIN LEHNSHERR LIEST MEINE E-MAILS – ZU BESUCH IN EINEM ANDEREN EUROPA',
	speaker1: 'MARTIN FISCHER, CORNELIS KATER, SVEN SEDIVY',
	time2:    'next: 13:30-14:30',
	title2:   'NONPROFIT-JOURNALISMUS – HOW TO',
	speaker2: 'GÜNTER BARTSCH, CHRISTIAN HUMBORG, ISABELLA DAVID, MORITZ TSCHERMAK'
}

var pause = 10;
var screenplay = [state0,0,state1,pause,state2,pause,state3,pause,state4,pause,state1,pause,state0,0]

Splitflap(flaps, function (splitflap) {
	splitflap.renderMovie(screenplay, 'web/video/test.mp4');
});




*/