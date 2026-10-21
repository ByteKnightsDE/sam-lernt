# Sam lernt

Lernspiele im Zauberland – mit BluppBlupp, Herrn Zinn, Hoppel, Klonk, Hexe Holunder, Rosi, Bobo, Klapper, Pirat Paul, Krebs Kasimir und Hummer Hubert.
Verträumt, ruhig und trotzdem spannend. Vorlage der Figuren: `bilder/zauberwald.jpg`.
Läuft im Browser am PC und auf dem iPad, auch ohne Internet.

## Inhalt

| Datei / Ordner | Wozu |
|---|---|
| `index.html` | Startseite der Reihe – hier kommen neue Spiele dazu |
| `mathe.html` | Zahlenland: Weltkarte mit Stationen (Zählen, Rechnen, Schreiben, Spiegelsee, Klapperhöhle zum Sprechen), „Teste dein Können“ |
| `uhr.html` | Uhrzeit in der Piratenbucht: Uhr lesen (Paul), Uhr stellen (Kasimir), Uhrzeit sagen (Hubert) |
| `gemeinsam/` | Was alle Spiele teilen: Aussehen, Schrift, Stimme, Töne, Sterne, Figuren, Schatzkiste, KI-Anbindung |
| `bilder/` | Titelbild aus dem Zauberwald und App-Symbol |
| `sw.js`, `manifest.webmanifest` | Offline-Modus und „Zum Home-Bildschirm“ auf dem iPad |
| `ki-server/`, `wrangler.jsonc`, `.assetsignore` | ChatGPT-Helfer und Cloudflare-Einstellungen – enthalten keine Schlüssel und werden nicht ausgeliefert |
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

## Bei Cloudflare (mit ChatGPT)

Die App läuft bei Cloudflare als ein Projekt: die Spiele als Dateien, der ChatGPT-Helfer unter `/api/`
(Code in `ki-server/`, Einstellungen in `wrangler.jsonc`). Jeder Push auf `main` wird automatisch veröffentlicht.

**Einmalig einrichten** (alles im Browser):

1. Cloudflare → *Compute* → *Workers & Pages* → *Erstellen* → GitHub-Repo `sam-lernt` importieren.
   Build-Befehl leer, Bereitstellungsbefehl `npx wrangler deploy`, Pfad `/`, **„Mit Cloudflare Access schützen“ einschalten**.
2. Im Projekt → *Einstellungen* → *Variablen und Geheimnisse* → `OPENAI_API_KEY` als **Geheimnis** eintragen.
   Auf platform.openai.com im Projekt ein **Monatslimit** setzen (z. B. 5 €).
3. Zero Trust → *Access* → die App → Regel: nur die eigene E-Mail-Adresse, Sitzungsdauer 1 Monat.
4. Danach darf das GitHub-Repo privat sein; GitHub Pages abschalten.

Was an ChatGPT geht: ein zufälliges Thema, beim Bericht nur die Zahlen „wie oft richtig/falsch“, und der Vorname nur, wenn das Häkchen gesetzt ist. OpenAI speichert die Anfragen nicht (`store: false`).
Modell: `gpt-6.1-sol` (in `wrangler.jsonc` bei `MODELL` änderbar, günstiger: `gpt-6-luna`). Geschichten werden vorab geladen, damit das Kind nicht wartet.
Ohne Internet und am PC (über die .bat) laufen die eingebauten Geschichten.

**Stimmbank:** Alle festen Sätze (Rechnen, Zählen, Lob, Geschichten, Rätsel, Überraschungen) liegen fertig gesprochen in `stimme/`.
Sie werden von der GitHub Action *Stimmen erzeugen* nach jedem Push einmal erzeugt (nur, was fehlt) – dafür im Repo unter
*Settings › Secrets and variables › Actions* das Geheimnis `OPENAI_API_KEY` anlegen. Welche Sätze es gibt: `stimme/saetze.json`.
Die Dateien spielen auch nach der Abschaltung des Sprachmodells weiter.

**Natürliche Stimme:** Erzähler, Herr Zinn und BluppBlupp sprechen über OpenAI mit eigenen Stimmen (`/api/stimme`, Einstellungen in
`ki-server/src/index.js` bei `STIMMEN`). Jeder Satz wird einmal erzeugt, bei Cloudflare und auf dem Gerät gespeichert und danach nicht mehr bezahlt.
Schalter und Hörproben: *Eltern* → *Stimme*. Ohne Internet oder Guthaben spricht die Gerätestimme.
Der OpenAI-Schlüssel braucht dafür auch die Berechtigung für Audio (`/v1/audio/speech`).
**Wichtig:** Das Sprachmodell `gpt-4o-mini-tts` schaltet OpenAI am 6. Januar 2027 ab – vorher den Server auf den Nachfolger umstellen
(nur `ki-server/`, die App bleibt gleich; dann `VERSION_STIMME` hochzählen).

## Zuhören (Spracheingabe)

In der Klapperhöhle, bei „Wie spät ist es?“ und im Test antwortet Sam mit der Stimme. Die App nimmt kurz auf und schickt die Aufnahme an
`/api/hoeren` (OpenAI `gpt-transcribe`); zurück kommt nur der Text, gespeichert wird nichts. Klappt es zweimal nicht oder gibt es kein Internet,
erscheinen Knöpfe zum Antippen. Beim ersten Mal fragt das iPad nach dem Mikrofon – erlauben.

## Üben, was schwerfällt

Falsche Antworten machen eine Zahl (bzw. Uhrzeit) häufiger; das bleibt gespeichert. Zweimal hintereinander dieselbe Zahl daneben →
kurze Extra-Erklärung. Im Eltern-Bereich steht, was gerade öfter geübt wird.
