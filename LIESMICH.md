# Sam lernt

Lernspiele für Kinder mit Rosi (fliegendes Schwein), Bobo (Affe), Klapper (Skelett) und Paul (Pirat).
Läuft im Browser am PC und auf dem iPad, auch ohne Internet.

## Inhalt

| Datei / Ordner | Wozu |
|---|---|
| `index.html` | Startseite der Reihe – hier kommen neue Spiele dazu |
| `mathe.html` | Sam lernt: Mathe (Zahlen 0–10, Zählen, Plus und Minus) |
| `gemeinsam/` | Was alle Spiele teilen: Aussehen, Schrift, Stimme, Töne, Sterne, Figuren, Schatzkiste, KI-Anbindung |
| `bilder/` | App-Symbol |
| `sw.js`, `manifest.webmanifest` | Offline-Modus und „Zum Home-Bildschirm“ auf dem iPad |
| `ki-server/` | KI-Helfer mit ChatGPT (Cloudflare Worker) – enthält keine Schlüssel |
| `Sam lernt starten.bat` | Am Windows-PC starten |

## Am PC spielen

Doppelklick auf `Sam lernt starten.bat`.

## Auf dem iPad spielen

Die Spiele müssen dafür im Internet liegen (https). Vorschlag: **GitHub Pages** – kostenlos, mit https, ohne Werbung.

1. Ein Repository anlegen, z.B. `sam-lernt`, und alle Dateien hineinlegen (der `ki-server/` enthält keine Schlüssel).
2. In GitHub unter *Settings › Pages* „Deploy from branch“ → `main` / Ordner `/` wählen.
3. Nach etwa einer Minute ist das Spiel unter `https://<benutzer>.github.io/sam-lernt/` erreichbar.
4. Auf dem iPad in Safari öffnen → Teilen-Knopf → **Zum Home-Bildschirm**. Danach startet es wie eine App im Vollbild und läuft auch ohne Internet weiter.

Wichtig: Sterne, Name, Aufnahmen und Einstellungen liegen auf dem jeweiligen Gerät (PC und iPad getrennt).
Bei einer neuen Version in `sw.js` die Zahl in `VERSION` erhöhen, damit das iPad die neuen Dateien holt.

## KI-Helfer mit ChatGPT einrichten

ChatGPT erfindet neue Geschichten mit den vier Figuren und schreibt Eltern einen kurzen Lernbericht.
Der OpenAI-Schlüssel darf nie in die Webseite (sie ist öffentlich) – deshalb läuft ein kleiner eigener Server
in `ki-server/` (Cloudflare Worker, kostenlos).

**Einmalig einrichten** (am PC, im Ordner `ki-server/`):

```
npm install
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ZUGANGSCODE
npx wrangler deploy
```

- `OPENAI_API_KEY`: unter platform.openai.com › API keys anlegen. **Dort im Projekt ein Monatslimit setzen** (z. B. 5 €) – dann kann nie mehr verbraucht werden.
- `ZUGANGSCODE`: ein beliebiges Passwort ausdenken.
- `deploy` zeigt am Ende die Adresse, z. B. `https://sam-lernt-ki.<konto>.workers.dev`. Diese in `gemeinsam/ki.js` bei `KI_ADRESSE` eintragen.

**Auf jedem Gerät einmal:** *Eltern* (Knopf gedrückt halten) → *KI-Helfer* → Zugangscode eintragen → *Verbindung testen*.

Was an ChatGPT geht: ein zufälliges Thema, beim Bericht nur die Zahlen „wie oft richtig/falsch“, und der Vorname nur, wenn das Häkchen gesetzt ist. OpenAI speichert die Anfragen nicht (`store: false`).
Modell: `gpt-6.1-sol` (in `ki-server/wrangler.toml` bei `MODELL` änderbar, günstiger: `gpt-6-luna`). Geschichten werden vorab geladen, damit das Kind nicht wartet.
Ohne Internet funktioniert alles weiter mit den eingebauten Geschichten.
