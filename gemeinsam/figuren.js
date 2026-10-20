/* Sam lernt – die Figuren aus dem Zauberwald: BluppBlupp (das blaue Nilpferd) und Herr Zinn (sein Onkel mit der Laterne).
   Gezeichnet nach Marcs Vorlage in bilder/zauberwald.jpg. Ohne Verläufe/Filter mit IDs, damit beliebig viele
   Figuren gleichzeitig auf dem Bildschirm sein können. */

const FIG={
blupp:`<path class="tail" d="M71 74 q8 1 7 7" fill="none" stroke="#6fb2bf" stroke-width="3" stroke-linecap="round"/>
<rect x="35" y="80" width="12" height="15" rx="6" fill="#74b7c4"/><rect x="53" y="80" width="12" height="15" rx="6" fill="#74b7c4"/>
<ellipse cx="41" cy="94" rx="6.5" ry="2.6" fill="#5f9fad"/><ellipse cx="59" cy="94" rx="6.5" ry="2.6" fill="#5f9fad"/>
<ellipse cx="50" cy="67" rx="23" ry="21" fill="#86c6d2"/>
<ellipse cx="50" cy="72" rx="14" ry="13" fill="#a3d6df"/>
<g class="arm al"><ellipse cx="29" cy="66" rx="5.5" ry="9" transform="rotate(18 29 66)" fill="#7dbfcb"/></g>
<g class="arm ar"><ellipse cx="71" cy="66" rx="5.5" ry="9" transform="rotate(-18 71 66)" fill="#7dbfcb"/></g>
<g class="ear el"><circle cx="34" cy="21" r="5.5" fill="#74b7c4"/><circle cx="34" cy="21.5" r="2.8" fill="#f2b8b4"/></g>
<g class="ear er"><circle cx="66" cy="21" r="5.5" fill="#74b7c4"/><circle cx="66" cy="21.5" r="2.8" fill="#f2b8b4"/></g>
<ellipse cx="50" cy="35" rx="21" ry="17" fill="#86c6d2"/>
<ellipse cx="50" cy="44.5" rx="20" ry="12.5" fill="#a3d6df"/>
<circle cx="31.5" cy="42" r="4.2" fill="#f4a3a3" opacity=".55"/><circle cx="68.5" cy="42" r="4.2" fill="#f4a3a3" opacity=".55"/>
<g class="eyes"><circle cx="41" cy="30.5" r="3" fill="#2f3340"/><circle cx="59" cy="30.5" r="3" fill="#2f3340"/>
<circle cx="42.1" cy="29.3" r="1" fill="#fff"/><circle cx="60.1" cy="29.3" r="1" fill="#fff"/></g>
<ellipse cx="44.5" cy="41" rx="1.7" ry="2.3" fill="#4f8792"/><ellipse cx="55.5" cy="41" rx="1.7" ry="2.3" fill="#4f8792"/>
<path class="mouth" d="M43 49.5 q7 5 14 0" fill="none" stroke="#4f8792" stroke-width="2.2" stroke-linecap="round"/>`,

zinn:`<ellipse cx="41" cy="96" rx="7.5" ry="3" fill="#6b4a33"/><ellipse cx="59" cy="96" rx="7.5" ry="3" fill="#6b4a33"/>
<rect x="38" y="80" width="6.5" height="15" rx="2" fill="#7c5c45"/><rect x="55.5" y="80" width="6.5" height="15" rx="2" fill="#7c5c45"/>
<path d="M39 83h5.5M39 87h5.5M39 91h5.5M55.5 83h6.5M55.5 87h6.5M55.5 91h6.5" stroke="#a1826a" stroke-width="1.2"/>
<path d="M30 50 Q50 42 70 50 L75 85 Q50 90 25 85Z" fill="#5f9e8a"/>
<path d="M50 49 L50 87" stroke="#4b8573" stroke-width="1.6"/>
<path d="M50 50 L43 62 M50 50 L57 62" stroke="#4b8573" stroke-width="1.4" fill="none"/>
<rect x="31" y="70" width="10" height="8" rx="2" fill="#568f7c" stroke="#4b8573" stroke-width="1"/>
<rect x="59" y="70" width="10" height="8" rx="2" fill="#568f7c" stroke="#4b8573" stroke-width="1"/>
<circle cx="52.5" cy="66" r="1.2" fill="#e9d9b8"/><circle cx="52.5" cy="74" r="1.2" fill="#e9d9b8"/>
<g class="arm al"><path d="M31 52 Q25 64 29 76" stroke="#5f9e8a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="29.5" cy="77" r="3.3" fill="#f3c9ae"/></g>
<g class="lantern">
  <circle class="glow g1" cx="80" cy="76" r="17" fill="#ffd77e" opacity=".16"/>
  <circle class="glow g2" cx="80" cy="76" r="11" fill="#ffd77e" opacity=".28"/>
  <path d="M75 66 q5 -6 10 0" stroke="#6b4a33" stroke-width="1.6" fill="none"/>
  <rect x="74.5" y="67" width="11" height="3" rx="1" fill="#7a4e33"/>
  <rect x="75.5" y="70" width="9" height="12" rx="2" fill="#ffe2a0" stroke="#7a4e33" stroke-width="1.6"/>
  <path class="flame" d="M80 79 q-2.5 -3 0 -6.5 q2.5 3.5 0 6.5z" fill="#ff9d3c"/>
  <rect x="74.5" y="82" width="11" height="2.6" rx="1" fill="#7a4e33"/>
</g>
<g class="arm ar"><path d="M69 52 Q76 58 79 66" stroke="#5f9e8a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="79.5" cy="66" r="3.3" fill="#f3c9ae"/></g>
<ellipse cx="37" cy="36" rx="4" ry="5" fill="#ece7dd"/><ellipse cx="63" cy="36" rx="4" ry="5" fill="#ece7dd"/>
<circle cx="50" cy="35" r="12.5" fill="#f3c9ae"/>
<path d="M37 39 Q37 58 50 61 Q63 58 63 39 Q58 46 50 46 Q42 46 37 39Z" fill="#f4f1ea"/>
<path d="M42 50 q2 3 0 6 M50 52 q2 3 0 6 M58 50 q-2 3 0 6" stroke="#ddd6c8" stroke-width="1.1" fill="none"/>
<circle cx="42" cy="40" r="2.6" fill="#f0a2a0" opacity=".6"/><circle cx="58" cy="40" r="2.6" fill="#f0a2a0" opacity=".6"/>
<g class="eyes"><circle cx="45" cy="33.5" r="1.5" fill="#3b2a2a"/><circle cx="55" cy="33.5" r="1.5" fill="#3b2a2a"/></g>
<path d="M42.5 30.5 q2.5 -1.6 5 0 M52.5 30.5 q2.5 -1.6 5 0" stroke="#ece7dd" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<path class="mouth" d="M46.5 45 q3.5 2.2 7 0" stroke="#b57d72" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="39.5" r="4.4" fill="#ec8a82"/><circle cx="48.7" cy="38.2" r="1.2" fill="#fff" opacity=".7"/>
<ellipse cx="50" cy="26" rx="21" ry="5" fill="#86603f"/>
<path d="M35 25 Q37 7 54 3 Q68 1 77 13 Q69 9 64 12 Q65 19 65 25 Q50 28 35 25Z" fill="#9c7049"/>
<path d="M36 24 Q50 27 64.5 24" stroke="#7a5536" stroke-width="2.2" fill="none"/>
<path d="M46 12 l1.2 2.4 2.6 .3 -1.9 1.8 .5 2.6 -2.4 -1.3 -2.4 1.3 .5 -2.6 -1.9 -1.8 2.6 -.3z" fill="#e7c46a" opacity=".9"/>`
};

