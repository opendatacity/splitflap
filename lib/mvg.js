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
			function escape(t) {
				return t.replace(/[\"\\]/g, c => '\\'+c);
			}
			var dy = -size*0.53;

			commands.push('push graphic-context');
			commands.push('stroke none');
			commands.push('fill rgb('+color.join(',')+')');
			commands.push('font-size '+size);
			commands.push('gravity Center');
			commands.push('font "'+escape(fontName)+'"');
			commands.push('text '+(x-w/2+size*0.02)+','+(y+dy)+' "'+escape(text)+'"');
			commands.push('pop graphic-context');
		},
		save: function (filename, callback) {
			commands.unshift('viewbox 0 0 '+w+' '+h);
			commands.unshift('push graphic-context');
			commands.unshift('encoding "UTF-8"');

			commands.push('pop graphic-context');
			commands = commands.join('\n');

			var img = gm(new Buffer(commands));
			
			img.addSrcFormatter(function (a) {
				a.forEach(function (e,i) { a[i] = 'MVG:'+e });
			});
			img.options({imageMagick: true})

			img.in('-size');
			img.in(w+'x'+h);
			img.in('-background');
			img.in('transparent');

			img.out('-depth');
			img.out('8');

			img.write(filename, function (err) {
				if (err) throw err;
				if (callback) callback();
			})
		}

	}

	return me
}

