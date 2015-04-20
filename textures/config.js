var type = process.argv[2];
if (!type) type = '400'

var config = {
	letters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥@#-.,:?!…',
	antialias: 4,
	motionblurCount: 16,
	motionblurStrength: 0.2,
	frames: 5,
	flapWidth: 100,
	flapHeight: 150,
	flapRadius: 20,
	flapGap1: 2,
	flapGap2: 15,
	backColor: [0,46,60],
	flapColor: [0,55,70],
	fontColor: [255,255,255],
	fontName: './fonts/helvetica_neue_condensed_'+type+'.ttf',
	suffix: '_'+type
}

config.letterCount = config.letters.length;
config.letterCols = Math.floor(2048/config.flapWidth);

module.exports = config;

