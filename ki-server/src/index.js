import { STIMMEN, MODELL_STIMME } from './stimmen.js';
/* Sam lernt – KI-Helfer (Cloudflare Worker) mit ChatGPT.
   Warum ein eigener Server: Der OpenAI-Schlüssel darf nie in die Webseite, denn die liegt
   öffentlich auf GitHub Pages. Er liegt nur hier als Secret (OPENAI_API_KEY).
   Läuft als Teil der App unter /api/ (siehe wrangler.jsonc im Hauptordner). Den Zugang schützt
   Cloudflare Access vor der ganzen App; ein Zugangscode (ZUGANGSCODE) ist zusätzlich möglich. */

// Was die Geschichten zeigen dürfen – muss zu KI_TOKENS in gemeinsam/ki.js passen
const TOKENS = ['blupp','blupp:big','blupp:fall','blupp:dance','zinn','zinn:big','klonk','klonk:big','holunder','holunder:big','hoppel','hoppel:big',
  '🌊','🏔️','🥕','🧪','🧹','⚙️','🐚','🦀','🎃','🦇','🚀','💡','🐇',
  '🌙','⭐','🌟','✨','☀️','🌈','☁️','🌧️','💧','❄️','🌲','🌳','🍂','🍄','🌰','🌸','🌻','🦋','🐞','🐌','🦔','🦊','🦉','🐿️','🐸','🦆','🐟','🐢',
  '🫐','🍓','🍎','🍯','🧁','🏮','💎','🔮','🗝️','🎁','🎵','🎶','🔔','🫧','🛶','🏞️','🏡','🛏️','😴','😄','❤️','🧣','👢','🪁'];

const STORY_SCHEMA = {
  type: 'object',
  properties: {
    t: { type: 'string', description: 'Titel der Geschichte, kurz' },
    p: {
      type: 'array', minItems: 3, maxItems: 6,
      items: {
        type: 'object',
        properties: {
          x: { type: 'string', description: 'Text dieser Seite, 1–2 kurze Sätze' },
          s: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string', enum: TOKENS } }
        },
        required: ['x', 's'], additionalProperties: false
      }
    }
  },
  required: ['t', 'p'], additionalProperties: false
};

const STORY_SYSTEM = `Du schreibst kurze Bildergeschichten auf Deutsch für ein Kind im Kindergarten- bzw. Vorschulalter.
Die Welt ist der Zauberwald: Birken, Moos, Pilze, Glühwürmchen, ein stiller See, abends rosa Himmel und Sterne. Verträumt und ein bisschen geheimnisvoll.
Die zwei Figuren:
- BluppBlupp, ein kleines, fröhliches blaues Nilpferd. Sagt gern "Blubb!", ist neugierig und mutig. (Bild-Token "blupp")
- Herr Zinn, BluppBlupps Onkel: ein freundlicher, alter Waldmann mit großem braunem Spitzhut, weißem Bart, roter Nase und grünem Mantel.
  Er trägt immer eine Laterne, ist ruhig, weise und ein bisschen lustig. BluppBlupp nennt ihn "Onkel Zinn". (Token "zinn")
Ihre Freunde (dürfen mitspielen, müssen aber nicht):
- Hoppel, ein flinkes, aufgeregtes Kaninchen von der Kaninchenwiese (Token "hoppel")
- Klonk, ein lieber kleiner Roboter, der in einer Werkstatt in den Bergen Sachen baut und "Piep!" sagt (Token "klonk")
- Hexe Holunder, eine freundliche, etwas schrullige Kräuterhexe mit Hexenhaus und Zaubertrank-Kessel – nie gruselig (Token "holunder")
Die Welt hat außerdem einen Wellenstrand am Meer, die Kaninchenwiese, den Zauberwald, das Hexenhaus und hohe Berge mit dem Echo-Gipfel.
Waldtiere dürfen mitspielen (Eule, Igel, Fuchs, Eichhörnchen, Frosch, Schnecke, Schmetterling …).
Regeln:
- 3 bis 6 Seiten. Jede Seite: 1 bis 2 kurze, einfache Sätze (höchstens 25 Wörter), die sich ruhig vorlesen lassen.
- Beruhigend und spannend zugleich: ein kleines Rätsel oder eine Überraschung, die sich freundlich auflöst. Nichts Gruseliges, keine Gewalt, keine echte Gefahr, niemand ist böse.
- Gern sanfte Geräusche (blubb, huhu, plitsch) und kleine Zähl-Momente (eins, zwei, drei …), aber nicht belehrend.
- Das Ende ist friedlich und gemütlich; die letzte Seite endet mit "Ende."
- "s" sind die Bilder der Seite, nur aus der erlaubten Liste. Figuren-Varianten:
  ":big" = groß im Bild (bei jeder Figur), "blupp:fall" = BluppBlupp purzelt, "blupp:dance" = BluppBlupp tanzt.
  Emojis haben keine Varianten.`;

