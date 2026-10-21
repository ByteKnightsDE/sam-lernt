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

const saetze = Object.fromEntries(Object.keys(STIMMEN).map(s => [s, new Set()]));
const add = (text, s = 'erzaehler') => teile(text).forEach(x => saetze[s].add(x));
const mitName = (s, sep = ', ') => [s, s + sep + NAME];

/* ---------- 1. Daten aus dem Code holen (Geschichten, Rätsel, Lob, Dinge zum Zählen) ---------- */
const kern = lies('gemeinsam/kern.js');
const PRAISE = eval(kern.match(/const PRAISE=(\[[^\]]*\]);/)[1]);
const mathe = lies('mathe.html');
const WORDS = eval(mathe.match(/const WORDS=(\[[^\]]*\]);/)[1]);
const CAP = w => w[0].toUpperCase() + w.slice(1);
const ORTE = eval(lies('gemeinsam/welt.js').match(/const ORTE=(\[[\s\S]*?\n\]);/)[1]);
const figuren = lies('gemeinsam/figuren.js');
const CHAR = eval('(' + figuren.match(/const CHAR=(\{[\s\S]*?\n\});/)[1].replace(/sound:\(\)=>sfx\.\w+\(\)/g, 'sound:0') + ')');
const STIMME_VON = eval('(' + figuren.match(/const STIMME_VON=(\{[^}]*\});/)[1] + ')');
// Wer in Mathe sprechen kann: alle Gastgeber der Orte und Bobo (Teste dein Können)
const GAESTE = [...new Set([...ORTE.map(o => STIMME_VON[o.gast] || o.gast), 'bobo'])];
const beloh = lies('gemeinsam/belohnungen.js');
const { STORIES, RIDDLES, FINDS, HATCH, VERZAUBERT, SCHATZFUND, WITZE, LACHEN } = new Function('state', 'fig', 'ytId', 'rnd', 'shuffle',
  beloh.slice(0, beloh.indexOf('/* ---------- Video')) + ';return {STORIES,RIDDLES,FINDS,HATCH,VERZAUBERT,SCHATZFUND,WITZE,LACHEN}')({ videos: [] }, () => '', () => '', a => a[0], a => a);

