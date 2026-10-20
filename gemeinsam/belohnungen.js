/* Sam lernt – die Schatzkiste und alle Überraschungen darin. Alles spielt im Zauberwald
   mit BluppBlupp und Herrn Zinn: eher staunen und entdecken als laut und hektisch. */

const REWARDS=[
  {id:'video',ico:'🎬',label:'Video',ok:()=>state.videos.some(ytId),run:d=>playVideo(rnd(state.videos.filter(ytId)),d)},
  {id:'story',ico:'📖',label:'Geschichte',run:d=>story(d)},
  {id:'riddle',ico:'🦉',label:'Eulen-Rätsel',run:d=>riddles(d)},
  {id:'fireflies',ico:'✨',label:'Glühwürmchen',run:d=>fireflies(d)},
  {id:'bubbles',ico:()=>`<span class="bubble" style="position:static;display:block;width:80%;animation:none"></span>`,label:'Seifenblasen',run:d=>bubbles(d)},
  {id:'feed',ico:()=>fig('blupp'),label:'BluppBlupp füttern',run:d=>feedBlupp(d)},
  {id:'music',ico:'🎵',label:'Waldmusik',run:d=>music(d)},
  {id:'stone',ico:()=>fig('zinn'),label:'Zauberstein-Suche',run:d=>stone(d)},
  {id:'egg',ico:'🥚',label:'Zauber-Ei',run:d=>egg(d)}
];

async function reward(then){
  hush();const t=token;
  state.prog=0;save('prog',0);
  const o=overlay();
  o.innerHTML=`<h2>Du hast die Schatzkiste erreicht!</h2><button class="gift" id="gift">🎁</button><p class="clock">Tipp die Kiste an!</p>`;
  sfx.fanfare();
  const finish=async()=>{
    hush();closeOverlay();updProg();
    await say(withName("Weiter geht's")+'!',token);
    then();
  };
  $('#gift').onclick=()=>{
    hush();sfx.ok();confetti(['✨','⭐','🍂','🌟']);
    // Ist ein Video eingetragen, ist es immer dabei – dazu zwei zufällige Überraschungen
    const vid=REWARDS[0].ok()?[REWARDS[0]]:[];
    const pick=[...vid,...shuffle(REWARDS.slice(1))].slice(0,3);
    o.innerHTML=`<h2>Was möchtest du?</h2><div class="choices">${pick.map(r=>
      `<button class="choice" data-r="${r.id}"><span class="ico">${typeof r.ico==='function'?r.ico():r.ico}</span>${r.label}</button>`).join('')}</div>`;
    say('Was möchtest du? '+pick.map(r=>r.label).join(', oder ')+'?');
    $$('.choice').forEach(b=>b.onclick=()=>{const r=REWARDS.find(x=>x.id===b.dataset.r);hush();r.run(finish)});
  };
  await say(withName('Juhu')+'! Du hast die Schatzkiste erreicht! Tipp sie an!',t);
}

// Weiter-Knopf nach kurzer Zeit zeigen und nach einer Weile von selbst weitergehen
function endLater(t,done,{showAfter=8000,autoAfter=40000}={}){
  const b=document.createElement('button');b.className='bigbtn';b.textContent='Weiter ▶';b.style.visibility='hidden';
  b.onclick=()=>{if(t===token)done()};
  $('#ov').appendChild(b);
  setTimeout(()=>{if(t===token)b.style.visibility='visible'},showAfter);
  setTimeout(()=>{if(t===token&&$('#ov'))done()},autoAfter);
}
// Ein Bild in einer Geschichte: Figur (mit Variante) oder Emoji
const scItem=tok=>{
  const [n,cls='']=tok.split(':');
  return FIG[n]?`<div class="sc ${cls}">${fig(n,cls==='dance'?'dance':cls==='flip'?'flip':'')}</div>`:`<div class="sc ${cls}">${n}</div>`;
};