const REPORT_SYSTEM = `Du schreibst Eltern auf Deutsch einen kurzen, freundlichen Bericht über den Lernstand ihres Kindes in einem Mathe-Lernspiel (Zahlen 0–10, Zählen, Plus, Minus).
Du bekommst je Zahl bzw. "plus"/"minus", wie oft richtig (ok) und falsch (bad) geantwortet wurde.
Höchstens 120 Wörter, Fließtext ohne Überschriften und ohne Markdown. Erst was schon gut klappt, dann 1–2 Zahlen oder Bereiche zum Üben,
dann ein konkreter Spiel-Tipp für den Alltag. Keine Prozent-Listen, keine Diagnosen. Wenige Daten: ehrlich sagen, dass es noch zu früh für eine Einschätzung ist.`;

function cors(origin, env, eigene) {
  const ok = erlaubt(origin, env, eigene);
  return {
    'access-control-allow-origin': ok ? origin : 'null',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, x-zugang',
    'access-control-max-age': '86400',
    vary: 'origin'
  };
}
function erlaubt(origin, env, eigene) {
  if (!origin) return false;
  // Die App ruft den Helfer auf ihrer eigenen Adresse auf
  if (origin === eigene) return true;
  // Der PC startet das Spiel über "Sam lernt starten.bat" auf 127.0.0.1:8765
  const liste = String(env.ERLAUBTE_SEITEN || '').split(',').map(s => s.trim()).filter(Boolean).concat(['http://127.0.0.1:8765']);
  return liste.includes(origin);
}
function antwort(body, status, h) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...h } });
}
// Vergleich in konstanter Zeit, damit der Code nicht über Antwortzeiten erraten werden kann
function gleich(a, b) {
  const x = new TextEncoder().encode(String(a)), y = new TextEncoder().encode(String(b));
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
const kurz = (s, n) => String(s ?? '').replace(/[^\p{L}\p{N} ,.'!?-]/gu, '').slice(0, n);

async function openai(env, { system, user, schema, maxTokens }) {
  const body = {
    model: env.MODELL || 'gpt-6.1-sol',
    input: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_output_tokens: maxTokens,
    store: false
  };
  if (schema) body.text = { format: { type: 'json_schema', name: 'geschichte', strict: true, schema } };
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.OPENAI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    // Nur die Fehlermeldung von OpenAI weitergeben, nie Header oder Schlüssel
    const e = new Error((j.error && j.error.message) || 'OpenAI antwortet mit ' + r.status);
    e.status = r.status === 429 ? 429 : 502;
    throw e;
  }
  for (const item of j.output || []) {
    if (item.type !== 'message') continue;
    for (const c of item.content || []) {
      if (c.type === 'refusal') throw Object.assign(new Error('Die KI wollte das nicht schreiben.'), { status: 502 });
      if (c.type === 'output_text' && c.text) return c.text;
    }
  }
  if (j.output_text) return j.output_text;
  throw Object.assign(new Error('Leere Antwort von der KI'), { status: 502 });
}

function gueltig(st) {
  return st && typeof st.t === 'string' && st.t.length <= 80 && Array.isArray(st.p) && st.p.length >= 2 && st.p.length <= 8 &&
    st.p.every(pg => pg && typeof pg.x === 'string' && pg.x.length < 400 && Array.isArray(pg.s) && pg.s.length >= 1 && pg.s.length <= 4 &&
      pg.s.every(x => TOKENS.includes(x)));
}

async function geschichte(env, b) {
  const name = kurz(b.name, 20), thema = kurz(b.thema, 60) || 'ein lustiger Tag';
  const user = `Thema: ${thema}.` + (name ? ` Das Kind heißt ${name}; es darf einmal in der Geschichte vorkommen.` : '');
  // Selten passt eine Antwort nicht – dann einmal neu versuchen statt dem Kind einen Fehler zu zeigen
  for (let i = 0; i < 2; i++) {
    const text = await openai(env, { system: STORY_SYSTEM, user, schema: STORY_SCHEMA, maxTokens: 1800 });
    let st; try { st = JSON.parse(text) } catch (e) { continue }
    if (gueltig(st)) return st;
  }
  throw Object.assign(new Error('Geschichte unpassend'), { status: 502 });
}

async function bericht(env, b) {
  const stats = {};
  for (const [k, v] of Object.entries(b.stats || {}).slice(0, 20)) {
    if (!/^(\d{1,2}|plus|minus)$/.test(k) || !v) continue;
    stats[k] = { ok: Math.min(99999, Math.max(0, v.ok | 0)), bad: Math.min(99999, Math.max(0, v.bad | 0)) };
  }
  const name = kurz(b.name, 20);
  const user = (name ? `Das Kind heißt ${name}. ` : '') + 'Ergebnisse: ' + JSON.stringify(stats);
  return { text: (await openai(env, { system: REPORT_SYSTEM, user, maxTokens: 900 })).trim() };
}

/* ---------- Stimme: Text wird zu natürlicher Sprache ----------
   Drei feste Stimmen. Die Anweisung hängt an der Stimme, nicht an der Anfrage – so ist derselbe Satz immer
   dieselbe Datei und kann dauerhaft gespeichert werden (bei Cloudflare und auf dem Gerät).
   VERSION_STIMME hochzählen, wenn sich Stimmen oder Modell ändern – dann werden alle Sätze neu erzeugt. */
const VERSION_STIMME = '2';
async function fingerabdruck(t) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function stimme(req, env, url, h) {
  const s = url.searchParams.get('s') || 'erzaehler';
  const text = String(url.searchParams.get('t') || '').replace(/[\u0000-\u001f]/g, ' ').trim();
  if (!STIMMEN[s]) return antwort({ fehler: 'Unbekannte Stimme' }, 400, h);
  if (!text || text.length > 600) return antwort({ fehler: 'Text fehlt oder ist zu lang' }, 400, h);
  // Fester Schlüssel für den Cloudflare-Speicher: Version + Stimme + Fingerabdruck des Textes – im PFAD, nicht im
  // Query-String. Zonen mit „Query-String ignorieren“ hätten sonst allen Sätzen dieselbe Aufnahme gegeben.
  const hash = await fingerabdruck(s + '|' + text);
  const key = new Request(`${url.origin}/api/stimme-cache/v${VERSION_STIMME}/${s}/${hash}`);
  const cache = caches.default;
  const alt = await cache.match(key);
  if (alt && alt.headers.get('x-stimme') === hash) return new Response(alt.body, { headers: { ...Object.fromEntries(alt.headers), ...h } });

  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.OPENAI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ model: env.MODELL_STIMME || MODELL_STIMME, voice: STIMMEN[s].voice, instructions: STIMMEN[s].instructions, input: text, response_format: 'mp3' })
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    return antwort({ fehler: (j.error && j.error.message) || 'Stimme: OpenAI antwortet mit ' + r.status }, r.status === 429 ? 429 : 502, h);
  }
  const audio = await r.arrayBuffer();
  // x-stimme: die App prüft damit, dass wirklich die Aufnahme zu IHREM Satz zurückkommt
  const kopf = { 'content-type': 'audio/mpeg', 'cache-control': 'public, max-age=31536000, immutable', 'x-stimme': hash, 'access-control-expose-headers': 'x-stimme' };
  await cache.put(key, new Response(audio, { headers: kopf }));
  return new Response(audio, { headers: { ...kopf, ...h } });
}

