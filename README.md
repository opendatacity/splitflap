# split flap display for re:publica 2015

Ok, ich bin ja nicht so'n Fan von Doku-Schreiben. Notfalls einfach per Twitter fragen: [@MichaelKreil](https://twitter.com/MichaelKreil).

Prinzipiell funktioniert es so:

## Preparation

In der [`config.js`](https://github.com/MichaelKreil/splitflap/blob/master/config.js) wird alles konfiguriert.

Mit [`textures/1_generate_letters.js`](https://github.com/MichaelKreil/splitflap/blob/master/textures/1_generate_letters.js) werden die Letter erzeugt. Die sehen dann so aus:
![letters_400.png](https://github.com/MichaelKreil/splitflap/blob/master/images/letters_400.png)

Mit [`textures/2_raytrace.js`](https://github.com/MichaelKreil/splitflap/blob/master/textures/2_raytrace.js) werden dann die Letter als Textur verwendet, um in JavaScript die Flip-Animation zu raytracen. Jupp, wir reden von einem JavaScript-Raytracer ... ist aber total simpel. Die erzeugten Frames sehen dann so aus:
![texture_400.png](https://github.com/MichaelKreil/splitflap/blob/master/images/texture_400.png)

## Videos

Für die Generierung der Videos werden die Texte als Objects der [`lib/splitflap.js`](https://github.com/MichaelKreil/splitflap/blob/master/lib/splitflap.js)-Library übergeben.
Hier werden dann die Texturen in einem Binary Buffer zusammenkopiert.
Der Buffer wird dann nach ffmpeg gepiped, was in der [`lib/ffmpeg.js`](https://github.com/MichaelKreil/splitflap/blob/master/lib/ffmpeg.js)-Library passiert.

Die Scripte
[`server/in_outro.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/in_outro.js)
und
[`server/welcome.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/welcome.js)
erzeugen so die Intro-, Outro- und Welcome-Videos.

## Live-Video

Für die Echtzeit-Session-Ankündigungen gibt's ein noch mehr magic. Oder besser: die Fiddelei formaly known as [`server/generate_sessions.js`](https://github.com/MichaelKreil/splitflap/blob/master/server/generate_sessions.js).
Dort wird im 15-Minuten-Takt die [`sessions.json`](http://data.re-publica.de/data/rp15/sessions.json) runtergeladen, die im Rahmen unseres [re:data-Projektes](http://data.re-publica.de) erzeugt wird.

Neue oder geänderte Sessions werden dann als Video-Ankündigung gerendert. Die aktuell darzustellenden Videos werden als Feeds (`feeds/monitor1-3.rss`) angeboten, die die Player hinter den Screens abonniert haben.

Et Voilà!




