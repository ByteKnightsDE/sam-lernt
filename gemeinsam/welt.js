/* Sam lernt – die Welt: sechs Orte vom Wellenstrand bis zum Echo-Gipfel. Jeder Ort hat ein Spiel, einen Gastgeber
   (der in seiner eigenen Stimme spricht), eigene Dinge zum Zählen und eine lebendige Landschaft.
   Die Liste ORTE liest auch das Stimmbank-Skript – Texte hier ändern heißt: Stimmbank wird ergänzt. */

const ORTE=[
  {id:'strand',name:'Wellenstrand',modus:'how',spiel:'Wie viele?',gast:'blupp',ico:'🌊',
    hallo:'Blubb! Willkommen am Wellenstrand! Hier zählen wir, was im Wasser schwimmt.',
    dinge:[{e:'🐟',sg:'ein Fisch',pl:'Fische'},{e:'🐠',sg:'ein bunter Fisch',pl:'bunte Fische'},{e:'🐚',sg:'eine Muschel',pl:'Muscheln'},
      {e:'🦀',sg:'ein Krebs',pl:'Krebse'},{e:'🐙',sg:'ein Tintenfisch',pl:'Tintenfische'},{e:'🐢',sg:'eine Schildkröte',pl:'Schildkröten'},
      {e:'🦆',sg:'eine Ente',pl:'Enten'},{e:'⛵',sg:'ein Segelboot',pl:'Segelboote'}]},
  {id:'wiese',name:'Kaninchenwiese',modus:'find',spiel:'Finde die Zahl',gast:'hoppel',ico:'🥕',
    hallo:'Hallo, hallo! Ich bin Hoppel! Auf meiner Wiese verstecken sich Zahlen. Hilfst du mir, sie zu finden?',
    dinge:[{e:'🥕',sg:'eine Karotte',pl:'Karotten'},{e:'🌼',sg:'eine Blume',pl:'Blumen'},{e:'🐞',sg:'ein Marienkäfer',pl:'Marienkäfer'},
      {e:'🦋',sg:'ein Schmetterling',pl:'Schmetterlinge'},{e:'🍓',sg:'eine Erdbeere',pl:'Erdbeeren'},{e:'🐌',sg:'eine Schnecke',pl:'Schnecken'}]},
  {id:'wald',name:'Zauberwald',modus:'explore',spiel:'Entdecken',gast:'zinn',ico:'🌲',
    hallo:'Willkommen im Zauberwald. Meine Laterne zeigt dir die Zahlen.',
    dinge:[{e:'🍄',sg:'ein Pilz',pl:'Pilze'},{e:'🦉',sg:'eine Eule',pl:'Eulen'},{e:'⭐',sg:'ein Stern',pl:'Sterne'},
      {e:'🦔',sg:'ein Igel',pl:'Igel'},{e:'🦊',sg:'ein Fuchs',pl:'Füchse'},{e:'🌰',sg:'eine Kastanie',pl:'Kastanien'},
      {e:'🍂',sg:'ein Blatt',pl:'Blätter'},{e:'🐿️',sg:'ein Eichhörnchen',pl:'Eichhörnchen'},{e:'🫐',sg:'eine Blaubeere',pl:'Blaubeeren'}]},
  {id:'hexe',name:'Hexenhaus',modus:'math',spiel:'Rechnen',gast:'holunder',ico:'🧪',
    hallo:'Hihi! Willkommen in meinem Hexenhaus! Hier zaubern wir mit Plus und Minus.',
    dinge:[{e:'🧪',sg:'ein Zaubertrank',pl:'Zaubertränke'},{e:'🎃',sg:'ein Kürbis',pl:'Kürbisse'},{e:'🦇',sg:'eine Fledermaus',pl:'Fledermäuse'},
      {e:'🐸',sg:'ein Frosch',pl:'Frösche'},{e:'🌟',sg:'ein Zauberstern',pl:'Zaubersterne'},{e:'🧹',sg:'ein Besen',pl:'Besen'},{e:'🍄',sg:'ein Pilz',pl:'Pilze'}]},
  {id:'werkstatt',name:'Bergwerkstatt',modus:'count',spiel:'Zählen',gast:'klonk',ico:'⚙️',
    hallo:'Piep, piep! Ich bin Klonk. In meiner Werkstatt in den Bergen zählen wir alles ganz genau.',
    dinge:[{e:'⚙️',sg:'ein Zahnrad',pl:'Zahnräder'},{e:'🔩',sg:'eine Schraube',pl:'Schrauben'},{e:'🔋',sg:'eine Batterie',pl:'Batterien'},
      {e:'💡',sg:'eine Glühbirne',pl:'Glühbirnen'},{e:'💎',sg:'ein Edelstein',pl:'Edelsteine'},{e:'🚀',sg:'eine Rakete',pl:'Raketen'}]},
  {id:'gipfel',name:'Echo-Gipfel',modus:'speak',spiel:'Ich spreche',gast:'zinn',ico:'🏔️',
    hallo:'Hier oben auf dem Echo-Gipfel ruft der Berg alles zurück. Sag die Zahl ganz laut!',
    dinge:[{e:'❄️',sg:'eine Schneeflocke',pl:'Schneeflocken'},{e:'🐐',sg:'eine Ziege',pl:'Ziegen'},{e:'🌲',sg:'eine Tanne',pl:'Tannen'},
      {e:'🦅',sg:'ein Adler',pl:'Adler'},{e:'☁️',sg:'eine Wolke',pl:'Wolken'}]}
];
const ORT=id=>ORTE.find(o=>o.id===id);
const ORT_VON_MODUS=m=>ORTE.find(o=>o.modus===m);

