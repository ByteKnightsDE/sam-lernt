/* Sam lernt – Stimmbank: fertig gesprochene Sätze als Dateien in stimme/<stimme>/<schlüssel>.mp3.
   Ein Satz wird in einzelne Sätze zerlegt; jeder hat einen festen Schlüssel aus Stimme + Text.
   Diese Datei benutzen App UND das Erzeugungs-Skript (werkzeuge/stimmen-erzeugen.mjs) – deshalb darf
   sich teile()/schluessel() nur zusammen mit einer neuen Erzeugung ändern. */

// Text in einzelne Sätze zerlegen; reine Satzzeichen fallen weg
function teile(text){
  const t=String(text??'').replace(/\s+/g,' ').trim();
  return (t.match(/[^.!?]*[.!?]+|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(x=>/[A-Za-zÄÖÜäöüß0-9]/.test(x));
}
async function schluessel(stimme,satz){
  const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(stimme+'|'+satz));
  return [...new Uint8Array(d)].slice(0,10).map(b=>b.toString(16).padStart(2,'0')).join('');
}
if(typeof module!=='undefined')module.exports={teile,schluessel};
