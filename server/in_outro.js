
var async = require('async');
var Splitflap = require('../lib/splitflap.js');

var flaps = [
	{key:'title', font:'800', x:48, dy:48, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text',  font:'400', x:48, dy:33, length:29, gap:3}
]

var pause = 5;
var empty = {title:'', text:''};

var intro = {
	title:'intro',
	filename:'intro.mp4',
	screenplay: [
		empty,0,
		{
			title:'Hello Earthling!',
			text: 'Welcome to re:publica 2015. While we wait for take off, watch out for unattended life forms and hug them immediately!'
		}, pause,
		{
			title:'Hallo Erdling!',
			text: 'Willkommen auf der re:publica 2015. Während wir auf den Abflug warten, halt die Augen offen nach unbeaufsichtigten Lebensformen – und umarm sie ganz schnell!'
		}, pause,
		{
			title:'Salve terrestre!',
			text: 'Benvenuto a re:publica 2015! Mentre aspettiamo per il decollo, fai attenzione a eventuali forme di vita inattese e abbracciatele subito!'
		}, pause,
		{
			title:'¡Hola, terrícola!',
			text: 'Bienvenido a re:publica 2015. Mientras esperamos el despegue, ¡preste atención a formas de vida desatendidas y dales un abrazo!'
		}, pause,
		{
			title:'Salut terrien!',
			text: 'Bienvenue à re:publica 2015! Pendant que nous attendons le lancement, faites attention aux formes de vie sans surveillance et embarrassez-les tout de suite.'
		}, pause,
		empty
	]
}

var outro = {
	title:'outro',
	filename:'outro.mp4',
	screenplay: [
		empty,0,
		{
			title:'OMG, it\'s over…',
			text: 'We hope you had a fabulous re:publica! Now party all night long! See you at #rp16! And don\'t forget to call your MAMAAA!'
		}, pause,
		{
			title:'OMG, und schon ist es vorbei…',
			text: 'Hoffentlich hattet ihr alle eine wunderbare re:publica! Jetzt wird gefeiert! Wir sehen uns auf der #rp16! And don\'t forget to call your MAMAAA!'
		}, pause,
		{
			title:'OMG, è già finito…',
			text: 'Speriamo che re:publica sia stata favolosa per tutti voi! Allora...facciamo festa tutta la notte! Ci vediamo a #rp16! And don\'t forget to call your MAMAAA!'
		}, pause,
		{
			title:'OMG, ya se acabó…',
			text: 'Esperamos che hayáis tenido una re:publica fantástica! Y ahora: ¡fiesta toda la noche! Nos vemos a #rp16! And don\'t forget to call your MAMAAA!'
		}, pause,
		{
			title:'OMG c\'est fini…',
			text: 'nous espérons que vous avez eu une re:publica formidable! Alors, passez la nuit à danser! On se revoit à #16! And don\'t forget to call your MAMAAA!'
		}, pause,
		empty
	]
}

Splitflap(flaps, function (splitflap) {
	async.eachSeries(
		[intro, outro],
		function (movie, callback) {
			console.log('Render "'+movie.title+'"');
			splitflap.render(movie.screenplay, movie.filename, callback);
		},
		function () {
			console.log('Finished')
		}
	)
});