/* ---------- Bausteine der Landschaften (SVG, Breite 400) ---------- */
const sterne=(n,h,seed=1)=>Array.from({length:n},(_,i)=>{const x=(i*97+seed*31)%400,y=(i*53+seed*17)%h;return `<circle class="funkel" style="animation-delay:${-(i%7)*.6}s" cx="${x}" cy="${y}" r="${1+(i%3)*.5}" fill="#fff"/>`}).join('');
const wellen=(y,farbe,n=3,unten=y+400)=>Array.from({length:n},(_,i)=>{
  const yy=y+i*16,a=6-i;
  let d=`M-400 ${yy}`;for(let x=-400;x<800;x+=40)d+=` q10 -${a} 20 0 t20 0`;d+=` V${unten} H-400Z`;
  return `<path class="welle w${i}" d="${d}" fill="${farbe[i]}"/>`;}).join('');
const huegel=(y,farbe,amp=30,seed=0)=>{let d=`M0 ${y}`;for(let x=0;x<=400;x+=50)d+=` Q${x+25} ${y-amp*(((x+seed)/50)%2?1:.4)} ${x+50} ${y}`;return `<path d="${d} V${y+700} H0Z" fill="${farbe}"/>`};
const berge=(y,farbe,schnee,spitzen)=>spitzen.map(([x,h,b])=>`<path d="M${x-b} ${y} L${x} ${y-h} L${x+b} ${y}Z" fill="${farbe}"/>${schnee?`<path d="M${x-b*.28} ${y-h*.72} L${x} ${y-h} L${x+b*.28} ${y-h*.72} L${x+b*.12} ${y-h*.66} L${x} ${y-h*.74} L${x-b*.12} ${y-h*.66}Z" fill="${schnee}"/>`:''}`).join('');
const birke=(x,y,h,w)=>`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" rx="${w/2}" fill="#f7f1ea"/>${[.2,.38,.55,.7,.85].map(f=>`<path d="M${x-w/2+1} ${y-h*f} q${w/2} -1.5 ${w-2} 0" stroke="#5b4d52" stroke-width=".9" opacity=".5" fill="none"/>`).join('')}`;
const tanne=(x,y,s,f='#5d8a6a')=>`<path d="M${x} ${y-s*3} L${x+s} ${y-s*1.6} L${x+s*.5} ${y-s*1.6} L${x+s*1.3} ${y-s*.4} L${x-s*1.3} ${y-s*.4} L${x-s*.5} ${y-s*1.6} L${x-s} ${y-s*1.6}Z" fill="${f}"/><rect x="${x-s*.15}" y="${y-s*.4}" width="${s*.3}" height="${s*.4}" fill="#6b4f3a"/>`;
const wolke=(x,y,s,cls='wolke')=>`<g class="${cls}" style="animation-delay:${-(x%9)}s"><ellipse cx="${x}" cy="${y}" rx="${s*1.6}" ry="${s*.7}" fill="#fff" opacity=".85"/><circle cx="${x-s*.5}" cy="${y-s*.4}" r="${s*.6}" fill="#fff" opacity=".85"/><circle cx="${x+s*.4}" cy="${y-s*.55}" r="${s*.75}" fill="#fff" opacity=".85"/></g>`;
const hexenhaus=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">
  <g class="rauch"><circle cx="34" cy="-112" r="7" fill="#e9e1ef"/><circle cx="40" cy="-128" r="9" fill="#e9e1ef"/><circle cx="34" cy="-148" r="11" fill="#e9e1ef"/></g>
  <rect x="26" y="-110" width="14" height="30" fill="#6e5468" transform="rotate(4 33 -95)"/>
  <path d="M-46 -60 L-6 -122 L48 -64Z" fill="#5c3f7a"/><path d="M-40 -62 L44 -62 L40 0 L-36 0Z" fill="#a27b62"/>
  <path d="M-40 -62 L44 -62 L43 -54 L-39 -54Z" fill="#4b3463"/>
  <rect class="glimm" x="-26" y="-46" width="16" height="16" rx="3" fill="#ffd77e"/><path d="M-18 -46 V-30 M-26 -38 H-10" stroke="#7a5a48" stroke-width="2"/>
  <path d="M10 0 V-30 Q20 -42 30 -30 V0Z" fill="#6b4a33"/><circle cx="26" cy="-15" r="1.6" fill="#e7c46a"/>
  <circle cx="-48" cy="-6" r="9" fill="#e8913c"/><path d="M-48 -15 v-4" stroke="#6b8f4e" stroke-width="2"/>
  <ellipse cx="62" cy="-4" rx="14" ry="9" fill="#3a3044"/><ellipse class="glimm" cx="62" cy="-11" rx="12" ry="3" fill="#9be7a8"/>
  <g class="blasen"><circle cx="58" cy="-18" r="2.4" fill="#b9f3c2"/><circle cx="66" cy="-24" r="1.8" fill="#b9f3c2"/></g></g>`;
const werkstatt=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-44" y="-56" width="88" height="56" rx="4" fill="#8fa3b8"/><path d="M-52 -54 L0 -84 L52 -54Z" fill="#5f7590"/>
  <g class="zahnrad" style="transform-origin:${0}px ${-70}px"><circle cx="0" cy="-70" r="9" fill="#e9b949"/><circle cx="0" cy="-70" r="3.5" fill="#5f7590"/>${[0,45,90,135,180,225,270,315].map(a=>`<rect x="-2.2" y="-82" width="4.4" height="6" fill="#e9b949" transform="rotate(${a} 0 -70)"/>`).join('')}</g>
  <rect class="blink b1" x="-34" y="-44" width="18" height="14" rx="2" fill="#7ef2e6"/><rect class="blink b2" x="16" y="-44" width="18" height="14" rx="2" fill="#ffd54f"/>
  <rect x="-10" y="-30" width="20" height="30" rx="2" fill="#4a5d75"/><circle cx="6" cy="-14" r="1.6" fill="#e9b949"/>
  <path d="M44 -20 h20 v20" stroke="#6d7f95" stroke-width="4" fill="none"/></g>`;