/* ---------- 2. Alles, was mit einfachem Text gesprochen wird: say('…') und say('…',t,'zinn') ---------- */
const UHR_STIMMEN = ['erzaehler', 'paul', 'kasimir', 'hubert'];
for (const f of ['index.html', 'mathe.html', 'uhr.html', 'gemeinsam/kern.js', 'gemeinsam/belohnungen.js']) {
  const src = lies(f);
  // In Mathe und in der Piratenbucht spricht der Gastgeber – dort jeden Satz in allen Gastgeber-Stimmen
  const stimmen = f === 'mathe.html' ? ['erzaehler', ...GAESTE] : f === 'uhr.html' ? UHR_STIMMEN : null;
  for (const m of src.matchAll(/\bsay\(\s*'((?:[^'\\]|\\.)*)'\s*(?:,\s*[^,()]+?\s*(?:,\s*'(\w+)')?)?\s*\)/g)) {
    const text = m[1].replace(/\\'/g, "'");
    (m[2] ? [m[2]] : stimmen || ['erzaehler']).forEach(v => add(text, v));
  }
  // say(rnd(['…','…']),t,'hoppel')
  for (const m of src.matchAll(/say\(rnd\((\[[^\]]*\])\),\s*\w+(?:,\s*'(\w+)')?\)/g)) eval(m[1]).forEach(x => add(x, m[2] || 'erzaehler'));
  // withName('Juhu')+'! …' – mit und ohne Namen
  for (const m of src.matchAll(/say\(withName\('([^']*)'(?:,'([^']*)')?\)\+'([^']*)'(?:,\s*\w+(?:,\s*'(\w+)')?)?\)/g))
    mitName(m[1], m[2] ?? ', ').forEach(v => add(v + m[3], m[4] || 'erzaehler'));
  // Texte in Objekten wie intro:'…', end:'…' (Seifenblasen, Glühwürmchen) mit der Stimme aus wer:'…'
  for (const m of src.matchAll(/catcher\(done,\{([\s\S]*?)\n?\s*make:/g)) {
    const wer = (m[1].match(/wer:'(\w+)'/) || [])[1] || 'erzaehler';
    for (const k of m[1].matchAll(/(?:intro|end):'([^']*)'/g)) add(k[1], wer);
  }
}

/* ---------- 3. Bausteine fürs Rechnen und Zählen (talk() setzt sie zusammen) – in jeder Gastgeber-Stimme ---------- */
for (const v of ['erzaehler', ...GAESTE]) {
  const a = x => add(x, v);
  WORDS.forEach(w => { a(CAP(w) + '.'); a(CAP(w)); a(`Sag mal: ${CAP(w)}!`); });
  PRAISE.forEach(p => mitName(p).forEach(x => a(x + '!')));
  ['Das ist die', 'Wo ist die', 'Die', 'Wie viel ist', 'plus', 'minus', 'ist', 'Hier sind', 'geht weg.', 'gehen weg.', 'Du hast', 'Zahlen von', 'bis',
    'Da ist gar nichts!', 'Tippe auf eine Zahl!', 'Für Eltern: den Knopf gedrückt halten.'].forEach(a);
}
['Auf ins Zahlenland', 'Auf ins Zahlenland kommt bald!', 'Buchstaben kommt bald!', 'Farben und Formen kommt bald!', 'Uhrzeit kommt bald!', 'Ton an'].forEach(x => add(x));
// Jeder Ort: Begrüßung und alles, was dort gezählt wird – in der Stimme des Gastgebers
for (const o of ORTE) {
  const v = STIMME_VON[o.gast] || 'erzaehler', g = CHAR[o.gast].count !== false ? o.gast : 'blupp';
  add(o.hallo, v);
  for (const th of [...o.dinge, CHAR[g]]) {
    // auch in Bobos Stimme – er stellt bei „Teste dein Können“ Fragen aus allen Orten
    const a = x => { add(x, v); add(x, 'bobo'); };
    a(`${CAP(th.sg)}.`); a(`${th.pl}.`); a(`${th.pl}!`); a(`${th.pl} gezählt.`);
    a(`Wie viele ${th.pl} siehst du?`); a(`Tippe alle ${th.pl} an und zähl mit!`);
  }
}

/* ---------- 3b. Sandschrift und Spiegelsee: Sätze je Ziffer, in der Stimme der Gastgeber ---------- */
{
  const src = lies('gemeinsam/schrift.js');
  const ZIFFERN = eval('(' + src.match(/const ZIFFERN=(\{[\s\S]*?\n\});/)[1] + ')');
  const SAETZE = eval('(' + src.match(/const SCHRIFT_SAETZE=(\{[\s\S]*?\n\});/)[1] + ')');
  for (const v of ['erzaehler', ...GAESTE]) for (const n of Object.keys(ZIFFERN)) {
    Object.values(SAETZE).forEach(x => add(x.replace('{Z}', CAP(WORDS[n])), v));
    add(ZIFFERN[n].tipp, v);
  }
}

/* ---------- 3c. Uhrzeit, Klapperhöhle, Vertiefen, Teste dein Können, Witze ---------- */
{
  const uhr = lies('gemeinsam/uhr.js');
  const STUNDENWORT = eval(uhr.match(/const STUNDENWORT=(\[[^\]]*\]);/)[1]);
  const hWort = h => STUNDENWORT[h % 12 || 12];
  const zeitText = (h, m) => { h = h % 12 || 12; const nh = h % 12 + 1; return m === 0 ? (h === 1 ? 'ein' : hWort(h)) + ' Uhr' : m === 30 ? 'halb ' + hWort(nh) : m === 15 ? 'Viertel nach ' + hWort(h) : 'Viertel vor ' + hWort(nh); };
  const UHR_SAETZE = eval('(' + uhr.match(/const UHR_SAETZE=(\{[\s\S]*?\n\});/)[1] + ')');
  for (const v of [...UHR_STIMMEN, 'bobo']) for (let h = 1; h <= 12; h++) for (const m of [0, 30, 15, 45]) {
    Object.values(UHR_SAETZE).forEach(x => add(x.replace('{T}', zeitText(h, m)), v));
    add(zeitText(h, m), v);
  }
  // Begrüßungen der Piratenbucht-Stationen
  for (const m of lies('uhr.html').matchAll(/stimme:'(\w+)',start:[^\n]*\n\s*hallo:'([^']*)'/g)) add(m[2], m[1]);
  ['Nur volle Stunden', 'Volle und halbe Stunden', 'Jetzt auch Viertel nach und Viertel vor'].forEach(x => add(x));
  // Klapperhöhle und Vertiefen
  const HOER = eval('(' + mathe.match(/const HOER_SAETZE=(\{.*?\});/)[1] + ')');
  const NAMEN = [...WORDS.map(CAP), 'Elf', 'Zwölf', 'Dreizehn', 'Vierzehn', 'Fünfzehn', 'Sechzehn', 'Siebzehn', 'Achtzehn', 'Neunzehn', 'Zwanzig'];
  for (const v of ['erzaehler', ...GAESTE]) {
    Object.values(HOER).forEach(x => x.includes('{Z}') ? NAMEN.forEach(n => add(x.replace('{Z}', n), v)) : add(x, v));
    WORDS.forEach(w => add(`Die ${CAP(w)} üben wir noch einmal zusammen.`, v));
    add('Null heißt: gar nichts! Das Feld ist leer.', v); add('Lass uns zusammen zählen!', v); add('von zehn richtig!', v);
  }
  ['Gold! Du bist ein echter Zahlen-Profi!', 'Silber! Das war richtig stark!', 'Bronze! Gut gemacht!', 'Super, dass du es versucht hast! Wir üben weiter.'].forEach(x => add(x, 'bobo'));
  // Hubert, Paul
  WITZE.forEach(([f, p]) => { add(f, 'hubert'); add(p, 'hubert'); });
  LACHEN.forEach(x => add(x, 'hubert'));
  Object.values(SCHATZFUND).forEach(x => add(x, 'paul'));
}

