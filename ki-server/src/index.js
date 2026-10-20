/* Sam lernt – KI-Helfer (Cloudflare Worker) mit ChatGPT.
   Warum ein eigener Server: Der OpenAI-Schlüssel darf nie in die Webseite, denn die liegt
   öffentlich auf GitHub Pages. Er liegt nur hier als Secret (OPENAI_API_KEY).
   Zugang nur mit Zugangscode (ZUGANGSCODE) und nur von den erlaubten Seiten (ERLAUBTE_SEITEN). */

// Was die Geschichten zeigen dürfen – muss zu KI_TOKENS in gemeinsam/ki.js passen
const TOKENS = ['pig','pig:big','pig:fall','monkey','monkey:big','skel','skel:big','skel:dance','skel:flip','pirate','pirate:big',
  '☁️','🌙','⭐','🌈','☀️','🌊','🏝️','🌴','🌳','🌸','🍎','🍌','🍓','🎂','🍦','🧦','🗺️','⛵','⛏️','💰','👑','🎈','🎁','🎵','🎶','🎺','🥁',
  '🐦','🐟','🐙','🦀','🐢','🦖','🦕','🐶','🐱','🐮','🐸','🦆','🐞','🦴','💀','💦','💨','😄','😂','😴','❤️','🏠','🚗','🚂','🚀','⚽','🧸'];

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
Die vier Figuren:
- Rosi, ein fliegendes rosa Schwein (Bild-Token "pig")
- Bobo, ein lustiger Affe, isst gern Bananen (Token "monkey")
- Klapper, ein freundliches, kitzliges Skelett, tanzt gern (Token "skel")
- Paul, ein Pirat, ruft gern "Arrr!" (Token "pirate")
Regeln:
- 3 bis 6 Seiten. Jede Seite: 1 bis 2 kurze, einfache Sätze (höchstens 25 Wörter), die gut vorgelesen klingen.
- Lustig, warmherzig, gerne mit Geräuschen und Wiederholungen. Nichts Gruseliges, keine Gewalt, keine Gefahr.
- Gern kleine Zähl-Momente (eins, zwei, drei …), aber nicht belehrend.
- Die letzte Seite endet mit "Ende."
- "s" sind die Bilder der Seite, nur aus der erlaubten Liste. Figuren-Varianten:
  ":big" = groß im Bild, "pig:fall" = Rosi purzelt, "skel:dance" = Klapper tanzt, "skel:flip" = Klapper steht auf dem Kopf.
  Ein Emoji mit ":big" oder ":fall" ist NICHT erlaubt, nur die Varianten aus der Liste.`;

const REPORT_SYSTEM = `Du schreibst Eltern auf Deutsch einen kurzen, freundlichen Bericht über den Lernstand ihres Kindes in einem Mathe-Lernspiel (Zahlen 0–10, Zählen, Plus, Minus).
Du bekommst je Zahl bzw. "plus"/"minus", wie oft richtig (ok) und falsch (bad) geantwortet wurde.
Höchstens 120 Wörter, Fließtext ohne Überschriften und ohne Markdown. Erst was schon gut klappt, dann 1–2 Zahlen oder Bereiche zum Üben,
dann ein konkreter Spiel-Tipp für den Alltag. Keine Prozent-Listen, keine Diagnosen. Wenige Daten: ehrlich sagen, dass es noch zu früh für eine Einschätzung ist.`;

function cors(origin, env) {
  const ok = erlaubt(origin, env);
  return {
    'access-control-allow-origin': ok ? origin : 'null',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, x-zugang',
    'access-control-max-age': '86400',
    vary: 'origin'
  };
}
function erlaubt(origin, env) {
  if (!origin) return false;
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

export default {
  async fetch(req, env) {
    const origin = req.headers.get('origin') || '';
    const h = cors(origin, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (req.method !== 'POST') return antwort({ fehler: 'Nur POST' }, 405, h);
    if (!erlaubt(origin, env)) return antwort({ fehler: 'Diese Seite ist nicht freigegeben' }, 403, h);
    if (!env.ZUGANGSCODE || !gleich(req.headers.get('x-zugang') || '', env.ZUGANGSCODE)) return antwort({ fehler: 'Zugangscode falsch' }, 401, h);
    if (!env.OPENAI_API_KEY) return antwort({ fehler: 'OPENAI_API_KEY fehlt im Server' }, 500, h);

    let b = {};
    try { const t = await req.text(); if (t.length > 8000) throw 0; b = t ? JSON.parse(t) : {} } catch (e) { return antwort({ fehler: 'Ungültige Anfrage' }, 400, h) }

    const pfad = new URL(req.url).pathname.replace(/\/+$/, '');
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
