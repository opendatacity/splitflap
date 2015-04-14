var fs = require('fs');
var gm = require('gm');

module.exports = function (w, h) {
	var commands = [];
	var me = {
		drawPath: function (path, color) {
			path = path.map(function (entry) {
				if (Array.isArray(entry)) return entry.join(',');
				return entry;
			}).join(' ');
			commands.push('<path d="'+path+'" stroke="none" fill="rgb('+color.join(',')+')"/>');
		},
		drawText: function (x, y, text, size, color) {
			commands.push(
				'<text x="'+x+'" y="'+y+'" dy="'+(size*0.37)+'" font-size="'+size+'" stroke="none" fill="rgb('+color.join(',')+')" text-anchor="middle">'+text+'</text>'
			)
		},
		save: function (filename) {
			commands.unshift('<svg width="'+w+'" height="'+h+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">');
			commands.push('</svg>');
			commands = commands.join('\n');

			fs.writeFileSync('test.svg', commands, 'utf8');

			var img = gm(new Buffer(commands));
			
			img.addSrcFormatter(function (a) {
				a.forEach(function (e,i) { a[i] = 'SVG:'+e });
			});
			img.options({imageMagick: true})
			img.in('-font');
			img.in('./fonts/roboto_condensed_bold.ttf');
			img.in('-size');
			img.in(w+'x'+h);
			img.in('-background');
			img.in('transparent');

			img.write(filename, function (err) {
				if (err) {
					console.error(err);
					return
				}
			})
		}

	}

	return me
}