/* ---------- Geschichten (ohne Internet; mit KI kommen immer neue dazu) ---------- */
const STORIES=[
  {t:'BluppBlupp und die verlorene Laterne',p:[
    {s:['🌙','blupp:big','🌲'],x:'Es wird Abend im Zauberwald. BluppBlupp, das blaue Nilpferd, gähnt ganz laut.'},
    {s:['zinn','🌲','😴'],x:'Da kommt Onkel Zinn. Oh je! Seine Laterne ist ausgegangen. Jetzt ist es so dunkel.'},
    {s:['✨','✨','✨'],x:'BluppBlupp hat eine Idee. Er ruft leise: Glühwürmchen, kommt her! Eins, zwei, drei!'},
    {s:['zinn:big','✨','blupp'],x:'Die Glühwürmchen setzen sich in die Laterne. Sie leuchtet warm und golden.'},
    {s:['🏡','blupp','zinn'],x:'Zusammen gehen sie nach Hause. Gute Nacht, Zauberwald. Ende.'}]},
  {t:'Die Pilz-Party',p:[
    {s:['🍄','blupp:big','🍄'],x:'Heute feiert der Zauberwald eine Pilz-Party. BluppBlupp hüpft vor Freude. Blubb, blubb!'},
    {s:['🦔','🦊','🐿️'],x:'Der Igel kommt, der Fuchs kommt, und das Eichhörnchen kommt auch.'},
    {s:['🫐','🫐','🍓','🍯'],x:'Herr Zinn bringt Blaubeeren, Erdbeeren und ein Glas Honig mit. Mmmh!'},
    {s:['blupp:dance','🎵','🎶'],x:'Alle tanzen um den großen Pilz. BluppBlupp wackelt mit den Ohren. Wackel, wackel!'},
    {s:['🌟','blupp','zinn'],x:'Und als die Sterne kommen, sind alle müde und froh. Ende.'}]},
  {t:'Der Regenbogen über dem See',p:[
    {s:['🌧️','💧','blupp'],x:'Plitsch, platsch! Es regnet im Zauberwald. BluppBlupp mag Regen – er ist ja ein Nilpferd!'},
    {s:['blupp:fall','💧'],x:'Er springt in eine große Pfütze. Platsch! Jetzt ist er ganz nass und lacht.'},
    {s:['☀️','🌈'],x:'Dann kommt die Sonne. Und schau mal: ein Regenbogen über dem See!'},
    {s:['zinn','🌈','blupp'],x:'Herr Zinn sagt: Der Regenbogen hat sieben Farben. Zählst du mit?'},
    {s:['🌸','🦋','🌸'],x:'Rot, orange, gelb, grün, blau, lila. Und noch ein Lila. Wie schön! Ende.'}]},
  {t:'Die Eule kann nicht schlafen',p:[
    {s:['🦉','🌙'],x:'Oben im Baum sitzt eine kleine Eule. Sie kann nicht schlafen.'},
    {s:['blupp','zinn'],x:'BluppBlupp und Herr Zinn hören sie: Huhu, huhu! Was ist denn los?'},
    {s:['⭐','⭐','⭐','⭐','🦉'],x:'Herr Zinn zeigt in den Himmel: Wir zählen die Sterne. Eins, zwei, drei, vier …'},
    {s:['🦉','😴','🌙'],x:'Bei fünf sind die Augen der Eule ganz schwer. Sie schläft ein. Psst! Ende.'}]}
];
let lastStory=-1;
async function story(done){
  hush();const t=token,o=overlay();
  o.innerHTML=`<div class="hero-fig">${fig('zinn')}</div><h2>Herr Zinn holt sein Geschichtenbuch …</h2>`;
  let st=null;
  if(typeof KI!=='undefined'&&KI.ready())st=await KI.story().catch(()=>null);
  if(t!==token)return;
  if(!st){let i;do{i=Math.floor(Math.random()*STORIES.length)}while(i===lastStory&&STORIES.length>1);lastStory=i;st=STORIES[i]}
  let page=-1;
  const show=async()=>{
    page++;quiet();
    if(page>=st.p.length){done();return}
    const pg=st.p[page];
    o.innerHTML=`<div class="scene">${pg.s.map(scItem).join('')}</div><p class="story-text">${esc(pg.x)}</p><button class="nextbtn" id="nx" style="visibility:hidden">▶</button>`;
    $$('.scene .sc').forEach(el=>el.onclick=()=>{const f=el.querySelector('.fig');if(f){CHAR[f.classList[1]].sound();restart(el,'jump')}});
    const nx=$('#nx');nx.onclick=show;
    await say(pg.x,t);
    if(t===token&&nx.isConnected)nx.style.visibility='visible';
  };
  o.innerHTML=`<div class="q">📖</div><h2>${esc(st.t)}</h2><button class="nextbtn" id="nx">▶</button>`;
  $('#nx').onclick=show;
  await say(st.t,t);
}