/* ---------- Landschaften hinter den Spielen ---------- */
function szeneSVG(id){
  const k={
    strand:`<defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ef"/><stop offset=".55" stop-color="#fbe2cf"/><stop offset="1" stop-color="#fbe2cf"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hs)"/><circle cx="310" cy="190" r="46" fill="#ffe3a3" opacity=".9"/>
      ${wolke(80,120,26)}${wolke(250,80,20)}
      <g class="wellenzug">${wellen(470,['#9fd3e0','#7fc0d3','#5fa9c2'])}</g>
      <path d="M0 640 Q120 610 240 630 T400 620 V800 H0Z" fill="#f3d9a8"/><path d="M0 668 Q160 650 400 662 V800 H0Z" fill="#ecca8e"/>
      <text x="40" y="720" font-size="26">🐚</text><text x="330" y="700" font-size="22">⭐</text><text x="250" y="760" font-size="24">🦀</text>`,
    wiese:`<defs><linearGradient id="hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe7ef"/><stop offset="1" stop-color="#f8ecd8"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hw)"/><circle cx="80" cy="150" r="40" fill="#fff1c4"/>
      ${wolke(260,110,24)}${wolke(120,70,16)}
      ${huegel(470,'#c8deaa',40,0)}${huegel(540,'#aecf8e',50,50)}${huegel(620,'#93bd77',40,0)}
      ${Array.from({length:22},(_,i)=>`<circle cx="${(i*67)%400}" cy="${560+(i*37)%220}" r="${3+(i%3)}" fill="${['#fff','#ffd54f','#f48fb1','#ce93d8'][i%4]}"/>`).join('')}
      <ellipse cx="90" cy="690" rx="26" ry="9" fill="#5d4a3a"/><ellipse cx="300" cy="730" rx="26" ry="9" fill="#5d4a3a"/>
      <g class="ohren"><ellipse cx="294" cy="712" rx="4" ry="13" fill="#f2ece4"/><ellipse cx="306" cy="712" rx="4" ry="13" fill="#f2ece4"/></g>`,
    wald:`<defs><linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3cfcf"/><stop offset=".6" stop-color="#f7e9dc"/><stop offset="1" stop-color="#dfe9df"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hf)"/>
      ${huegel(600,'#cfdcc8',30,0)}${huegel(680,'#b9cfb0',30,50)}
      ${birke(22,800,760,16)}${birke(64,800,560,10)}${birke(378,800,780,18)}${birke(336,800,600,11)}${birke(300,800,420,7)}${birke(100,800,380,7)}
      <text x="130" y="760" font-size="26">🍄</text><text x="250" y="740" font-size="20">🍄</text>`,
    hexe:`<defs><linearGradient id="hh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b3f74"/><stop offset=".55" stop-color="#b98bb3"/><stop offset="1" stop-color="#e6c7c9"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hh)"/>${sterne(40,380,3)}<circle cx="320" cy="120" r="34" fill="#fff5d6"/><circle cx="334" cy="112" r="30" fill="#5a4a82" opacity=".9"/>
      ${huegel(600,'#7a6a8f',40,0)}${huegel(660,'#5f5276',30,50)}
      ${hexenhaus(290,700,1.15)}
      <text x="40" y="760" font-size="24">🎃</text><text x="90" y="770" font-size="18">🎃</text>
      <g class="fledermaus"><text x="0" y="0" font-size="22">🦇</text></g>`,
    werkstatt:`<defs><linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3e6"/><stop offset="1" stop-color="#eee6e0"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hb)"/>${wolke(90,110,22)}${wolke(300,160,18)}
      ${berge(560,'#a9b8cb','#fff',[[60,300,130],[230,380,170],[380,280,120]])}
      ${berge(640,'#8b9cb3','#f3f6fa',[[150,240,140],[320,200,120]])}
      ${huegel(680,'#9aaa8f',25,0)}${tanne(40,700,22)}${tanne(370,710,20)}
      ${werkstatt(220,720,1.25)}`,
    gipfel:`<defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb4d9"/><stop offset=".7" stop-color="#d8e6f3"/><stop offset="1" stop-color="#f4f7fb"/></linearGradient></defs>
      <rect width="400" height="800" fill="url(#hg)"/>${wolke(70,260,24)}${wolke(330,330,20)}${wolke(200,420,28)}
      ${berge(800,'#b7c6d8','#fff',[[200,620,260]])}${berge(800,'#9fb1c8','#f3f6fa',[[30,420,140],[380,460,160]])}
      ${Array.from({length:26},(_,i)=>`<circle class="flocke" style="animation-delay:${-(i*.7)%8}s;animation-duration:${6+(i%5)}s" cx="${(i*61)%400}" cy="-10" r="${2+(i%3)}" fill="#fff"/>`).join('')}`
  }[id];
  return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice">${k}</svg>`;
}
// Landschaft hinter das Spiel legen (ersetzt den Wald-Hintergrund)
function szene(id){
  let el=$('#szene');
  if(!id){if(el)el.remove();document.body.dataset.ort='';return}
  if(!el){el=document.createElement('div');el.id='szene';el.setAttribute('aria-hidden','true');document.body.prepend(el)}
  if(el.dataset.ort!==id){el.dataset.ort=id;el.innerHTML=szeneSVG(id)}
  document.body.dataset.ort=id;
}

