var quality = 1;

var config = {
	antialias: quality,
	motionblurCount: quality*quality,
	motionblurStrength: 0.3,
	frames: 5,
	flapRadius: 10,
	flapGap1: 2,
	flapGap2: 10,
	backColor: [0,46,60],
	fonts: [
		{
			flapColor: [0,55,70],
			flapHeight: 80,
			flapWidth: 60,
			fontColor: [255,255,255],
			fontName: './fonts/helvetica_neue_condensed_400.ttf',
			fontSize: 60,
			letters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥@#-.,:?!…',
			name: 'normal',
		},
		{
			flapColor: [0,55,70],
			flapHeight: 80,
			flapWidth: 60,
			fontColor: [255,255,255],
			fontName: './fonts/helvetica_neue_condensed_600.ttf',
			fontSize: 60,
			letters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥@#-.,:?!…',
			name: 'bold',
		}
	]
}

module.exports = config;