/* ---------- Eulen-Rätsel ---------- */
const RIDDLES=[
  {q:'Ich bin blau, rund und mache Blubb. Wer bin ich?',o:['blupp','🦊','🦉'],a:'blupp'},
  {q:'Ich trage einen großen Hut und eine Laterne. Wer bin ich?',o:['🦔','zinn','blupp'],a:'zinn'},
  {q:'Ich habe Stacheln und rolle mich zusammen. Wer bin ich?',o:['🦔','🐸','🦋'],a:'🦔'},
  {q:'Ich rufe nachts Huhu. Wer bin ich?',o:['🦊','🦉','🐌'],a:'🦉'},
  {q:'Ich trage mein Haus auf dem Rücken. Wer bin ich?',o:['🐌','🐿️','🐞'],a:'🐌'},
  {q:'Was leuchtet nachts am Himmel?',o:['🌙','🍄','🐸'],a:'🌙'},
  {q:'Wer quakt am See?',o:['🦉','🐸','🦔'],a:'🐸'},
  {q:'Was fällt im Herbst von den Bäumen?',o:['🍂','⭐','🫐'],a:'🍂'},
  {q:'Was ist klein, blau und schmeckt süß?',o:['🍄','🫐','🌰'],a:'🫐'},
  {q:'Wer hat einen buschigen Schwanz und sammelt Nüsse?',o:['🐿️','🐌','🦉'],a:'🐿️'},
  {q:'Womit leuchtet Herr Zinn im Dunkeln?',o:['🏮','🍂','🦋'],a:'🏮'},
  {q:'Wer hat bunte Flügel und flattert von Blume zu Blume?',o:['🦋','🦔','🐌'],a:'🦋'},
  {q:'Was hat einen Hut, aber keinen Kopf?',o:['🍄','zinn','🦊'],a:'🍄'}
];
async function riddles(done){
  hush();const t=token,o=overlay('lichtung'),list=shuffle([...RIDDLES]).slice(0,3);
  let i=0;
  const ask=async()=>{
    if(t!==token)return;
    if(i>=list.length){confetti(['✨','⭐','🍂']);await say('Huhu! Du bist ja so klug wie eine Eule!',t);done();return}
    const r=list[i];
    o.innerHTML=`<div class="q">🦉</div><h2>${esc(r.q)}</h2><div class="choices">${shuffle([...r.o]).map(x=>`<button class="opt ropt" data-x="${x}">${FIG[x]?fig(x):x}</button>`).join('')}</div>`;
    let locked=false;
    $$('.ropt').forEach(b=>b.onclick=async()=>{
      if(locked||b.disabled)return;quiet();
      if(b.dataset.x===r.a){
        locked=true;b.classList.add('right');confetti(['✨','⭐']);
        if(CHAR[r.a])CHAR[r.a].sound();else sfx.ok();
        await say(praise()+(CHAR[r.a]?` Das ist ${CHAR[r.a].name}, ${CHAR[r.a].who}.`:''),t);
        i++;ask();
      }else{
        sfx.no();b.classList.add('wrong');b.disabled=true;
        await say('Hm, das nicht. Versuch es nochmal.',t);
      }
    });
    await say(r.q,t);
  };
  await say('Die kleine Eule hat Rätsel für dich!',t);ask();
}

/* ---------- Zauberstein-Suche mit Herrn Zinn ---------- */
const FINDS={'🐌':'Eine Schnecke! Ganz langsam kriecht sie weg.','🍄':'Ein kleiner Pilz!','🐞':'Ein Marienkäfer! Er krabbelt auf deinen Finger.','🌰':'Eine Kastanie!','🐛':'Eine Raupe! Die wird mal ein Schmetterling.'};
function stone(done){
  hush();const t=token,o=overlay('moos');
  const items=shuffle(['💎','🐌','🍄','🐞','🌰','🐛']);
  o.innerHTML=`<div class="side" style="left:2vw;bottom:2vh">${fig('zinn')}</div><h2>Wo ist der Zauberstein?</h2><div class="mounds">${items.map((x,k)=>`<button class="mound" data-k="${k}"></button>`).join('')}</div>`;
  let found=false;
  $$('.mound').forEach(m=>m.onclick=async()=>{
    if(found||m.classList.contains('dug'))return;
    const x=items[+m.dataset.k];quiet();sfx.dig();
    m.classList.add('dug');m.textContent=x;
    if(x==='💎'){
      found=true;sfx.fanfare();confetti(['💎','✨','⭐','🌟']);
      restart($('.side'),'jump');
      await say(withName('Da ist er ja! Mein Zauberstein! Danke')+'! Jetzt leuchtet meine Laterne wieder doppelt so hell.',t);
      endLater(t,done,{showAfter:500,autoAfter:15000});
    }else await say(FINDS[x],t);
  });
  say('Herr Zinn hat seinen Zauberstein verloren. Er liegt unter einem Moos-Hügel. Hilfst du suchen?',t);
}

