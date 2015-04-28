var Splitflap = require('../lib/splitflap.js');

var flaps = [
	{key:'header',   font:'bold',   x:48, dy:48, length:29, gap:3},

	{key:'time1',    font:'normal', x:48, dy:90, length:29, gap:3},
	{key:'title1',   font:'bold',   x:48, dy:14, length:29, gap:3},
	{key:'title1',   font:'bold',   x:48, dy:14, length:29, gap:3},
	{key:'speaker1', font:'normal', x:48, dy:14, length:29, gap:3},

	{key:'time2',    font:'normal', x:48, dy:90, length:29, gap:3},
	{key:'title2',   font:'bold',   x:48, dy:14, length:29, gap:3},
	{key:'title2',   font:'bold',   x:48, dy:14, length:29, gap:3},
	{key:'speaker2', font:'normal', x:48, dy:14, length:29, gap:3}
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

var screenplay = [state0,1,state1,10,state2,10,state3,10,state4,10,state1,10,state0,3]

Splitflap(flaps, function (splitflap) {
	splitflap.render(screenplay, 'test.mp4');
});




