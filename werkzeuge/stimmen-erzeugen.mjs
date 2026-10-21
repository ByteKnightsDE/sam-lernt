/* Sam lernt – erzeugt die Stimmbank: alle festen Sätze der App einmal als MP3 in stimme/<stimme>/<schlüssel>.mp3.
   Läuft automatisch als GitHub Action nach jedem Push (.github/workflows/stimmen.yml) und erzeugt nur, was fehlt.
   Von Hand:  node werkzeuge/stimmen-erzeugen.mjs --nur-liste   (zeigt nur, welche Sätze es gibt)
              OPENAI_API_KEY=… node werkzeuge/stimmen-erzeugen.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { STIMMEN, MODELL_STIMME } from '../ki-server/src/stimmen.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const lies = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const { teile, schluessel } = createRequire(import.meta.url)('../gemeinsam/stimmbank.js');
const NAME = 'Sam'; // Lob und Begrüßungen gibt es mit und ohne diesen Namen

const saetze = { erzaehler: new Set(), zinn: new Set(), blupp: new Set() };
const add = (text, s = 'erzaehler') => teile(text).forEach(x => saetze[s].add(x));
const mitName = (s, sep = ', ') => [s, s + sep + NAME];

/* ---------- 1. Daten aus dem Code holen (Geschichten, Rätsel, Lob, Dinge zum Zählen) ---------- */
const kern = lies('gemeinsam/kern.js');
const PRAISE = eval(kern.match(/const PRAISE=(\[[^\]]*\]);/)[1]);
const mathe = lies('mathe.html');
const WORDS = eval(mathe.match(/const WORDS=(\[[^\]]*\]);/)[1]);
const CAP = w => w[0].toUpperCase() + w.slice(1);
const THINGS = eval(mathe.match(/const THINGS=(\[[\s\S]*?\]);/)[1]);
const figuren = lies('gemeinsam/figuren.js');
const CHAR = eval('(' + figuren.match(/const CHAR=(\{[\s\S]*?\n\});/)[1].replace(/sound:\(\)=>sfx\.\w+\(\)/g, 'sound:0') + ')');
const beloh = lies('gemeinsam/belohnungen.js');
const { STORIES, RIDDLES, FINDS, HATCH } = new Function('state', 'fig', 'ytId', 'rnd', 'shuffle',
  beloh.slice(0, beloh.indexOf('/* ---------- Video')) + ';return {STORIES,RIDDLES,FINDS,HATCH}')({ videos: [] }, () => '', () => '', a => a[0], a => a);

