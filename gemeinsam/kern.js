/* Sam lernt – gemeinsamer Kern für alle Spiele der Reihe:
   Speicher, Stimme, Töne, Sterne, Schatzkiste und Eltern-Einstellungen */

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function load(k,d){try{const v=localStorage.getItem('samlernt.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function save(k,v){try{localStorage.setItem('samlernt.'+k,JSON.stringify(v))}catch(e){}}

// Sterne und Schatzkiste gelten für die ganze Reihe
const state={
  name:load('name',''),stars:load('stars',0),prog:load('prog',0),goal:load('goal',8),
  videos:load('videos',[]),videoMin:load('videoMin',4),voice:load('voice',true),voiceName:load('voiceName',''),
  prompt:null
};
let token=0;

const PRAISE=['Super','Toll gemacht','Richtig','Klasse','Prima','Spitze','Ja, genau','Wunderbar','Sehr gut'];
const praise=()=>rnd(PRAISE)+(state.name&&Math.random()<.5?', '+state.name:'')+'!';
const withName=(s,sep=', ')=>state.name?s+sep+state.name:s;

/* ---------- Computerstimme ---------- */
const hasSpeech='speechSynthesis' in window;
let voice=null;
const voices=()=>hasSpeech?speechSynthesis.getVoices():[];
function pickVoice(){
  const all=voices(),de=all.filter(v=>/^de/i.test(v.lang));
  voice=all.find(v=>v.name===state.voiceName)||de.find(v=>v.localService&&/katja|hedda|anna|petra|marlene/i.test(v.name))||de.find(v=>v.localService)||de[0]||null;
}
if(hasSpeech){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
const keep=[];
function say(text,t=token){
  return new Promise(res=>{
    if(t!==token)return res();
    if(!hasSpeech||!state.voice)return setTimeout(res,350+text.length*45);
    const u=new SpeechSynthesisUtterance(text);
    u.lang=voice?voice.lang:'de-DE';if(voice)u.voice=voice;u.rate=.88;u.pitch=1.15;
    let done=false;const fin=()=>{if(!done){done=true;const i=keep.indexOf(u);if(i>=0)keep.splice(i,1);res()}};
    u.onend=fin;u.onerror=fin;keep.push(u);
    setTimeout(fin,2500+text.length*130);
    // Chrome verschluckt Sätze, die direkt nach cancel() kommen – kurz warten
    setTimeout(()=>{if(t!==token)return fin();speechSynthesis.resume();speechSynthesis.speak(u)},80);
  });
}
const wait=(ms,t)=>new Promise(r=>setTimeout(r,t===token?ms:0));

let audio=null;
function stopAudio(){if(audio){const a=audio;audio=null;a.pause()}}
function playUrl(url,t=token){
  return new Promise(res=>{
    if(t!==token||!state.voice||!url)return res();
    stopAudio();
    const a=new Audio(url);audio=a;
    let done=false;const fin=()=>{if(!done){done=true;res()}};
    a.onended=fin;a.onerror=fin;a.onpause=fin;setTimeout(fin,5000);
    a.play().catch(fin);
  });
}
function quiet(){if(hasSpeech)speechSynthesis.cancel();stopAudio()}
function hush(){token++;quiet()}

/* ---------- Töne ---------- */
let ac=null;
function actx(){
  ac=ac||new(window.AudioContext||window.webkitAudioContext)();
  if(ac.state==='suspended')ac.resume().catch(()=>{});
  return ac;
}
function tone(freqs,dur=.12,type='sine',vol=.15){
  if(!state.voice)return;
  try{
    const c=actx(),t=c.currentTime;
    freqs.forEach((f,i)=>{
      const o=c.createOscillator(),g=c.createGain();
      o.type=type;o.frequency.value=f;
      g.gain.setValueAtTime(vol,t+i*dur);g.gain.exponentialRampToValueAtTime(.001,t+i*dur+dur*1.8);
      o.connect(g).connect(c.destination);o.start(t+i*dur);o.stop(t+i*dur+dur*2);
    });
  }catch(e){}
}
function sweep(f1,f2,dur,{type='sawtooth',vol=.2,lp=1200,delay=0}={}){
  if(!state.voice)return;
  try{
    const c=actx(),t=c.currentTime+delay,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    f.type='lowpass';f.frequency.value=lp;
    g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(.05,dur/4));g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(f).connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05);
  }catch(e){}
}
function noise(dur=.12,vol=.35,freq=1400,delay=0){
  if(!state.voice)return;
  try{
    const c=actx(),b=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length)**2;
    const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    s.buffer=b;f.type='bandpass';f.frequency.value=freq;g.gain.value=vol;
    s.connect(f).connect(g).connect(c.destination);s.start(c.currentTime+delay);
  }catch(e){}
}
const sfx={
  pop:k=>tone([380+k*55],.09,'triangle',.13),
  ok:()=>tone([523,659,784,1047],.1,'triangle'),
  no:()=>tone([240,190],.16,'sine',.12),
  fanfare:()=>tone([523,523,523,698,880,1047],.13,'triangle',.16),
  bang:()=>{noise(.15,.5,900);tone([1200,600],.05,'square',.04)},
  crack:()=>noise(.08,.4,3000),
  roar:()=>sweep(240,65,1,{lp:900,vol:.3}),
  oink:()=>{sweep(330,180,.17,{lp:900,vol:.25});sweep(310,170,.17,{lp:900,vol:.25,delay:.22})},
  monkey:()=>[0,1,2,3].forEach(i=>sweep(i%2?900:600,i%2?1250:820,.11,{type:'square',vol:.06,lp:3000,delay:i*.14})),
  rattle:()=>{for(let i=0;i<9;i++)noise(.035,.45,2600+Math.random()*900,i*.06)},
  arr:()=>sweep(190,85,.75,{lp:700,vol:.3}),
  dig:()=>noise(.18,.45,450),
  chomp:()=>{noise(.06,.5,700);noise(.06,.5,700,.14)},
  burp:()=>sweep(110,70,.6,{lp:500,vol:.35}),
  drum:()=>sweep(160,45,.25,{type:'sine',vol:.55,lp:4000}),
  boing:()=>sweep(180,720,.3,{type:'sine',vol:.15,lp:5000}),
  xylo:()=>tone([1047,1319,1568,2093,1568,1319],.07,'triangle',.1),
  trumpet:()=>tone([392,523,659,784,659,784],.14,'square',.05)
};

/* ---------- Effekte und Ebenen ---------- */
function confetti(set=['🎉','⭐','🎈','✨','🌟','🎊']){
  for(let i=0;i<26;i++){
    const d=document.createElement('div');d.className='cf';d.textContent=rnd(set);
    d.style.left=Math.random()*100+'vw';d.style.animationDuration=1.4+Math.random()*1.4+'s';d.style.animationDelay=Math.random()*.4+'s';
    document.body.appendChild(d);setTimeout(()=>d.remove(),3400);
  }
}
function overlay(cls=''){
  closeOverlay();
  const o=document.createElement('div');o.id='ov';if(cls)o.className=cls;document.body.appendChild(o);return o;
}
function closeOverlay(){const o=$('#ov');if(o)o.remove()}
function restart(el,cls){el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls)}

