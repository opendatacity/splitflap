-- Parameter

rowCount = 6
colCount = 18

letterSizeX = 100
letterSizeY = 150
letterSpaceX = 0
letterSpaceY = 30
letterCols = 20
letterRows = 13

letterString = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789@#-.,:?!()'

letterCount = string.len(letterString)
frames = 5
textureCount = frames*letterCount

-- Initialisierung

node.set_flag('no_clear', true)

frameNo = 0
flapCount = rowCount*colCount

offsetX = (1920 - (letterSizeX + letterSpaceX)*colCount + letterSpaceX)/2
offsetY = (1080 - (letterSizeY + letterSpaceY)*rowCount + letterSpaceY)/2

flaps = {}
todos = {}
lut = {}

function init()
	for i = 0, flapCount-1 do
		local col = math.fmod(i,colCount)
		local row = math.floor(i/colCount)
		flaps[i] = {
			col = col,
			row = row,
			x = offsetX + col*(letterSizeX + letterSpaceX),
			y = offsetY + row*(letterSizeY + letterSpaceY),
			letter = 0,
			toLetter = 0,
			dx = 0,
			dy = 0
		}
	end

	local replacements = {
		['ß'] = 'SS'
	}

	for i = 1, string.len(letterString) do
		local byte = string.byte(letterString, i)
		lut[byte] = {i-1}
	end

	for key,value in pairs(replacements) do
		local result = {}
		for i = 1, string.len(value) do
			local byte = string.byte(value, i)
			table.insert(result, lut[byte][1])
		end
		local byte = string.byte(key, 1)
		lut[byte] = result
	end

	table.insert(todos, { wait=0, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=3, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=3, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=3, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=3, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=3, msg='@mrtoto:\nMeine iOS App fÜr\ndie @republica\n#rp15 ist jetzt im\nApp Store VerfÜg-\nbar. Mehr infos …' })
	table.insert(todos, { wait=3, msg='Stage E, 15:00\nre:data - Workshop\n\nOpen Data trifft\nre:publica\nmit Michael Kreil' })
	table.insert(todos, { wait=10, msg='' })
	table.insert(todos, { wait=3, msg='' })
end

init()

shader = resource.create_shader[[
	uniform sampler2D Texture;
	varying vec2 TexCoord;
	uniform float d[36];

	const vec2 scale = vec2(18.0/20.0, 1.0/13.0);

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
		vec2 offset = getOffset(i);
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
	local animFinished = true

	for i = 0, flapCount-1 do
		local flap = flaps[i]
		if (flap.letter ~= flap.toLetter) then
			flap.letter = (math.floor(flap.letter*frames+1.5) % (letterCount*frames))/frames;
			animFinished = false
		end
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

	if (animFinished) then
		-- look for next todo
		if (table.maxn(todos) <= 0) then
			return
		end
		if (todos[1].time == nil) then
			todos[1].time = todos[1].wait + sys.now()
		end
		if (todos[1].time < sys.now()) then
			local todo = table.remove(todos, 1)
			for i = 0, flapCount-1 do
				flaps[i].toLetter = 0
			end
			local msg = string.upper(todo.msg)
			local r = 0
			local c = 0
			for i = 1, string.len(msg) do
				local byte = string.byte(msg, i)
				if (byte == 10) then
					r = r + 1
					c = 0
				else
					local pos = lut[byte]
					if (pos == nil) then
						-- unknown character
						print('Unknown character "'..string.sub(msg,i,i)..'" ('..byte..') @'..i..' in "'..msg..'"')
						pos = lut[63]
					end
					for j = 1, table.maxn(pos) do
						if ((c < colCount) and (r < rowCount)) then
							local index = r*colCount + c
							flaps[index].toLetter = pos[j]
							c = c + 1
						end
					end
				end
			end
		end
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