/* ---------- Hören: das Kind spricht, der Server schreibt mit (OpenAI-Transkription) ----------
   Die App schickt eine kurze Aufnahme (höchstens ein paar Sekunden); zurück kommt nur der Text. Nichts wird gespeichert. */
const HOER_WOERTER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'Uhr', 'halb', 'Viertel', 'nach', 'vor'];
async function hoeren(req, env, h) {
  const typ = req.headers.get('content-type') || 'audio/webm';
  const daten = await req.arrayBuffer();
  if (!daten.byteLength || daten.byteLength > 2_000_000) return antwort({ fehler: 'Aufnahme fehlt oder ist zu groß' }, 400, h);
  const endung = /mp4|m4a|aac/.test(typ) ? 'm4a' : /wav/.test(typ) ? 'wav' : /ogg/.test(typ) ? 'ogg' : 'webm';
  const form = new FormData();
  form.append('file', new Blob([daten], { type: typ.split(';')[0] }), 'kind.' + endung);
  form.append('model', env.MODELL_HOEREN || 'gpt-transcribe');
  form.append('languages[]', 'de');
  HOER_WOERTER.forEach(w => form.append('keywords[]', w));
  form.append('prompt', 'Ein kleines Kind antwortet auf Deutsch mit einer Zahl, einer Rechnung oder einer Uhrzeit, zum Beispiel: sieben, drei Uhr, halb vier, Viertel nach zwei.');
  form.append('response_format', 'json');
  const r = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { authorization: 'Bearer ' + env.OPENAI_API_KEY }, body: form });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return antwort({ fehler: (j.error && j.error.message) || 'Hören: OpenAI antwortet mit ' + r.status }, r.status === 429 ? 429 : 502, h);
  return antwort({ text: String(j.text || '').slice(0, 200) }, 200, h);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    // Alles außer /api/ sind die Spiele selbst
    // Die nackte Adresse zeigt die Startseite (ohne Umleitung, die mag Safari offline nicht)
    if (url.pathname === '/' && env.ASSETS) return env.ASSETS.fetch(new Request(new URL('/index.html', url), req));
    if (!url.pathname.startsWith('/api/') && env.ASSETS) return env.ASSETS.fetch(req);
    const origin = req.headers.get('origin') || '';
    const h = cors(origin, env, url.origin);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    // Sprache wird per GET geholt, damit Browser und Cloudflare sie wie eine Datei speichern können.
    // Ein GET von der eigenen Seite schickt oft keinen Origin mit – dann schützt allein Cloudflare Access davor.
    const istStimme = req.method === 'GET' && url.pathname === '/api/stimme';
    if (req.method !== 'POST' && !istStimme) return antwort({ fehler: 'Nur POST' }, 405, h);
    if (!(istStimme && !origin) && !erlaubt(origin, env, url.origin)) return antwort({ fehler: 'Diese Seite ist nicht freigegeben' }, 403, h);
    if (env.ZUGANGSCODE && !gleich(req.headers.get('x-zugang') || '', env.ZUGANGSCODE)) return antwort({ fehler: 'Zugangscode falsch' }, 401, h);
    if (!env.OPENAI_API_KEY) return antwort({ fehler: 'OPENAI_API_KEY fehlt im Server' }, 500, h);
    if (istStimme) { try { return await stimme(req, env, url, h) } catch (e) { return antwort({ fehler: e.message || 'Fehler' }, 500, h) } }

    if (url.pathname === '/api/hoeren') { try { return await hoeren(req, env, h) } catch (e) { return antwort({ fehler: e.message || 'Fehler' }, 500, h) } }
    let b = {};
    try { const t = await req.text(); if (t.length > 8000) throw 0; b = t ? JSON.parse(t) : {} } catch (e) { return antwort({ fehler: 'Ungültige Anfrage' }, 400, h) }

    const pfad = url.pathname.replace(/^\/api/, '').replace(/\/+$/, '');
    try {
      if (pfad === '/status') return antwort({ ok: true, modell: env.MODELL || 'gpt-6.1-sol' }, 200, h);
      if (pfad === '/geschichte') return antwort(await geschichte(env, b), 200, h);
      if (pfad === '/bericht') return antwort(await bericht(env, b), 200, h);
      return antwort({ fehler: 'Unbekannter Weg' }, 404, h);
    } catch (e) {
      return antwort({ fehler: e.message || 'Fehler' }, e.status || 500, h);
    }
  }
};