/* ---------- Sterne und Weg zur Schatzkiste ---------- */
function progHTML(){
  const p=Math.min(1,state.prog/state.goal)*100;
  return `<div class="prog" id="prog"><div class="track"><div class="fill" style="width:${p}%"></div><span class="walker" style="left:${p}%">🦖</span></div><span class="chest">🎁</span><span>⭐<span id="sc">${state.stars}</span></span></div>`;
}
function updProg(){
  const el=$('#prog');if(!el)return;
  const p=Math.min(1,state.prog/state.goal)*100;
  el.querySelector('.fill').style.width=p+'%';el.querySelector('.walker').style.left=p+'%';
  $('#sc').textContent=state.stars;restart(el,'bump');
}
function addStar(){state.stars++;state.prog++;save('stars',state.stars);save('prog',state.prog);updProg()}
// Nach jeder Runde: ist die Schatzkiste erreicht, kommt erst die Belohnung
function next(t,fn){if(t!==token)return;state.prog>=state.goal?reward(fn):fn()}

/* ---------- Name ---------- */
function nameScreen(after){
  state.prompt=null;
  const app=$('#app');
  app.innerHTML=`<div class="home"><div class="q">👋</div><h1 style="font-size:min(10vw,7vh)">Wie heißt du?</h1>
    <input class="nameinput" id="nm" maxlength="20" autocomplete="off" value="${esc(state.name||'Sam')}">
    <button class="bigbtn" id="go">Los geht's ▶</button></div>`;
  const nm=$('#nm');nm.focus();nm.select();
  const go=()=>{
    state.name=nm.value.trim();save('name',state.name);
    after();say(withName('Hallo',' ')+'! Schön, dass du da bist. Was möchtest du spielen?');
  };
  $('#go').onclick=go;nm.onkeydown=e=>{if(e.key==='Enter')go()};
}

/* ---------- Eltern ---------- */
// Nur durch langes Drücken – damit Kinder nicht aus Versehen hineingeraten
function holdToOpen(el,fn,onTap){
  let ht;
  el.onpointerdown=()=>{el.classList.add('hold');ht=setTimeout(fn,1500)};
  el.onpointerup=el.onpointerleave=el.onpointercancel=()=>{clearTimeout(ht);el.classList.remove('hold')};
  el.onclick=()=>onTap&&onTap();
}
function ytId(s){const m=String(s).match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/)||String(s).trim().match(/^([\w-]{11})$/);return m&&m[1]}

