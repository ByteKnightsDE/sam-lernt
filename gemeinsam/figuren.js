/* Sam lernt – die Figuren der Reihe: Rosi (fliegendes Schwein), Bobo (Affe), Klapper (Skelett), Paul (Pirat) */

const FIG={
pig:`<g class="wing wl"><path d="M32 52 Q8 26 3 42 Q12 44 9 53 Q18 51 32 60Z" fill="#fff" stroke="#9fb3d6" stroke-width="2.5" stroke-linejoin="round"/></g>
<g class="wing wr"><path d="M68 52 Q92 26 97 42 Q88 44 91 53 Q82 51 68 60Z" fill="#fff" stroke="#9fb3d6" stroke-width="2.5" stroke-linejoin="round"/></g>
<path class="tail" d="M77 66 q11 -1 9 -10 q-2 -6 -7 -2" fill="none" stroke="#e57fa0" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="67" rx="28" ry="21" fill="#f7a8c4"/>
<rect x="33" y="80" width="8" height="13" rx="3" fill="#e88aac"/><rect x="59" y="80" width="8" height="13" rx="3" fill="#e88aac"/>
<path d="M31 32 L25 13 L44 24Z" fill="#e88aac"/><path d="M69 32 L75 13 L56 24Z" fill="#e88aac"/>
<circle cx="50" cy="41" r="22" fill="#f9b6cd"/>
<circle cx="35" cy="46" r="4" fill="#ff8fb0" opacity=".6"/><circle cx="65" cy="46" r="4" fill="#ff8fb0" opacity=".6"/>
<circle cx="41" cy="36" r="3.6" fill="#3b2a2a"/><circle cx="59" cy="36" r="3.6" fill="#3b2a2a"/>
<circle cx="42.3" cy="34.7" r="1.2" fill="#fff"/><circle cx="60.3" cy="34.7" r="1.2" fill="#fff"/>
<ellipse cx="50" cy="48" rx="10" ry="7" fill="#f28db2" stroke="#e07aa0" stroke-width="1.5"/>
<ellipse cx="46.5" cy="48" rx="2" ry="3" fill="#b85a7c"/><ellipse cx="53.5" cy="48" rx="2" ry="3" fill="#b85a7c"/>`,

monkey:`<path class="tail" d="M68 80 q24 4 20 -17 q-3 -10 -10 -4" fill="none" stroke="#8d5a3b" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="50" cy="78" rx="20" ry="17" fill="#8d5a3b"/><ellipse cx="50" cy="81" rx="12" ry="10" fill="#e8c39e"/>
<circle cx="24" cy="40" r="10" fill="#8d5a3b"/><circle cx="24" cy="40" r="6" fill="#e8c39e"/>
<circle cx="76" cy="40" r="10" fill="#8d5a3b"/><circle cx="76" cy="40" r="6" fill="#e8c39e"/>
<path d="M44 18 q6 -12 12 0" fill="#8d5a3b"/>
<circle cx="50" cy="41" r="25" fill="#8d5a3b"/>
<path d="M50 27 c-12 -6 -22 2 -20 12 c-4 6 -2 18 20 20 c22 -2 24 -14 20 -20 c2 -10 -8 -18 -20 -12z" fill="#e8c39e"/>
<circle cx="42" cy="37" r="3.6" fill="#3b2a2a"/><circle cx="58" cy="37" r="3.6" fill="#3b2a2a"/>
<circle cx="43.3" cy="35.7" r="1.2" fill="#fff"/><circle cx="59.3" cy="35.7" r="1.2" fill="#fff"/>
<circle cx="47" cy="46" r="1.4" fill="#5a3522"/><circle cx="53" cy="46" r="1.4" fill="#5a3522"/>
<path class="mouth" d="M40 51 q10 9 20 0" fill="none" stroke="#5a3522" stroke-width="2.6" stroke-linecap="round"/>`,

skel:`<g class="arm al"><path d="M39 59 L23 73" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/><circle cx="22" cy="74" r="4.5" fill="#fafafa"/></g>
<g class="arm ar"><path d="M61 59 L77 73" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/><circle cx="78" cy="74" r="4.5" fill="#fafafa"/></g>
<path d="M50 52 V84" stroke="#fafafa" stroke-width="5"/>
<path d="M38 59 q12 6 24 0 M39 66 q11 5 22 0 M41 73 q9 4 18 0" fill="none" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
<path d="M40 83 q10 8 20 0" stroke="#fafafa" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M43 86 L38 97 M57 86 L62 97" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/>
<path d="M30 30 a20 20 0 0 1 40 0 v8 q0 6 -6 8 v4 h-28 v-4 q-6 -2 -6 -8z" fill="#fafafa"/>
<circle cx="42" cy="32" r="6.5" fill="#333"/><circle cx="58" cy="32" r="6.5" fill="#333"/>
<circle cx="43.6" cy="30.8" r="2" fill="#fff"/><circle cx="59.6" cy="30.8" r="2" fill="#fff"/>
<path d="M50 38 l-3 5 h6z" fill="#333"/>
<g class="jaw"><rect x="38" y="46" width="24" height="8" rx="3" fill="#fafafa"/><path d="M44 46v8M50 46v8M56 46v8" stroke="#9e9e9e" stroke-width="1.5"/></g>`,

pirate:`<path d="M24 99 q2 -27 26 -29 q24 2 26 29z" fill="#1e88e5"/>
<path d="M29 86h42M26 94h48" stroke="#fff" stroke-width="4"/>
<circle cx="50" cy="48" r="22" fill="#f6c9a0"/>
<path d="M30 52 q2 22 20 24 q18 -2 20 -24 q-6 8 -20 8 q-14 0 -20 -8z" fill="#6d3f1f"/>
<path class="mouth" d="M43 61 q7 5 14 0" stroke="#3b2a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M37 57 q7 -6 13 0 q6 -6 13 0 q-7 3 -13 0 q-6 3 -13 0z" fill="#5a3218"/>
<circle cx="50" cy="51" r="3.6" fill="#eaa77f"/>
<circle cx="58" cy="43" r="3.5" fill="#3b2a2a"/><circle cx="59.2" cy="41.8" r="1.2" fill="#fff"/>
<path d="M30 35 L70 46" stroke="#222" stroke-width="2"/><ellipse cx="42" cy="43" rx="6.5" ry="5.5" fill="#222"/>
<path d="M27 42 q2 -22 23 -22 q21 0 23 22 q-23 -8 -46 0z" fill="#e53935"/>
<circle cx="41" cy="30" r="2" fill="#fff"/><circle cx="55" cy="27" r="2" fill="#fff"/><circle cx="64" cy="34" r="2" fill="#fff"/>
<path d="M72 36 l13 -5 l-4 11z M72 39 l11 8 l-13 1z" fill="#c62828"/>
<circle cx="28" cy="53" r="3.2" fill="none" stroke="#fbc02d" stroke-width="2.2"/>`
};

