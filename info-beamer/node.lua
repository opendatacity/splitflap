-- Parameter

rowCount = 5
colCount = 18

letterSizeX = 100
letterSizeY = 150
letterSpaceX = 2
letterSpaceY = 50
letterCols = 20
letterRows = 13

letterString = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789@#-.,:?!()'

letterCount = 50
frames = 5
textureCount = frames*letterCount

-- Initialisierung

flapCount = rowCount*colCount
--flapCount = 1
offsetX = (1920 - (letterSizeX + letterSpaceX)*colCount + letterSpaceX)/2
offsetY = (1080 - (letterSizeY + letterSpaceY)*rowCount + letterSpaceY)/2

flaps = {}
for i = 0, flapCount-1 do
	col = math.fmod(i,colCount)
	row = math.floor(i/colCount)
	flaps[i] = {
		x = offsetX + col*(letterSizeX + letterSpaceX),
		y = offsetY + row*(letterSizeY + letterSpaceY),
		letter = 0
	}
end

shader = resource.create_shader[[
	uniform sampler2D Texture;
	varying vec2 TexCoord;
	uniform float dx;
	uniform float dy;
	uniform float sx;
	uniform float sy;
	void main() {
		gl_FragColor = texture2D(Texture, (TexCoord + vec2(dx,dy)) * vec2(sx,sy));
	}
]]

-- gl_FragColor = texture2D(Texture, TexCoord.st + vec2(dx,dy));

-- Start


gl.setup(1920, 1080)

util.resource_loader {
	'texture.png'
}

function node.render()
	draw_background()
	--texture:draw(0,0,1920,1080)
	local flap
	for i = 0, flapCount-1 do
		flap = flaps[i]
		flap.letter = math.fmod(flap.letter+0.2, letterCount);
		draw_letter(flap)
	end

	-- roboto_bold:write(250, 300, 'Hello world', 64, 1,1,1,1)
end

function draw_background()
	gl.clear(0,0.18,0.235,1)
end

function draw_letter(flap)
	local textureIndex = flap.letter * frames
	textureIndex = math.fmod(textureIndex, frames*letterCount)
	local dx = math.floor(math.fmod(textureIndex, letterCols))
	local dy = math.floor(textureIndex / letterCols)

	shader:use {
		dx = dx,--dx * letterSizeX,
		dy = letterRows-1-dy,--dy * letterSizeY,
		sx = 1/letterCols,--dx * letterSizeX,
		sy = 1/letterRows,--dy * letterSizeY,
	}
	texture:draw(flap.x, flap.y, flap.x+letterSizeX, flap.y+letterSizeY)
	shader:deactivate()
end