/* ---------- 4. Geschichten, Rätsel, Überraschungen ---------- */
for (const st of STORIES) { add(st.t); st.p.forEach(pg => add(pg.x)); }
for (const r of RIDDLES) add(r.q);
Object.values(FINDS).forEach(x => add(x));
HATCH.forEach(h => add(`Das ist ${h.n}` + (h.f ? '' : '!')));
for (const c of Object.values(CHAR)) add(`Das ist ${c.name}, ${c.who}.`);
['Mmmh!', 'Lecker!', 'Mampf!', 'Noch eins, bitte!'].forEach(x => add(x, 'blupp'));
// Begrüßung auf der Startseite (hi = {blupp:'…',zinn:'…'})
for (const m of lies('index.html').matchAll(/\b(blupp|zinn|hoppel|klonk|holunder|pig|monkey|skel|pirate|krebs):'([^']*)'/g)) add(m[2], STIMME_VON[m[1]]);
VERZAUBERT.forEach(v => add(`Simsalabim! Heraus kommt ${v.n}!`, 'holunder'));
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
// --max N: höchstens N Sätze in diesem Durchgang (die Action speichert nach jedem Durchgang zwischen)
const maxArg = process.argv.indexOf('--max');
const MAX = maxArg > 0 ? +process.argv[maxArg + 1] : Infinity;
const alleFehlenden = alle.filter(x => !fs.existsSync(datei(x)));
const fehlt = alleFehlenden.slice(0, MAX);
console.log('Fehlt noch:', alleFehlenden.length, '– jetzt:', fehlt.length);
let fertig = 0, fehler = 0, quotaLeer = false;
const letzteFehler = [];
const warte = [...fehlt];
async function sprich(x) {
  for (let versuch = 1; versuch <= 4; versuch++) {
    // Nie ewig warten: hängt eine Anfrage (auch beim Herunterladen der Datei), nach 90 s abbrechen und neu versuchen
    let r, daten = null, msg = '';
    // Eigener Zeitgeber (AbortSignal.timeout hält den Prozess nicht am Leben)
    const ac = new AbortController(), zeit = setTimeout(() => ac.abort(new Error('Zeitlimit 90 s')), 90000);
    try {
      r = await fetch('https://api.openai.com/v1/audio/speech', {
        signal: ac.signal,
        method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
        body: JSON.stringify({ model: MODELL_STIMME, voice: STIMMEN[x.s].voice, instructions: STIMMEN[x.s].instructions, input: x.text, response_format: 'mp3' })
      });
      if (r.ok) daten = Buffer.from(await r.arrayBuffer()); else msg = await r.text();
      clearTimeout(zeit);
    } catch (e) { clearTimeout(zeit); x.letzte = 'Netz/Zeit: ' + e.message; console.error('Zeitüberschreitung/Netz', x.s, x.text.slice(0, 40)); await new Promise(res => setTimeout(res, 2000 * versuch)); continue; }
    if (daten && daten.length > 500) {
      fs.mkdirSync(path.dirname(datei(x)), { recursive: true });
      fs.writeFileSync(datei(x), daten);
      if (++fertig % 50 === 0) console.log(fertig, '/', fehlt.length);
      return;
    }
    // Budget oder Guthaben aufgebraucht: sofort aufhören statt stundenlang zu warten
    if (/insufficient_quota|billing|budget|exceeded your current quota|spend limit/i.test(msg)) {
      console.error('ABBRUCH: OpenAI-Budget oder Guthaben aufgebraucht – im Projekt „Sam lernt“ unter Settings › Limits erhöhen.');
      console.error(msg.slice(0, 300)); letzteFehler.push('BUDGET: ' + msg.slice(0, 400)); quotaLeer = true; warte.length = 0; return;
    }
    if (r.status === 429 || r.status >= 500) { x.letzte = `${r.status}: ${msg.slice(0, 400)}`; await new Promise(res => setTimeout(res, 2000 * versuch)); continue; }
    console.error('Fehler', r.status, x.s, x.text, msg.slice(0, 200)); fehler++; letzteFehler.push(`${r.status} ${x.s} „${x.text}“: ${msg.slice(0, 400)}`); return;
  }
  letzteFehler.push(`aufgegeben ${x.s} „${x.text}“ – ${x.letzte || 'Zeitüberschreitung'}`); fehler++;
}
process.on('unhandledRejection', e => { console.error('Unerwartet:', e); });
await Promise.all(Array.from({ length: 4 }, async () => { while (warte.length) { try { await sprich(warte.shift()); } catch (e) { console.error('Unerwartet:', e.message); fehler++; } } }));
// Nur fertige Dateien in die Liste – so spielt die App nie eine Datei, die es nicht gibt
for (const s of Object.keys(saetze)) liste[s] = liste[s].filter(k => fs.existsSync(path.join(ROOT, 'stimme', s, k + '.mp3')));
fs.writeFileSync(path.join(ROOT, 'stimme/liste.json'), JSON.stringify(liste));
console.log('Fertig:', fertig, 'neu,', fehler, 'Fehler');
// Exit 3 = es fehlen noch Sätze (die Action macht dann den nächsten Durchgang), 1 = zu viele Fehler
// Fehler ins Repo schreiben, damit man sie ohne Zugriff aufs Action-Protokoll lesen kann
fs.writeFileSync(path.join(ROOT, 'stimme/fehler.txt'), letzteFehler.length ? new Date().toISOString() + '\n' + letzteFehler.slice(0, 15).join('\n') + '\n' : '');
if (quotaLeer) process.exit(4);
if (fehler > 20) process.exit(1);
if (alleFehlenden.length > fehlt.length) process.exit(3);
