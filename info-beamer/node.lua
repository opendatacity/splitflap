-- Parameter

rowCount = 7
colCount = 19

letterSizeX = 100
letterSizeY = 150
letterSpaceX = 0
letterSpaceY = 0
letterCols = 20
letterRows = 13

letterString = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789@#-.,:?!()'

letterCount = 50
frames = 5
textureCount = frames*letterCount

-- Initialisierung

node.set_flag('no_clear', true)

frameNo = 0
flapCount = rowCount*colCount

offsetX = (1920 - (letterSizeX + letterSpaceX)*colCount + letterSpaceX)/2
offsetY = (1080 - (letterSizeY + letterSpaceY)*rowCount + letterSpaceY)/2

flaps = {}
for i = 0, flapCount-1 do
	col = math.fmod(i,colCount)
	row = math.floor(i/colCount)
	flaps[i] = {
		col = col,
		row = row,
		x = offsetX + col*(letterSizeX + letterSpaceX),
		y = offsetY + row*(letterSizeY + letterSpaceY),
		letter = math.floor(math.random() * letterCount),
		dx = 0,
		dy = 0
	}
end

shader = resource.create_shader[[
	uniform sampler2D Texture;
	varying vec2 TexCoord;
	uniform float d[36];

	const vec2 scale = vec2(0.9, 1.0/13.0);

	vec2 getOffset(int i) {
		vec2 offset = vec2(0,0);
		if (i < 16) {
			if (i < 8) {
				if (i < 4) {
					if (i < 2) {
						if (i < 1) {
							offset = vec2(d[ 0],d[ 1]);
						} else {
							offset = vec2(d[ 2],d[ 3]);
						}
					} else {
						if (i < 3) {
							offset = vec2(d[ 4],d[ 5]);
						} else {
							offset = vec2(d[ 6],d[ 7]);
						}
					}
				} else {
					if (i < 6) {
						if (i < 5) {
							offset = vec2(d[ 8],d[ 9]);
						} else {
							offset = vec2(d[10],d[11]);
						}
					} else {
						if (i < 7) {
							offset = vec2(d[12],d[13]);
						} else {
							offset = vec2(d[14],d[15]);
						}
					}
				}
			} else {
				if (i < 12) {
					if (i < 10) {
						if (i < 9) {
							offset = vec2(d[16],d[17]);
						} else {
							offset = vec2(d[18],d[19]);
						}
					} else {
						if (i < 11) {
							offset = vec2(d[20],d[21]);
						} else {
							offset = vec2(d[22],d[23]);
						}
					}
				} else {
					if (i < 14) {
						if (i < 13) {
							offset = vec2(d[24],d[25]);
						} else {
							offset = vec2(d[26],d[27]);
						}
					} else {
						if (i < 15) {
							offset = vec2(d[28],d[29]);
						} else {
							offset = vec2(d[30],d[31]);
						}
					}
				}
			}
		} else {
			if (i < 17) {
				offset = vec2(d[32],d[33]);
			} else {
				offset = vec2(d[34],d[35]);
			}
		}
		return offset;
	}

	void main() {
		int i = int(TexCoord.x*18.0);
		vec2 offset = vec2(0.0,0.0); //getOffset(i);
		gl_FragColor = texture2D(Texture, TexCoord*scale + offset);
	}
]]


-- Start


gl.setup(1920, 1080)

util.resource_loader {
	'texture.png'
}

function node.render()
	node.set_flag('no_clear', true)

	draw_background()
	local textureIndex, dx, dy

	for i = 0, flapCount-1 do
		local flap = flaps[i]
		flap.letter = math.fmod(flap.letter+0.2, letterCount);
		textureIndex = flap.letter * frames
		textureIndex = math.fmod(textureIndex, frames*letterCount)
		dx = math.floor(math.fmod(textureIndex, letterCols))
		dy = math.floor(textureIndex / letterCols)
		flap.dx = (dx-flap.col)/letterCols
		flap.dy = 1-(1+dy)/letterRows
	end

	for r = 0, rowCount-1 do
		draw_row(r)
	end

end

function draw_background()
	gl.clear(0,0.18,0.235,1)
end

function draw_row(r)
	local fett = "hallo"
	local i = r*colCount
	local params = {
		d  = {
			flaps[i+ 0].dx, flaps[i+ 0].dy,
			flaps[i+ 1].dx, flaps[i+ 1].dy,
			flaps[i+ 2].dx, flaps[i+ 2].dy,
			flaps[i+ 3].dx, flaps[i+ 3].dy,
			flaps[i+ 4].dx, flaps[i+ 4].dy,
			flaps[i+ 5].dx, flaps[i+ 5].dy,
			flaps[i+ 6].dx, flaps[i+ 6].dy,
			flaps[i+ 7].dx, flaps[i+ 7].dy,
			flaps[i+ 8].dx, flaps[i+ 8].dy,
			flaps[i+ 9].dx, flaps[i+ 9].dy,
			flaps[i+10].dx, flaps[i+10].dy,
			flaps[i+11].dx, flaps[i+11].dy,
			flaps[i+12].dx, flaps[i+12].dy,
			flaps[i+13].dx, flaps[i+13].dy,
			flaps[i+14].dx, flaps[i+14].dy,
			flaps[i+15].dx, flaps[i+15].dy,
			flaps[i+16].dx, flaps[i+16].dy,
			flaps[i+17].dx, flaps[i+17].dy
		}
	}

	local x0 = offsetX
	local y0 = offsetY + r*(letterSizeY + letterSpaceY)
	local x1 = x0 + colCount*(letterSizeX + letterSpaceX) - letterSpaceX
	local y1 = y0 + letterSizeY

	shader:use(params)
	texture:draw(x0, y0, x1, y1)
	shader:deactivate()
end