// Wie die Figuren heißen und klingen
const CHAR={
  pig:{name:'Rosi',sg:'ein fliegendes Schwein',pl:'fliegende Schweine',who:'das fliegende Schwein',sound:()=>sfx.oink()},
  monkey:{name:'Bobo',sg:'ein Affe',pl:'Affen',who:'der Affe',sound:()=>sfx.monkey()},
  skel:{name:'Klapper',sg:'ein Skelett',pl:'Skelette',who:'das Skelett',sound:()=>sfx.rattle()},
  pirate:{name:'Paul',sg:'ein Pirat',pl:'Piraten',who:'der Pirat',sound:()=>sfx.arr()}
};

function fig(name,cls=''){return `<svg class="fig ${name} ${cls}" viewBox="0 0 100 100" aria-hidden="true">${FIG[name]}</svg>`}

// Eine Figur kurz über den Bildschirm sausen lassen – zur Freude zwischendurch
function flyBy(name=rnd(Object.keys(FIG)),withSound=true){
  const d=document.createElement('div');
  d.className='flyer fly-'+name;
  d.innerHTML=fig(name,name==='skel'?'dance':'');
  if(name==='pig')d.style.top=8+Math.random()*45+'vh';
  if(name==='monkey')d.style.left=15+Math.random()*60+'vw';
  if(name==='skel')d.style.left=10+Math.random()*70+'vw';
  if(name==='pirate')d.style.bottom=4+Math.random()*30+'vh';
  document.body.appendChild(d);
  if(withSound)setTimeout(()=>CHAR[name].sound(),500);
  setTimeout(()=>d.remove(),3200);
}
