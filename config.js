
var config = {
	antialias: 2,
	frames: 15,
	speed: 3,
	motionblurCount: 8,
	motionblurStrength: 1,
	flapRadius: 10,
	flapGap1: 1,
	flapGap2: 10,
	fps: 60,
	backColor: [0,46,60],
	defaultFont: {
		flapColor: [0,55,70],
		flapHeight: 80,
		flapWidth: 60,
		fontColor: [255,255,255],
		fontName: './fonts/helvetica_neue_condensed_400.ttf',
		fontSize: 60,
		letters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥@#-.,:?!/\'…',
		name: 'normal',
	},
	fonts: [
		{ name: '100', fontName: './fonts/helvetica_neue_condensed_100.ttf' },
		{ name: '200', fontName: './fonts/helvetica_neue_condensed_200.ttf' },
		{ name: '300', fontName: './fonts/helvetica_neue_condensed_300.ttf' },
		{ name: '400', fontName: './fonts/helvetica_neue_condensed_400.ttf' },
		{ name: '500', fontName: './fonts/helvetica_neue_condensed_500.ttf' },
		{ name: '600', fontName: './fonts/helvetica_neue_condensed_600.ttf' },
		{ name: '700', fontName: './fonts/helvetica_neue_condensed_700.ttf' },
		{ name: '800', fontName: './fonts/helvetica_neue_condensed_800.ttf' },
		{ name: '900', fontName: './fonts/helvetica_neue_condensed_900.ttf' }
	]
}

config.fonts.forEach(function (font) {
	Object.keys(config.defaultFont).forEach(function (key) {
		if (!font[key]) font[key] = config.defaultFont[key];
	})
})

module.exports = config;