/* ---------- Waldmusik mit BluppBlupp ---------- */
function music(done){
  hush();const t=token,o=overlay('nacht');
  o.innerHTML=`<h2>🎵 Waldmusik 🎵</h2><div class="bigfig" id="bb">${fig('blupp')}</div>
    <div class="discobtns"><button data-d="drum" aria-label="Trommel">🥁</button><button data-d="bell" aria-label="Glöckchen">🔔</button><button data-d="flute" aria-label="Flöte">🎶</button><button data-d="spin" aria-label="Drehen">💫</button></div>`;
  const bb=$('#bb'),f=bb.querySelector('.fig');
  // Leiser, ruhiger Takt im Hintergrund
  let beat=0;const iv=setInterval(()=>{if(t!==token||!$('#ov'))return clearInterval(iv);beat++;if(beat%4===1)sweep(110,60,.3,{type:'sine',vol:.18,lp:2000});if(beat%4===3)noise(.04,.08,5000)},420);
  const moves={
    drum:()=>{sfx.drum();restart(bb,'jump')},
    bell:()=>{bell([1047,1319,1568],.1,.08);f.classList.add('talk');setTimeout(()=>f.classList.remove('talk'),900)},
    flute:()=>{tone([784,880,988,1175,988],.16,'sine',.07);f.classList.add('dance');setTimeout(()=>f.classList.remove('dance'),1800)},
    spin:()=>{sfx.blubb();restart(bb,'spinme')}
  };
  $$('.discobtns button').forEach(b=>b.onclick=()=>{quiet();moves[b.dataset.d]()});
  bb.onclick=()=>moves.drum();
  say('Nachts macht der Zauberwald Musik. Drück die Knöpfe, dann tanzt BluppBlupp!',t);
  endLater(t,()=>{clearInterval(iv);done()},{showAfter:10000,autoAfter:40000});
}

/* ---------- BluppBlupp füttern ---------- */
function feedBlupp(done){
  hush();const t=token,o=overlay('lichtung');
  o.innerHTML=`<h2>BluppBlupp hat Hunger!</h2><div class="bigfig" id="mk" style="margin-top:22vh">${fig('blupp')}</div>`;
  const mk=$('#mk');let fed=0;const total=5,food=['🫐','🍓','🍎','🫐','🍐'];
  for(let i=0;i<total;i++){
    const b=document.createElement('button');b.className='berry';b.textContent=food[i];
    b.style.left=6+i*(80/total)+Math.random()*6+'vw';b.style.top=22+Math.random()*14+'vh';
    b.onclick=async()=>{
      if(b.dataset.used)return;b.dataset.used=1;quiet();
      const br=b.getBoundingClientRect(),mr=mk.getBoundingClientRect();
      b.style.transform=`translate(${mr.left+mr.width/2-br.left-br.width/2}px,${mr.top+mr.height*.5-br.top-br.height/2}px) scale(.4)`;b.style.opacity='0';
      await wait(500,t);if(t!==token)return;
      b.remove();sfx.chomp();restart(mk,'jump');fed++;
      if(fed<total){say(rnd(['Mmmh!','Lecker!','Mampf!','Noch eins, bitte!']),t);return}
      sfx.blubb();restart(mk,'flip360');confetti(['🫐','✨','⭐']);
      await say(withName('Danke')+'! Mein Bauch ist jetzt kugelrund.',t);
      sfx.burp();await wait(800,t);
      await say('Blubb! Oh, Entschuldigung! Hihi!',t);
      endLater(t,done,{showAfter:300,autoAfter:12000});
    };
    o.appendChild(b);
  }
  mk.onclick=()=>{sfx.blubb();restart(mk,'jump')};
  say('BluppBlupp hat großen Hunger. Tipp auf die Beeren und füttere ihn!',t);
}