/* ---------- 2. Alles, was mit einfachem Text gesprochen wird: say('…') und say('…',t,'zinn') ---------- */
for (const f of ['index.html', 'mathe.html', 'gemeinsam/kern.js', 'gemeinsam/belohnungen.js']) {
  const src = lies(f);
  for (const m of src.matchAll(/\bsay\(\s*'((?:[^'\\]|\\.)*)'\s*(?:,\s*[^,()]+?\s*(?:,\s*'(\w+)')?)?\s*\)/g)) add(m[1].replace(/\\'/g, "'"), m[2] || 'erzaehler');
  // withName('Juhu')+'! …' – mit und ohne Namen
  for (const m of src.matchAll(/say\(withName\('([^']*)'(?:,'([^']*)')?\)\+'([^']*)'(?:,\s*\w+(?:,\s*'(\w+)')?)?\)/g))
    mitName(m[1], m[2] ?? ', ').forEach(v => add(v + m[3], m[4] || 'erzaehler'));
  // Texte in Objekten wie intro:'…', end:'…' (Seifenblasen, Glühwürmchen) mit der Stimme aus wer:'…'
  for (const m of src.matchAll(/catcher\(done,\{([\s\S]*?)\n?\s*make:/g)) {
    const wer = (m[1].match(/wer:'(\w+)'/) || [])[1] || 'erzaehler';
    for (const k of m[1].matchAll(/(?:intro|end):'([^']*)'/g)) add(k[1], wer);
  }
}

/* ---------- 3. Bausteine fürs Rechnen und Zählen (talk() setzt sie zusammen) ---------- */
WORDS.forEach(w => add(CAP(w) + '.'));
WORDS.forEach(w => add(CAP(w)));
PRAISE.forEach(p => mitName(p).forEach(v => add(v + '!')));
['Das ist die', 'Wo ist die', 'Die', 'Wie viel ist', 'plus', 'minus', 'ist', 'Hier sind', 'geht weg.', 'gehen weg.', 'Du hast', 'Zahlen von', 'bis',
  'Da ist gar nichts!', 'Tippe auf eine Zahl!', 'Entdecken', 'Finde die Zahl', 'Wie viele?', 'Zählen', 'Rechnen', 'Ich spreche',
  'Mathe', 'Mathe kommt bald!', 'Buchstaben kommt bald!', 'Farben und Formen kommt bald!', 'Uhrzeit kommt bald!', 'Buchstaben', 'Farben und Formen', 'Uhrzeit'].forEach(x => add(x));
WORDS.forEach(w => add(`Sag mal: ${CAP(w)}!`));
const DINGE = [...THINGS, ...Object.values(CHAR).filter(c => c.count !== false)];
for (const th of DINGE) {
  add(`${CAP(th.sg)}.`); add(`${th.pl}.`); add(`${th.pl}!`); add(`${th.pl} gezählt.`); add(`Das ist die`);
  add(`Wie viele ${th.pl} siehst du?`); add(`Tippe alle ${th.pl} an und zähl mit!`);
}

/* ---------- 4. Geschichten, Rätsel, Überraschungen ---------- */
for (const st of STORIES) { add(st.t); st.p.forEach(pg => add(pg.x)); }
for (const r of RIDDLES) add(r.q);
Object.values(FINDS).forEach(x => add(x));
HATCH.forEach(h => add(`Das ist ${h.n}` + (h.f ? '' : '!')));
for (const c of Object.values(CHAR)) add(`Das ist ${c.name}, ${c.who}.`);
['Mmmh!', 'Lecker!', 'Mampf!', 'Noch eins, bitte!'].forEach(x => add(x, 'blupp'));
// Begrüßung auf der Startseite (hi = {blupp:'…',zinn:'…'})
for (const m of lies('index.html').matchAll(/\b(blupp|zinn):'([^']*)'/g)) add(m[2], m[1]);
mitName('Guten Tag').forEach(v => add(v + '! Ich bin Herr Zinn. Komm mit in den Zauberwald. Was möchtest du spielen?', 'zinn'));

/* ---------- 5. Erzeugen, was fehlt ---------- */
const liste = { version: 1, modell: MODELL_STIMME };
const alle = [];
for (const s of Object.keys(saetze)) {
  liste[s] = [];
  for (const text of [...saetze[s]].sort()) { const k = await schluessel(s, text); liste[s].push(k); alle.push({ s, k, text }); }
}
fs.mkdirSync(path.join(ROOT, 'stimme'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'stimme/saetze.json'), JSON.stringify(alle.map(({ s, k, text }) => ({ s, k, text })), null, 1));
console.log('Sätze:', Object.fromEntries(Object.keys(saetze).map(s => [s, saetze[s].size])), 'gesamt', alle.length);
if (process.argv.includes('--nur-liste')) process.exit(0);

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('OPENAI_API_KEY fehlt'); process.exit(1); }
const datei = ({ s, k }) => path.join(ROOT, 'stimme', s, k + '.mp3');
const fehlt = alle.filter(x => !fs.existsSync(datei(x)));
console.log('Fehlt noch:', fehlt.length);
let fertig = 0, fehler = 0;
async function sprich(x) {
  for (let versuch = 1; versuch <= 4; versuch++) {
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODELL_STIMME, voice: STIMMEN[x.s].voice, instructions: STIMMEN[x.s].instructions, input: x.text, response_format: 'mp3' })
    });
    if (r.ok) {
      fs.mkdirSync(path.dirname(datei(x)), { recursive: true });
      fs.writeFileSync(datei(x), Buffer.from(await r.arrayBuffer()));
      if (++fertig % 25 === 0) console.log(fertig, '/', fehlt.length);
      return;
    }
    const msg = await r.text();
    if (r.status === 429 || r.status >= 500) { await new Promise(res => setTimeout(res, 2000 * versuch)); continue; }
    console.error('Fehler', r.status, x.s, x.text, msg.slice(0, 200)); fehler++; return;
  }
  fehler++;
}
const warte = [...fehlt];
await Promise.all(Array.from({ length: 4 }, async () => { while (warte.length) await sprich(warte.shift()); }));
// Nur fertige Dateien in die Liste – so spielt die App nie eine Datei, die es nicht gibt
for (const s of Object.keys(saetze)) liste[s] = liste[s].filter(k => fs.existsSync(path.join(ROOT, 'stimme', s, k + '.mp3')));
fs.writeFileSync(path.join(ROOT, 'stimme/liste.json'), JSON.stringify(liste));
console.log('Fertig:', fertig, 'neu,', fehler, 'Fehler');
if (fehler) process.exit(1);
