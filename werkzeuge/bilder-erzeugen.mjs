/* Sam lernt – erzeugt Illustrationen im Stil von bilder/zauberwald.jpg (OpenAI-Bildmodell, mit Referenzbildern).
   Läuft als GitHub Action „Bilder erzeugen“ (von Hand gestartet). Erzeugt nur, was in bilder/illu/ noch fehlt.
   Jedes Bild kann frühere Bilder als Referenz nutzen – so bleibt eine Figur über alle Posen gleich. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ZIEL = path.join(ROOT, 'bilder/illu');
const MODELL = process.env.MODELL_BILD || 'gpt-image-2.5-sunburst';

const STIL = `Stil: zartes Aquarell-Bilderbuch für kleine Kinder, wie die beigefügte Vorlage: weiche Pinselstriche, feine Bleistiftkonturen,
warme Pastellfarben (Abendrosa, Pfirsich, Türkis, Salbeigrün), leichte Papierstruktur, verträumt und freundlich. Keine Schrift, kein Text, keine Logos.`;
const FIGUR = `Einzelne Figur, ganzer Körper, mittig, freigestellt auf vollständig transparentem Hintergrund, kein Boden, kein Schatten-Rechteck, keine Umgebung.`;

// Was erzeugt wird. ref: Liste von Dateien (relativ zum Repo), die als Vorlage mitgehen.
const PLAN = [
  { datei: 'blupp-normal.png', ref: ['bilder/zauberwald.jpg'], groesse: '1024x1024', transparent: true,
    text: `${STIL}\n${FIGUR}\nDas kleine blaue Nilpferd „BluppBlupp“ aus der Vorlage (links im Bild): genau gleiches Aussehen, gleiche Farben und Proportionen. Steht ruhig da, freundlich lächelnd, schaut den Betrachter an.` },
  { datei: 'blupp-freut.png', ref: ['bilder/zauberwald.jpg', 'bilder/illu/blupp-normal.png'], groesse: '1024x1024', transparent: true,
    text: `${STIL}\n${FIGUR}\nGenau dieselbe Figur wie im zweiten Referenzbild (BluppBlupp, das kleine blaue Nilpferd) – gleiches Gesicht, gleiche Farben, gleiche Größe. Diesmal freut es sich riesig: Arme hoch, Mund offen lachend, ein kleiner Hüpfer.` },
  { datei: 'paul-normal.png', ref: ['bilder/zauberwald.jpg'], groesse: '1024x1024', transparent: true,
    text: `${STIL}\n${FIGUR}\nNeue Figur im selben Stil wie die Vorlage: „Pirat Paul“, ein gemütlicher, gutmütiger Pirat für Kinder. Rundes freundliches Gesicht, buschiger brauner Bart, rotes Kopftuch mit weißen Punkten, eine Augenklappe, goldener Ohrring, blau-weiß gestreiftes Hemd, braune Weste, Stiefel. Steht lächelnd da, nicht gruselig.` },
  { datei: 'paul-freut.png', ref: ['bilder/zauberwald.jpg', 'bilder/illu/paul-normal.png'], groesse: '1024x1024', transparent: true,
    text: `${STIL}\n${FIGUR}\nGenau derselbe Pirat wie im zweiten Referenzbild (Pirat Paul) – gleiches Gesicht, gleiche Kleidung und Farben. Diesmal lacht er herzlich und hebt eine Hand zum Winken.` },
  { datei: 'strand.jpg', ref: ['bilder/zauberwald.jpg'], groesse: '1024x1536', transparent: false,
    text: `${STIL}\nHochformatige Landschaft ohne Figuren als Hintergrund für ein Kinderspiel: ein ruhiger Sandstrand am Meer bei Sonnenuntergang. Oben weiter Himmel in Rosa und Pfirsich mit ein paar Wolken und einer tief stehenden Sonne, in der Mitte sanfte türkise Wellen, unten heller Sand mit ein paar Muscheln und einem kleinen Krebs am Rand. Die Mitte des Bildes eher ruhig und hell lassen, damit dort Spielelemente Platz haben.` }
];

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('OPENAI_API_KEY fehlt'); process.exit(1); }
fs.mkdirSync(ZIEL, { recursive: true });
const fehler = [];
const mime = f => f.endsWith('.png') ? 'image/png' : 'image/jpeg';

for (const b of PLAN) {
  const ziel = path.join(ZIEL, b.datei);
  if (fs.existsSync(ziel)) { console.log('vorhanden:', b.datei); continue; }
  const form = new FormData();
  form.append('model', MODELL);
  form.append('prompt', b.text);
  form.append('size', b.groesse);
  form.append('quality', 'high');
  form.append('background', b.transparent ? 'transparent' : 'opaque');
  form.append('output_format', b.transparent ? 'png' : 'jpeg');
  for (const r of b.ref) {
    const p = path.join(ROOT, r);
    if (!fs.existsSync(p)) { console.error('Referenz fehlt:', r); continue; }
    form.append('image[]', new Blob([fs.readFileSync(p)], { type: mime(r) }), path.basename(r));
  }
  let ok = false;
  for (let versuch = 1; versuch <= 3 && !ok; versuch++) {
    const ac = new AbortController(), zeit = setTimeout(() => ac.abort(new Error('Zeitlimit')), 240000);
    try {
      const r = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { authorization: 'Bearer ' + key }, body: form, signal: ac.signal });
      const j = await r.json().catch(() => ({}));
      clearTimeout(zeit);
      if (r.ok && j.data && j.data[0] && j.data[0].b64_json) {
        fs.writeFileSync(ziel, Buffer.from(j.data[0].b64_json, 'base64'));
        console.log('erzeugt:', b.datei); ok = true;
      } else {
        const msg = (j.error && j.error.message) || ('HTTP ' + r.status);
        console.error('Fehler', b.datei, msg);
        const ohne = msg.match(/does not support the '(\w+)' parameter/);
        if (ohne) { form.delete(ohne[1]); console.log('ohne', ohne[1], 'nochmal'); versuch--; continue; }
        if (r.status !== 429 && r.status < 500) { fehler.push(`${b.datei}: ${msg}`); break; }
        await new Promise(res => setTimeout(res, 5000 * versuch));
      }
    } catch (e) { clearTimeout(zeit); console.error('Netz/Zeit', b.datei, e.message); await new Promise(res => setTimeout(res, 5000 * versuch)); }
  }
  if (!ok && !fehler.some(f => f.startsWith(b.datei))) fehler.push(`${b.datei}: nach 3 Versuchen aufgegeben`);
}
fs.writeFileSync(path.join(ZIEL, 'fehler.txt'), fehler.length ? new Date().toISOString() + '\n' + fehler.join('\n') + '\n' : '');
console.log(fehler.length ? 'Mit Fehlern fertig' : 'Alle Bilder fertig');
process.exit(fehler.length ? 1 : 0);
