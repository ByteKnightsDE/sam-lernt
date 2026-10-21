/* Sam lernt – die Uhr: zeichnen, Uhrzeiten aussprechen, zufällige Zeiten je nach Stufe.
   Stufe 1: volle Stunden · Stufe 2: + halbe Stunden · Stufe 3: + Viertel nach / Viertel vor.
   Die Sätze hier liest auch das Stimmbank-Skript ({T} = Uhrzeit, z. B. „halb vier“). */

const STUNDENWORT=['zwölf','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'];
const hWort=h=>STUNDENWORT[h%12||12];
// So sagt man die Uhrzeit im Alltag
function zeitText(h,m){
  h=h%12||12;const nh=h%12+1;
  if(m===0)return (h===1?'ein':hWort(h))+' Uhr';
  if(m===30)return 'halb '+hWort(nh);
  if(m===15)return 'Viertel nach '+hWort(h);
  if(m===45)return 'Viertel vor '+hWort(nh);
  return hWort(h)+' Uhr '+m;
}
const zeitKurz=(h,m)=>`${h%12||12}:${String(m).padStart(2,'0')}`;
function zufallsZeit(stufe,nicht){
  const mins=stufe>=3?[0,30,15,45]:stufe>=2?[0,30]:[0];
  let z;do{z={h:1+Math.floor(Math.random()*12),m:rnd(mins)}}while(nicht&&z.h===nicht.h&&z.m===nicht.m);
  return z;
}
const gleicheZeit=(a,b)=>a&&b&&(a.h%12)===(b.h%12)&&a.m===b.m;

const UHR_SAETZE={
  zeig:'Zeig mir {T}.',
  stell:'Stell die Uhr auf {T}.',
  ist:'Es ist {T}.',
  frage:'Wie spät ist es?',
  richtig:'Richtig! Es ist {T}.',
  falsch:'Schau nochmal genau. Der kleine Zeiger zeigt die Stunde.',
  gehoert:'Ich habe {T} gehört.',
  stundenzeiger:'Der kleine Zeiger zeigt die Stunde, der große Zeiger die Minuten.',
  halb:'Bei halb steht der große Zeiger ganz unten auf der Sechs.',
  voll:'Bei einer vollen Stunde steht der große Zeiger ganz oben auf der Zwölf.',
  viertelnach:'Bei Viertel nach steht der große Zeiger auf der Drei.',
  viertelvor:'Bei Viertel vor steht der große Zeiger auf der Neun.',
  nichtverstanden:'Das habe ich nicht verstanden. Sag es nochmal.'
};
const uhrSatz=(k,h,m)=>UHR_SAETZE[k].replace('{T}',zeitText(h,m));
// Erklärung, wo der große Zeiger bei dieser Zeit steht
const minutenTipp=m=>UHR_SAETZE[{0:'voll',30:'halb',15:'viertelnach',45:'viertelvor'}[m]];

/* ---------- Zeichnen ---------- */
function uhrSVG(h,m,{id='',klein=false}={}){
  const zahlen=Array.from({length:12},(_,i)=>{const n=i+1,w=n*30*Math.PI/180;return `<text x="${50+36*Math.sin(w)}" y="${50-36*Math.cos(w)+4.2}" class="uz">${n}</text>`}).join('');
  const striche=Array.from({length:60},(_,i)=>`<line x1="50" y1="${i%5?7:6}" x2="50" y2="${i%5?9.5:11}" transform="rotate(${i*6} 50 50)" class="${i%5?'ust':'ust5'}"/>`).join('');
  return `<svg class="uhr ${klein?'klein':''}" ${id?`id="${id}"`:''} viewBox="0 0 100 100" aria-label="${zeitText(h,m)}">
    <circle cx="50" cy="50" r="48" class="urand"/><circle cx="50" cy="50" r="44" class="ublatt"/>
    ${klein?'':striche}${zahlen}
    <g class="zeiger-h" style="transform:rotate(${(h%12)*30+m*.5}deg)"><line x1="50" y1="53" x2="50" y2="28" class="uzh"/></g>
    <g class="zeiger-m" style="transform:rotate(${m*6}deg)"><line x1="50" y1="55" x2="50" y2="14" class="uzm"/></g>
    <circle cx="50" cy="50" r="3.4" class="umitte"/></svg>`;
}
function zeigerSetzen(svg,h,m){
  svg.querySelector('.zeiger-h').style.transform=`rotate(${(h%12)*30+m*.5}deg)`;
  svg.querySelector('.zeiger-m').style.transform=`rotate(${m*6}deg)`;
}