// Gemeinsame Eltern-Seite; jedes Spiel kann eigene Abschnitte davor einhängen
function parentsPage({extraHTML='',wire=()=>{},back}){
  state.prompt=null;
  const vs=voices(),de=vs.filter(v=>/^de/i.test(v.lang));
  const opts=(de.length?de:vs).map(v=>`<option value="${esc(v.name)}" ${voice&&v.name===voice.name?'selected':''}>${esc(v.name)}${v.localService?'':' (online)'}</option>`).join('');
  const sel=(id,vals,cur,unit)=>`<select id="${id}">${vals.map(v=>`<option value="${v}" ${v===cur?'selected':''}>${v} ${unit}</option>`).join('')}</select>`;
  const viaServer=location.protocol.startsWith('http');
  $('#app').innerHTML=`<div class="top"><button class="ic" id="home" aria-label="Zurück">🏠</button><b style="font-size:22px">👪 Eltern</b><span style="width:10vh"></span></div>
  <div class="parents">
    <div class="box">
      <h2>Kind</h2>
      <p>Name: <input type="text" id="pname" maxlength="20" value="${esc(state.name)}"></p>
      <p>Sterne insgesamt: ⭐ ${state.stars} &nbsp; <button class="sb" id="reset">Sterne auf 0</button></p>
    </div>
    ${extraHTML}
    <div class="box">
      <h2>Belohnung</h2>
      <p>Schatzkiste alle ${sel('goal',[5,8,10,15,20],state.goal,'Sterne')} &nbsp; Video höchstens ${sel('vmin',[2,3,4,5,8,10],state.videoMin,'Minuten')}</p>
      <p>In der Schatzkiste darf er aus drei Überraschungen wählen: Geschichten, Rätsel, Schatzsuche, Skelett-Disco, Affe füttern, Schweine-Flug, Ballons, Überraschungs-Ei – und ein <b>Dino-Video</b>, wenn unten Links stehen. Danach geht es von selbst weiter.</p>
      <p><b>YouTube-Links</b> – einer pro Zeile. Am besten die Videos vorher selbst anschauen, das Spiel nimmt zufällig eins davon:</p>
      <textarea id="vids" placeholder="https://www.youtube.com/watch?v=...">${esc(state.videos.join('\n'))}</textarea>
      <p class="ok" id="vcount"></p>
      <p>${viaServer?'✓ Gestartet über „Sam lernt starten.bat“ – die Videos laufen direkt im Spiel.':'Hinweis: Die Seite ist direkt als Datei geöffnet. Dann öffnet sich das Video in einem eigenen Fenster. Im Spiel eingebettet läuft es, wenn ihr über <b>„Sam lernt starten.bat“</b> startet.'}</p>
    </div>
    <div class="box">
      <h2>Computerstimme</h2>
      ${!hasSpeech?'<p>Dieser Browser hat keine Sprachausgabe. Bitte Edge oder Chrome verwenden.</p>':
        vs.length?`<p><select id="vsel">${opts}</select> <button class="sb" id="vtest">▶ Testen</button></p>
        <p>${de.length?`${de.length} deutsche Stimme${de.length>1?'n':''} gefunden.`:'<b>Keine deutsche Stimme gefunden.</b>'} Ist nichts zu hören: Lautstärke prüfen, eine andere Stimme wählen oder unter Windows <i>Einstellungen › Zeit und Sprache › Sprache</i> bei „Deutsch“ die Sprachausgabe nachinstallieren.</p>`
        :'<p><b>Der Browser meldet keine einzige Stimme.</b> Unter Windows: <i>Einstellungen › Zeit und Sprache › Sprache</i> → Deutsch → Optionen → Sprachausgabe installieren, danach den Browser neu starten.</p>'}
    </div>
  </div>`;
  $('#home').onclick=()=>{hush();back()};
  $('#pname').onchange=e=>{state.name=e.target.value.trim();save('name',state.name)};
  $('#reset').onclick=()=>{if(confirm('Sterne wirklich auf 0 setzen?')){state.stars=0;state.prog=0;save('stars',0);save('prog',0);$('#reset').parentNode.firstChild.textContent='Sterne insgesamt: ⭐ 0 '}};
  $('#goal').onchange=e=>{state.goal=+e.target.value;save('goal',state.goal)};
  $('#vmin').onchange=e=>{state.videoMin=+e.target.value;save('videoMin',state.videoMin)};
  const vc=()=>{const n=state.videos.filter(ytId).length,bad=state.videos.length-n;$('#vcount').textContent=(n?`✓ ${n} Video${n>1?'s':''} erkannt`:'Noch keine Videos – dann gibt es nur die anderen Überraschungen.')+(bad?` · ${bad} Zeile${bad>1?'n':''} nicht erkannt`:'')};
  $('#vids').oninput=e=>{state.videos=e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);save('videos',state.videos);vc()};vc();
  if($('#vsel')){
    $('#vsel').onchange=e=>{state.voiceName=e.target.value;save('voiceName',state.voiceName);pickVoice()};
    $('#vtest').onclick=()=>{hush();say(withName('Hallo',' ')+'! Eins, zwei, drei. Das klappt!')};
  }
  wire();
}

/* ---------- iPad und iPhone ---------- */
// Safari erlaubt Ton und Sprache erst nach der ersten Berührung – dabei beides freischalten
function unlock(){
  try{actx().resume()}catch(e){}
  if(hasSpeech){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}
}
document.addEventListener('pointerdown',unlock,{once:true,capture:true});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ac&&ac.state!=='running')ac.resume().catch(()=>{})});
// Offline spielbar, sobald die Seite einmal über https geladen wurde
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