/* ---------- Weltkarte: ein Pfad vom Strand (unten) bis zum Gipfel (oben) ---------- */
const KARTE_H=1500;
const PUNKTE={strand:[200,1385],wiese:[110,1160],wald:[285,935],hexe:[120,705],werkstatt:[280,470],gipfel:[195,215]};
function kartePfad(){
  const p=ORTE.map(o=>PUNKTE[o.id]);let d=`M${p[0][0]} ${p[0][1]}`;
  for(let i=1;i<p.length;i++){const [x0,y0]=p[i-1],[x1,y1]=p[i];d+=` C${x0} ${y0-110} ${x1} ${y1+110} ${x1} ${y1}`}
  return d;
}
function karteSVG(){
  return `<svg class="kartesvg" viewBox="0 0 400 ${KARTE_H}" preserveAspectRatio="xMidYMid meet">
  <defs><linearGradient id="kh" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7f9fcf"/><stop offset=".16" stop-color="#cfdcec"/><stop offset=".3" stop-color="#e3dde8"/><stop offset=".45" stop-color="#cdb6cf"/>
    <stop offset=".58" stop-color="#f1d7d3"/><stop offset=".72" stop-color="#dfe8d6"/><stop offset=".86" stop-color="#cfe3c0"/><stop offset="1" stop-color="#f3dcae"/></linearGradient></defs>
  <rect width="400" height="${KARTE_H}" fill="url(#kh)"/>
  <!-- Gipfel -->
  ${sterne(24,140,5)}${berge(360,'#b7c6d8','#fff',[[195,300,170]])}${berge(380,'#9fb1c8','#f3f6fa',[[40,200,100],[360,220,110]])}
  ${wolke(80,110,16)}${wolke(320,170,14)}
  ${Array.from({length:14},(_,i)=>`<circle class="flocke" style="animation-delay:${-(i*.9)%8}s;animation-duration:${7+(i%4)}s" cx="${(i*71)%400}" cy="-10" r="${1.5+(i%3)}" fill="#fff"/>`).join('')}
  <!-- Berge mit Werkstatt -->
  ${berge(600,'#a9b8cb','#fff',[[60,230,110],[340,260,120]])}${berge(620,'#8b9cb3',null,[[200,170,150]])}
  ${tanne(40,610,16)}${tanne(370,620,15)}${werkstatt(300,560,.8)}
  <!-- Hexenhaus -->
  ${huegel(800,'#a58fb0',30,0)}${hexenhaus(60,760,.8)}<g class="fledermaus"><text font-size="16">🦇</text></g>
  <!-- Zauberwald -->
  ${huegel(1010,'#c7d6bf',30,50)}${birke(30,1050,230,10)}${birke(370,1060,250,11)}${birke(340,1040,150,7)}${birke(70,1030,140,6)}
  <text x="180" y="1010" font-size="18">🍄</text>
  <!-- Wiese -->
  ${huegel(1230,'#b5d394',35,0)}${huegel(1270,'#9fc57f',30,50)}
  ${Array.from({length:16},(_,i)=>`<circle cx="${(i*67)%400}" cy="${1190+(i*29)%90}" r="${2.5+(i%2)}" fill="${['#fff','#ffd54f','#f48fb1'][i%3]}"/>`).join('')}
  <ellipse cx="320" cy="1200" rx="18" ry="6" fill="#5d4a3a"/><g class="ohren"><ellipse cx="315" cy="1188" rx="3" ry="9" fill="#f2ece4"/><ellipse cx="324" cy="1188" rx="3" ry="9" fill="#f2ece4"/></g>
  <!-- Strand -->
  <g class="wellenzug">${wellen(1300,['#9fd3e0','#7fc0d3','#5fa9c2'],3,KARTE_H)}</g>
  <path d="M0 1420 Q120 1395 240 1410 T400 1400 V${KARTE_H} H0Z" fill="#f3d9a8"/>
  <text x="40" y="1470" font-size="18">🐚</text><text x="330" y="1460" font-size="16">🦀</text>
  <!-- Weg -->
  <path d="${kartePfad()}" fill="none" stroke="#fff8ee" stroke-width="16" stroke-linecap="round" opacity=".85"/>
  <path id="weg" d="${kartePfad()}" fill="none" stroke="#e2c49b" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>
  </svg>`;
}
