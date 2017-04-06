# split flap display for re:publica 2015

![Photo](https://raw.githubusercontent.com/opendatacity/splitflap/master/photo.jpg)

Ok, ich bin ja nicht so'n Fan von Doku-Schreiben. Bitte einfach per Twitter fragen: [@MichaelKreil](https://twitter.com/MichaelKreil)

## Installation

Braucht:

  - [node.js](https://nodejs.org)
  - ImageMagick
  - [FFmpeg](https://ffmpeg.org)

Installation:

    git clone git@github.com:opendatacity/splitflap.git
    cd splitflap
    npm install

## Wie funktioniert es?

### Vorbereitung

In der [`config.js`](https://github.com/MichaelKreil/splitflap/blob/master/config.js) wird alles konfiguriert.

Mit [`textures/1_generate_letters.js`](https://github.com/MichaelKreil/splitflap/blob/master/textures/1_generate_letters.js) werden die Letter erzeugt. Die sehen dann so aus:
![letters_400.png](https://github.com/MichaelKreil/splitflap/blob/master/images/letters_400.png)

Mit [`textures/2_raytrace.js`](https://github.com/MichaelKreil/splitflap/blob/master/textures/2_raytrace.js) werden dann die Letter als Textur verwendet, um in JavaScript die Flip-Animation zu raytracen. Jupp, wir reden von einem JavaScript-Raytracer ... ist aber total simpel. Die erzeugten Frames sehen dann so aus:
![texture_400.png](https://github.com/MichaelKreil/splitflap/blob/master/images/texture_400.png)

### Videos

Für die Generierung der Videos werden die Texte als Objects der [`lib/splitflap.js`](https://github.com/MichaelKreil/splitflap/blob/master/lib/splitflap.js)-Library übergeben.
Hier werden dann die Texturen in einem Binary Buffer zusammenkopiert.
Die Buffer werden dann als raw frames (rgb24) nach ffmpeg gepiped, was in der [`lib/ffmpeg.js`](https://github.com/MichaelKreil/splitflap/blob/master/lib/ffmpeg.js)-Library passiert.

Die Scripte
[`server/in_outro.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/in_outro.js)
und
[`server/welcome.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/welcome.js)
erzeugen so die Intro-, Outro- und Welcome-Videos.

### Live-Video

Für die Echtzeit-Session-Ankündigungen gibt's ein noch mehr magic. Oder besser: die Fiddelei formaly known as [`server/generate_sessions.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/generate_sessions.js).
Dort wird im 15-Minuten-Takt die [`sessions.json`](http://data.re-publica.de/data/rp15/sessions.json) runtergeladen, die im Rahmen unseres [re:data-Projektes](http://data.re-publica.de) erzeugt wird.

Neue oder geänderte Sessions werden dann als Video-Ankündigung gerendert. Die aktuell darzustellenden Videos werden als Feeds (`feeds/monitor1-3.rss`) angeboten, die die Player hinter den Screens abonniert haben.

## FAQ

### "Warum ist denn Zeichen xyz nicht dabei?" bzw. "Warum wird kein Russisch/Griechisch/Chinesisch... unterstützt?"

Ich hätte am Liebsten alle Zeichen drin. Z.B. 65'536 UTF-8-Characters. Die bräuchten dann aber 91 Minuten, um einmal durchzuflappen! Also haben wir uns auf den notwendigsten Zeichensatz beschränkt. Alle Character, die nicht darin auftauchen werden teilweise manuell zugeordnet. Also eine "[" wird dann zu einer "(". Die Regular Expressions findet man ganz unten in [`lib/splitflap.js`](https://github.com/MichaelKreil/splitflap/blob/master/lib/splitflap.js)