/* ---------- Dinge fangen, die schweben: Seifenblasen und Glühwürmchen ---------- */
function catcher(done,{cls,title,intro,end,make,hit,every=650,ms=25000,extra=''}){
  hush();const t=token,o=overlay(cls);
  o.innerHTML=`<h2 style="position:absolute;top:calc(16px + env(safe-area-inset-top));left:0;right:0">${title}</h2>${extra}`;
  let running=true;
  const spawn=()=>{
    if(!running||t!==token)return;
    const el=make();
    el.onanimationend=()=>{if(!el.classList.contains('hit'))el.remove()};
    el.onpointerdown=e=>{e.preventDefault();if(!el.classList.contains('hit'))hit(el,o)};
    o.appendChild(el);setTimeout(spawn,every+Math.random()*400);
  };
  spawn();say(intro,t);
  setTimeout(async()=>{
    running=false;if(t!==token)return;
    confetti(['✨','⭐','🌟']);await say(end,t);await wait(1200,t);if(t===token)done();
  },ms);
}
function boomAt(el,o,txt){
  const r=el.getBoundingClientRect(),b=document.createElement('div');
  b.className='boom';b.textContent=txt;b.style.left=r.left+'px';b.style.top=r.top+'px';o.appendChild(b);setTimeout(()=>b.remove(),500);
}
function bubbles(done){
  const inside=['🦋','⭐','🍓','🫐','🌸','🐞','✨'];
  catcher(done,{cls:'lichtung',title:'BluppBlupp pustet Seifenblasen!',intro:'BluppBlupp pustet Seifenblasen. Tipp sie an, dann machen sie Plopp!',end:'Plopp, plopp! Das war schön!',every:520,
    extra:`<div class="side" style="left:2vw;bottom:2vh">${fig('blupp')}</div>`,
    make:()=>{const b=document.createElement('button');b.className='bubble';b.setAttribute('aria-label','Seifenblase');
      b.style.left=12+Math.random()*76+'vw';b.style.animationDuration=6+Math.random()*4+'s';return b},
    hit:(b,o)=>{sfx.bubble();boomAt(b,o,Math.random()<.3?rnd(inside):'💦');b.remove()}});
}
function fireflies(done){
  let n=0;
  catcher(done,{cls:'nacht',title:'Fang die Glühwürmchen!',intro:'Es ist Nacht im Zauberwald. Fang die Glühwürmchen für Herrn Zinns Laterne!',
    end:'Schau mal, wie hell die Laterne jetzt leuchtet! Danke!',every:900,ms:28000,
    extra:`<div class="lanternbig" id="lt">${fig('zinn')}</div>`,
    make:()=>{const f=document.createElement('button');f.className='firefly';f.setAttribute('aria-label','Glühwürmchen');
      f.style.left=5+Math.random()*70+'vw';f.style.top=25+Math.random()*55+'vh';f.style.animationDuration=7+Math.random()*4+'s';return f},
    hit:(f,o)=>{
      sfx.firefly();n++;
      const r=f.getBoundingClientRect(),l=$('#lt').getBoundingClientRect();
      f.style.setProperty('--tx',(l.left+l.width*.8-r.left-r.width/2)+'px');f.style.setProperty('--ty',(l.top+l.height*.76-r.top-r.height/2)+'px');
      // Animation von „wandern“ auf „in die Laterne“ umschalten, an der aktuellen Stelle
      const cs=getComputedStyle(f);f.style.transform=cs.transform;f.classList.add('hit');setTimeout(()=>f.remove(),800);
      $$('#lt .glow').forEach(g=>{g.style.animation='none';g.style.opacity=Math.min(.75,.2+n*.05);g.style.transform=`scale(${1+Math.min(1,n*.07)})`});
    }});
}

/* ---------- Zauber-Ei ---------- */
const HATCH=[{e:'🦉',n:'eine kleine Eule'},{e:'🐉',n:'ein kleiner, freundlicher Drache'},{e:'🐥',n:'ein Küken'},{e:'🐢',n:'eine Schildkröte'},
  {e:'🦄',n:'ein Einhorn'},{e:'🦔',n:'ein Igel'},{e:'🐸',n:'ein Frosch'},{e:'🦋',n:'ein Schmetterling'},{f:'blupp',n:'ein kleines blaues Nilpferd. Wie BluppBlupp!'}];
