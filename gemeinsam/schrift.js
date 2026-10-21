/* Sam lernt – wie man die Ziffern schreibt: jede Ziffer als Strich(e) in einem 100×140-Feld, in Schreibrichtung.
   Der erste Punkt jedes Strichs ist der Startpunkt. Gezeichnet wie die Druckschrift-Ziffern in der Grundschule.
   Die Merksätze helfen gegen Spiegelschrift – sie beschreiben, wohin Bäuche, Bögen und Striche zeigen.
   Die Sätze hier liest auch das Stimmbank-Skript ({Z} = Name der Ziffer, z. B. „Drei“). */

const ZIFFERN={
  0:{striche:['M50 16 C24 16 20 50 20 70 C20 98 30 124 50 124 C70 124 80 98 80 70 C80 42 72 16 50 16'],
    tipp:'Die Null ist rund wie ein Ei. Wir fangen oben an und fahren nach links herum.'},
  1:{striche:['M30 42 L58 16 L58 124'],
    tipp:'Bei der Eins zeigt der kleine Haken oben nach links. Der lange Strich steht rechts davon.'},
  2:{striche:['M24 44 C24 10 78 8 76 44 C74 70 40 92 22 124 L80 124'],
    tipp:'Die Zwei macht oben einen Bogen nach rechts. Unten läuft sie auf einem geraden Strich nach rechts.'},
  3:{striche:['M24 30 C34 8 76 10 72 40 C70 60 54 66 42 67 C64 67 80 82 78 98 C76 128 36 132 22 112'],
    tipp:'Die Drei hat zwei Bäuche. Beide Bäuche zeigen nach rechts.'},
  4:{striche:['M58 16 L20 92 L84 92','M64 56 L64 124'],
    tipp:'Bei der Vier steht der lange Strich rechts. Erst schräg nach unten, dann quer, dann den langen Strich.'},
  5:{striche:['M74 18 L34 18 L30 62 C46 52 80 56 78 90 C76 126 36 130 22 110'],
    tipp:'Die Fünf hat oben einen Hut nach rechts und unten einen dicken Bauch nach rechts.'},
  6:{striche:['M72 22 C46 22 24 52 24 92 C24 124 76 128 76 96 C76 66 34 66 26 92'],
    tipp:'Bei der Sechs kommt der Bogen von oben rechts. Unten hat sie einen runden Bauch.'},
  7:{striche:['M22 18 L78 18 L40 124'],
    tipp:'Die Sieben geht oben nach rechts und dann schräg nach unten links.'},
  8:{striche:['M72 36 C72 10 28 10 28 36 C28 62 72 66 72 96 C72 130 28 130 28 96 C28 66 72 62 72 36'],
    tipp:'Die Acht ist wie ein Schneemann. Wir fangen oben rechts an und fahren eine Schlangenlinie.'},
  9:{striche:['M74 44 C74 14 26 14 26 44 C26 74 72 74 74 44 L74 124'],
    tipp:'Bei der Neun ist der Kopf oben links. Der lange Strich steht rechts.'}
};
// Ziffern, die gespiegelt anders aussehen (0 und 8 sehen gespiegelt gleich aus)
const SPIEGELBAR=[1,2,3,4,5,6,7,9];

const SCHRIFT_SAETZE={
  zeigen:'Schau mal, so schreibt man die {Z}.',
  start:'Fang beim grünen Punkt an und fahr die Spur nach.',
  falschrum:'Andersrum! Wir fangen beim grünen Punkt an.',
  spur:'Bleib schön auf der Spur. Nochmal!',
  weiter:'Gut so! Jetzt der zweite Strich.',
  fertig:'Das ist eine schöne {Z}!',
  frage:'Welche {Z} steht richtig herum?',
  richtig:'Genau! So steht die {Z} richtig.',
  falsch:'Die ist gespiegelt. Schau, so herum ist es richtig.'
};

// Eine Ziffer als SVG (für Spiegelsee, Karten usw.) – gleiche Form wie beim Schreiben
function ziffernSVG(n,{farbe='#43384a',dicke=11,cls='',transform=''}={}){
  return `<svg class="ziffer ${cls}" viewBox="0 0 100 140" aria-label="${n}"><g ${transform?`transform="${transform}"`:''}>${ZIFFERN[n].striche.map(d=>
    `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${dicke}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g></svg>`;
}
