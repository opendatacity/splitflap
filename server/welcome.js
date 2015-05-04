var async = require('async');
var Splitflap = require('../lib/splitflap.js');

var flaps = [
	{key:'text', font:'400', x:48, dy:48, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3},
	{key:'text', font:'400', x:48, dy:33, length:29, gap:3}
]

var pause = 15;
var empty = {text:''};

var todos = [
	{
		title:'welcome1',
		filename:'welcome1.mp4',
		screenplay: [
			empty,0,
			{ text: 'Hello Earthling! We warmly welcome you to re:publica 2015. This is the place to be inspired, have great discussions and meet like-minded people!'}, pause,
			{ text: 'Zdravíme tě, pozemšťane! Srdečně tě vítáme na konferenci re:publica 2015. Jde o místo, kde se můžeš nechat inspirovat, vést skvělé diskuse a setkat se se stejně smýšlejícími lidmi.'}, pause,
			{ text: 'Pozdravljen Zemljan/Zemljanka! Dobrošel/-la na konferenci re:publica 2015. To je mesto navdiha, dobrih razprav in spoznavanja enakomislečih ljudi!'}, pause,
			{ text: 'Helló földlakó! Sok szeretettel üdvözöl a re:publica 2015. Ez az a hely ahol inspirációt meríthetsz, jókat beszélgethetsz és találkozhatsz hasonlóan gondolkodó emberekkel! '}, pause,
			{ text: 'Hallo Erdling! Herzlich willkommen auf der re:publica 2015. Lass Dich inspirieren, führe spannende Diskussionen und lerne Gleichgesinnte kennen!'}, pause,
			{ text: 'Hallo Jordbo! Hjertelig velkommen til re:publica 2015. Her er stedet, hvor du kan hente inspiration, diskutere på livet løs og møde ligesindede!'}, pause,
			{ text: 'Cześć Ziemianinie! Gorąco witamy Cię na re:publica 2015. To miejsce, w którym doznasz inspiracji, weźmiesz udział w ciekawych dyskusjach i spotkasz ludzi myślących podobnie jak Ty!'}, pause,
			empty
		]
	},
	{
		title:'welcome2',
		filename:'welcome2.mp4',
		screenplay: [
			empty,0,
			{ text: 'Hallo aardbewoner! We heten je van harte welkom bij re:publica 2015. Dit is dé plek om inspiratie op te doen, mee te doen aan fantastische discussies en gelijkgezinde mensen te ontmoeten!'}, pause,
			{ text: 'Olá, terráqueos! Sejam muito bem-vindos à re:publica 2015. Este é o local onde podem inspirar-se, participar em grandes discussões e conhecer pessoas com os mesmos ideais!'}, pause,
			{ text: 'Salve terrestre! Ti diamo un caloroso benvenuto a re:publica 2015. Qui potrai trovare ispirazione, avviare discussioni interessanti e incontrare persone con le tue stesse idee!'}, pause,
			{ text: 'Ahoj pozemšťan! Srdečne Ťa vítame na konferencii „re:publica 2015“! Mieste plnom inšpirácií, vzrušujúcich diskusií a stretnutí s podobne zmýšľajúcimi ľuďmi! '}, pause,
			{ text: '¡Hola, terrícola! Te damos la más calurosa bienvenida a re.publica 2015. Este es un encuentro para inspirarse, mantener charlas apasionantes y conocer a muchas otras personas de ideas afines. '}, pause,
			{ text: 'Pozdrav Zemljanine! Želimo vam srdačnu dobrodošlicu na konferenciju re:publica 2015. To je mjesto koje nadahnjuje i omogućuje izvrsne rasprave te susrete s istomišljenicima!'}, pause,
			{ text: 'Hallå där, jordbo! Varmt välkommen till re:publica 2015. Här får du inspiration, möjlighet att delta i spännande diskussioner och träffa likasinnade!'}, pause,
			empty
		]
	},
	{
		title:'welcome3',
		filename:'welcome3.mp4',
		screenplay: [
			empty,0,
			{ text: 'Bonjour chers terriens ! Nous vous souhaitons chaleureusement la bienvenue à re:publica 2015. Il s’agit du parfait endroit pour être inspiré, pour mener de bonnes discussions tout en rencontrant des personnes qui partagent les mêmes idées !'}, pause,
			{ text: 'Insellmulek, ċittadin tad-dinja! Nilqgħuk għal re:publica 2015. Dan hu l-post fejn tiġi ispirat, ikollok diskussjonijiet interessanti u tiltaqa’ ma’ nies li jaħsbuha bħalek!'}, pause,
			{ text: 'Tere, maalane! Tervitame sind soojalt konverentsil re:publica 2015. See on koht, kus innustuda, pidada võrratuid arutelusid ja kohtuda mõttekaaslastega!'}, pause,
			{ text: 'Heileo a Dhúil Dhomhanda! Cuirimid fáilte chroíúil romhat chuig re:publica 2015. Seo an áit a spreagfar thú, a mbeidh comhráití iontacha agat agus a mbuailfidh tú le daoine a bhfuil an dearcadh céanna acu leatsa! '}, pause,
			{ text: 'Salutare, pământeanule! Bun venit la re:publica 2015. Aici găseşti inspiraţie, dezbateri excelente şi oameni care îţi împărtăşesc viziunea!'}, pause,
			{ text: 'Sveicināts, Zemes iedzīvotāj! Sirsnīgi sveicam Tevi re-publica 2015! Šī ir vieta, kurā … gūt iedvesmu, lieliski izdiskutēties un satikt domubiedrus.'}, pause,
			{ text: 'Hei maan asukas! Toivotamme teidät lämpimästi tervetulleeksi vuoden 2015 re:publicaan. Tämä on paikka inspiroitua, käydä loistavia keskusteluita ja tavata samanhenkisiä ihmisiä!'}, pause,
			empty
		]
	},
	{
		title:'welcome',
		filename:'welcome.mp4',
		screenplay: [
			empty,0,
			{ text: 'Hello Earthling! We warmly welcome you to re:publica 2015. This is the place to be inspired, have great discussions and meet like-minded people!'}, pause,
			{ text: 'Zdravíme tě, pozemšťane! Srdečně tě vítáme na konferenci re:publica 2015. Jde o místo, kde se můžeš nechat inspirovat, vést skvělé diskuse a setkat se se stejně smýšlejícími lidmi.'}, pause,
			{ text: 'Pozdravljen Zemljan/Zemljanka! Dobrošel/-la na konferenci re:publica 2015. To je mesto navdiha, dobrih razprav in spoznavanja enakomislečih ljudi!'}, pause,
			{ text: 'Helló földlakó! Sok szeretettel üdvözöl a re:publica 2015. Ez az a hely ahol inspirációt meríthetsz, jókat beszélgethetsz és találkozhatsz hasonlóan gondolkodó emberekkel! '}, pause,
			{ text: 'Hallo Erdling! Herzlich willkommen auf der re:publica 2015. Lass Dich inspirieren, führe spannende Diskussionen und lerne Gleichgesinnte kennen!'}, pause,
			{ text: 'Hallo Jordbo! Hjertelig velkommen til re:publica 2015. Her er stedet, hvor du kan hente inspiration, diskutere på livet løs og møde ligesindede!'}, pause,
			{ text: 'Cześć Ziemianinie! Gorąco witamy Cię na re:publica 2015. To miejsce, w którym doznasz inspiracji, weźmiesz udział w ciekawych dyskusjach i spotkasz ludzi myślących podobnie jak Ty!'}, pause,
			{ text: 'Hallo aardbewoner! We heten je van harte welkom bij re:publica 2015. Dit is dé plek om inspiratie op te doen, mee te doen aan fantastische discussies en gelijkgezinde mensen te ontmoeten!'}, pause,
			{ text: 'Olá, terráqueos! Sejam muito bem-vindos à re:publica 2015. Este é o local onde podem inspirar-se, participar em grandes discussões e conhecer pessoas com os mesmos ideais!'}, pause,
			{ text: 'Salve terrestre! Ti diamo un caloroso benvenuto a re:publica 2015. Qui potrai trovare ispirazione, avviare discussioni interessanti e incontrare persone con le tue stesse idee!'}, pause,
			{ text: 'Ahoj pozemšťan! Srdečne Ťa vítame na konferencii „re:publica 2015“! Mieste plnom inšpirácií, vzrušujúcich diskusií a stretnutí s podobne zmýšľajúcimi ľuďmi! '}, pause,
			{ text: '¡Hola, terrícola! Te damos la más calurosa bienvenida a re.publica 2015. Este es un encuentro para inspirarse, mantener charlas apasionantes y conocer a muchas otras personas de ideas afines. '}, pause,
			{ text: 'Pozdrav Zemljanine! Želimo vam srdačnu dobrodošlicu na konferenciju re:publica 2015. To je mjesto koje nadahnjuje i omogućuje izvrsne rasprave te susrete s istomišljenicima!'}, pause,
			{ text: 'Hallå där, jordbo! Varmt välkommen till re:publica 2015. Här får du inspiration, möjlighet att delta i spännande diskussioner och träffa likasinnade!'}, pause,
			{ text: 'Bonjour chers terriens ! Nous vous souhaitons chaleureusement la bienvenue à re:publica 2015. Il s’agit du parfait endroit pour être inspiré, pour mener de bonnes discussions tout en rencontrant des personnes qui partagent les mêmes idées !'}, pause,
			{ text: 'Insellmulek, ċittadin tad-dinja! Nilqgħuk għal re:publica 2015. Dan hu l-post fejn tiġi ispirat, ikollok diskussjonijiet interessanti u tiltaqa’ ma’ nies li jaħsbuha bħalek!'}, pause,
			{ text: 'Tere, maalane! Tervitame sind soojalt konverentsil re:publica 2015. See on koht, kus innustuda, pidada võrratuid arutelusid ja kohtuda mõttekaaslastega!'}, pause,
			{ text: 'Heileo a Dhúil Dhomhanda! Cuirimid fáilte chroíúil romhat chuig re:publica 2015. Seo an áit a spreagfar thú, a mbeidh comhráití iontacha agat agus a mbuailfidh tú le daoine a bhfuil an dearcadh céanna acu leatsa! '}, pause,
			{ text: 'Salutare, pământeanule! Bun venit la re:publica 2015. Aici găseşti inspiraţie, dezbateri excelente şi oameni care îţi împărtăşesc viziunea!'}, pause,
			{ text: 'Sveicināts, Zemes iedzīvotāj! Sirsnīgi sveicam Tevi re-publica 2015! Šī ir vieta, kurā … gūt iedvesmu, lieliski izdiskutēties un satikt domubiedrus.'}, pause,
			{ text: 'Hei maan asukas! Toivotamme teidät lämpimästi tervetulleeksi vuoden 2015 re:publicaan. Tämä on paikka inspiroitua, käydä loistavia keskusteluita ja tavata samanhenkisiä ihmisiä!'}, pause,
			{ text: 'Sveiki, Žemės gyventojai! Nuoširdžiai sveikiname atvykus į „re:publica 2015“. Tai puiki vieta pasisemti įkvėpimo, dalyvauti įdomiose diskusijose ir susipažinti su bendraminčiais!'}, pause,
			empty
		]
	}
]

Splitflap(flaps, function (splitflap) {
	async.eachSeries(
		todos,
		function (movie, callback) {
			console.log('Render "'+movie.title+'"');
			splitflap.renderMovie(movie.screenplay, movie.filename, callback);
		},
		function () {
			console.log('Finished')
		}
	)
});