function egg(done){
  hush();const t=token,o=overlay('lichtung'),pet=rnd(HATCH);
  o.innerHTML=`<h2>Ein Zauber-Ei! Tipp drauf!</h2><button class="egg" id="egg">🥚<svg viewBox="0 0 100 100"><polyline class="k1" points="10,48 25,40 36,52 50,42 62,54 75,44 90,50" fill="none" stroke="#6b4a33" stroke-width="4"/><polyline class="k2" points="30,46 34,30 44,36 50,22 58,34 66,28 70,46" fill="none" stroke="#6b4a33" stroke-width="4"/></svg></button>`;
  const el=$('#egg');let taps=0;
  say('Herr Zinn hat ein Zauber-Ei gefunden. Was ist wohl darin? Tipp ganz oft drauf!',t);
  el.onclick=async()=>{
    taps++;quiet();sfx.crack();restart(el,'shake');
    if(taps===3)el.classList.add('c1');
    if(taps===5)el.classList.add('c2');
    if(taps<7)return;
    el.onclick=null;
    o.innerHTML=`<h2>Oh! Schau mal!</h2><button class="hatch" id="pet" ${pet.f?'style="width:min(55vw,42vh);height:min(55vw,42vh)"':''}>${pet.f?fig(pet.f):pet.e}</button><p class="clock">Tipp drauf!</p>`;
    pet.f?CHAR[pet.f].sound():sfx.fanfare();confetti(['✨','🥚','⭐']);
    const p=$('#pet');
    p.onclick=()=>{restart(p,'jump');pet.f?CHAR[pet.f].sound():sfx.firefly()};
    await say(`Das ist ${pet.n}`+(pet.f?'':'!'),t);
    endLater(t,done,{showAfter:1500,autoAfter:25000});
  };
}

/* ---------- Video: eingebettet (über https oder die Startdatei) oder im eigenen Fenster ---------- */
let ytReady=null;
function loadYT(){
  return ytReady||(ytReady=new Promise(res=>{
    window.onYouTubeIframeAPIReady=res;
    const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>{ytReady=null;res()};
    document.head.appendChild(s);setTimeout(res,8000);
  }));
}
async function playVideo(url,done){
  hush();const t=token,id=ytId(url),o=overlay('dark'),limit=state.videoMin*60;
  let left=limit,ended=false,win=null,player=null;
  const finish=()=>{
    if(ended)return;ended=true;clearInterval(iv);
    try{player&&player.stopVideo()}catch(e){}
    try{win&&!win.closed&&win.close()}catch(e){}
    done();
  };
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const iv=setInterval(()=>{
    if(t!==token)return clearInterval(iv);
    left--;const c=$('#clock');if(c)c.textContent='⏱ '+fmt(Math.max(0,left));
    if(win&&win.closed)finish();
    if(left<=0)finish();
  },1000);
  const openWin=()=>{win=window.open(`https://www.youtube.com/watch?v=${id}`,'samvideo','width=960,height=600')};
  if(location.protocol.startsWith('http')){
    o.innerHTML=`<div class="ytbox"><div id="yt"></div></div><p class="clock" id="clock">⏱ ${fmt(left)}</p><button class="bigbtn" id="vdone">Fertig ▶</button>`;
    $('#vdone').onclick=finish;
    await loadYT();
    if(t!==token||ended)return;
    if(window.YT&&YT.Player){
      player=new YT.Player('yt',{host:'https://www.youtube-nocookie.com',videoId:id,
        playerVars:{autoplay:1,rel:0,modestbranding:1,playsinline:1,iv_load_policy:3},
        events:{onStateChange:e=>{if(e.data===0)finish()},onError:()=>{
          // Manche Videos verbieten das Einbetten – dann im eigenen Fenster anbieten
          if(ended)return;
          $('.ytbox').innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px"><p>Dieses Video darf nur direkt auf YouTube laufen.</p><button class="bigbtn" id="vwin">🎬 Video öffnen</button></div>`;
          $('#vwin').onclick=openWin;
        }}});
    }else $('.ytbox').innerHTML='<p style="padding:20px">Das Video kann gerade nicht geladen werden – gibt es Internet?</p>';
  }else{
    openWin();
    o.innerHTML=`<div style="font-size:min(30vw,22vh)">🎬</div><h2>Das Video läuft im anderen Fenster.</h2><p class="clock" id="clock">⏱ ${fmt(left)}</p><button class="bigbtn" id="vdone">Fertig ▶</button>`;
    $('#vdone').onclick=finish;
    if(!win)$('h2').textContent='Das Fenster wurde blockiert – bitte Pop-ups für diese Seite erlauben.';
  }
}
