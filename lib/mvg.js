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
			commands.push('push graphic-context');
			commands.push('stroke none');
			commands.push('fill rgb('+color.join(',')+')');
			commands.push('path "'+path+'"');
			commands.push('pop graphic-context');
		},
		drawText: function (x, y, text, size, color, fontName) {
			var utf8 = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			   return '&#'+i.charCodeAt(0)+';';
			});
			var dy = -size*0.53;
			var font = '"'+fontName+'"';
			if (utf8 == '&#9829;') {
				font = 'Arial';
				dy -= size*0.2;
			}

			commands.push('push graphic-context');
			commands.push('stroke none');
			commands.push('fill rgb('+color.join(',')+')');
			commands.push('font-size '+size);
			commands.push('gravity Center');
			commands.push('font '+font);
			commands.push('text '+(x-w/2+size*0.02)+','+(y+dy)+' "'+text+'"');
			commands.push('pop graphic-context');
		},
		save: function (filename) {
			commands.unshift('viewbox 0 0 '+w+' '+h);
			commands.unshift('push graphic-context');

			commands.push('pop graphic-context');
			commands = commands.join('\n');

			//fs.writeFileSync('test.mvg', commands, 'utf8');

			var img = gm(new Buffer(commands));
			
			img.addSrcFormatter(function (a) {
				a.forEach(function (e,i) { a[i] = 'MVG:'+e });
			});
			img.options({imageMagick: true})

			img.in('-size');
			img.in(w+'x'+h);
			img.in('-background');
			img.in('transparent');

			img.write(filename, function (err) {
				if (err) {
					throw err;
					return
				}
			})
		}

	}

	return me
}