// Wie die Figuren heißen und klingen. count:false – Herr Zinn wird nicht abgezählt („drei Herr Zinns“ klingt schief)
const CHAR={
  blupp:{name:'BluppBlupp',sg:'ein blaues Nilpferd',pl:'blaue Nilpferde',who:'das blaue Nilpferd',sound:()=>sfx.blubb()},
  zinn:{name:'Herr Zinn',sg:'Herr Zinn',pl:'Herr Zinn',who:'BluppBlupps Onkel mit der Laterne',count:false,sound:()=>sfx.zinn()}
};

function fig(name,cls=''){return `<svg class="fig ${name} ${cls}" viewBox="0 0 100 100" aria-hidden="true">${FIG[name]}</svg>`}

// Ab und zu zieht eine Figur sanft durchs Bild – BluppBlupp schwebt an Seifenblasen, Herr Zinn spaziert mit der Laterne
function flyBy(name=rnd(Object.keys(FIG)),withSound=true){
  const d=document.createElement('div');
  d.className='flyer fly-'+name;
  d.innerHTML=fig(name,name==='blupp'?'dance':'');
  if(name==='blupp')d.style.top=10+Math.random()*40+'vh';
  if(name==='zinn')d.style.bottom=3+Math.random()*12+'vh';
  document.body.appendChild(d);
  if(withSound)setTimeout(()=>CHAR[name].sound(),600);
  setTimeout(()=>d.remove(),6200);
}
