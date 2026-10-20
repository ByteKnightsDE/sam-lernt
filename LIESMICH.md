# Sam lernt

Lernspiele für Kinder mit Rosi (fliegendes Schwein), Bobo (Affe), Klapper (Skelett) und Paul (Pirat).
Läuft im Browser am PC und auf dem iPad, auch ohne Internet.

## Inhalt

| Datei / Ordner | Wozu |
|---|---|
| `index.html` | Startseite der Reihe – hier kommen neue Spiele dazu |
| `mathe.html` | Sam lernt: Mathe (Zahlen 0–10, Zählen, Plus und Minus) |
| `gemeinsam/` | Was alle Spiele teilen: Stimme, Töne, Sterne, Figuren, Schatzkiste, KI-Anbindung |
| `bilder/` | App-Symbol |
| `sw.js`, `manifest.webmanifest` | Offline-Modus und „Zum Home-Bildschirm“ auf dem iPad |
| `server/` | Optionaler KI-Helfer (Cloudflare Worker) – wird **nicht** mit der Webseite veröffentlicht |
| `Sam lernt starten.bat` | Am Windows-PC starten |

## Am PC spielen

Doppelklick auf `Sam lernt starten.bat`.

## Auf dem iPad spielen

Die Spiele müssen dafür im Internet liegen (https). Vorschlag: **GitHub Pages** – kostenlos, mit https, ohne Werbung.

1. Ein Repository anlegen, z.B. `sam-lernt`, und alle Dateien außer `server/` hineinlegen.
2. In GitHub unter *Settings › Pages* „Deploy from branch“ → `main` / Ordner `/` wählen.
3. Nach etwa einer Minute ist das Spiel unter `https://<benutzer>.github.io/sam-lernt/` erreichbar.
4. Auf dem iPad in Safari öffnen → Teilen-Knopf → **Zum Home-Bildschirm**. Danach startet es wie eine App im Vollbild und läuft auch ohne Internet weiter.

Wichtig: Sterne, Name, Aufnahmen und Einstellungen liegen auf dem jeweiligen Gerät (PC und iPad getrennt).
Bei einer neuen Version in `sw.js` die Zahl in `VERSION` erhöhen, damit das iPad die neuen Dateien holt.

## KI-Helfer einrichten (optional)

Die KI erfindet neue Geschichten mit den vier Figuren und schreibt Eltern einen kurzen Bericht zum Lernstand.
Der Anthropic-Schlüssel darf nie in die Webseite – deshalb läuft ein kleiner Zwischen-Server.

1. Kostenloses Konto bei Cloudflare anlegen und im Ordner `server/` ausführen:
   ```
   npm install
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler secret put ZUGANGSCODE
   ```
   (Für `ZUGANGSCODE` ein beliebiges Passwort ausdenken.)
2. In `server/wrangler.toml` bei `ERLAUBTE_SEITEN` die Adresse der Spiele eintragen, z.B. `https://byteknightsde.github.io`.
3. `npx wrangler deploy` – am Ende steht die Adresse des Helfers (`https://sam-lernt-ki.<konto>.workers.dev`).
4. Im Spiel: *Eltern* (Knopf gedrückt halten) → *KI-Helfer* → Adresse und Zugangscode eintragen → *Verbindung testen*.

Was an die KI geht: ein zufälliges Thema, beim Bericht nur die Zahlen „wie oft richtig/falsch“, und den Vornamen nur, wenn das Häkchen gesetzt ist.
Modell: `claude-opus-5-5` mit niedrigem Aufwand (`effort: low`). Geschichten werden vorab geladen, damit das Kind nicht wartet.
Ohne KI-Helfer funktioniert alles weiter mit den eingebauten Geschichten.
