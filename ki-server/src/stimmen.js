/* Die drei Stimmen von Sam lernt – gemeinsam benutzt vom Server (Live-Sätze) und vom
   Erzeugungs-Skript für die Stimmbank (werkzeuge/stimmen-erzeugen.mjs). Ändert sich hier etwas,
   die Stimmbank neu erzeugen (stimme/ leeren) und VERSION_STIMME im Server hochzählen. */
// Wird von OpenAI am 6.1.2027 abgeschaltet – die fertigen Dateien der Stimmbank spielen danach weiter.
export const MODELL_STIMME = 'gpt-4o-mini-tts';
export const STIMMEN = {
  erzaehler: { voice: 'marin', instructions: 'Du liest einem kleinen Kind eine Gutenachtgeschichte auf Deutsch vor. Sprich warm, ruhig und etwas langsam, freundlich lächelnd, mit klarer Aussprache. Kleine Pausen an Satzenden. Nie hektisch, nie übertrieben.' },
  zinn: { voice: 'cedar', instructions: 'Du bist Herr Zinn, ein alter, gemütlicher Mann aus dem Zauberwald mit tiefer, sanfter Stimme. Sprich Deutsch, langsam, warm, ein wenig brummig und verschmitzt schmunzelnd, wie ein liebevoller Großonkel.' },
  blupp: { voice: 'verse', instructions: 'Du bist BluppBlupp, ein kleines, fröhliches blaues Nilpferd. Sprich Deutsch mit heller, verspielter, kindlicher Stimme, neugierig und gut gelaunt, ein bisschen kichernd, aber deutlich und nicht zu schnell.' }
};
