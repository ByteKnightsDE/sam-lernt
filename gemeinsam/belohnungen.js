/* Sam lernt – die Schatzkiste und alle Überraschungen darin */

const REWARDS=[
  {id:'video',ico:'🦖🎬',label:'Dino-Video',ok:()=>state.videos.some(ytId),run:d=>playVideo(rnd(state.videos.filter(ytId)),d)},
  {id:'story',ico:'📖',label:'Geschichte',run:d=>story(d)},
  {id:'riddle',ico:'🤔',label:'Rätsel',run:d=>riddles(d)},
  {id:'treasure',ico:()=>fig('pirate'),label:'Schatzsuche',run:d=>treasure(d)},
  {id:'disco',ico:()=>fig('skel'),label:'Skelett-Disco',run:d=>disco(d)},
  {id:'monkey',ico:()=>fig('monkey'),label:'Affe füttern',run:d=>feedMonkey(d)},
  {id:'pigs',ico:()=>fig('pig'),label:'Schweine-Flug',run:d=>pigs(d)},
  {id:'balloons',ico:'🎈',label:'Ballon-Party',run:d=>balloons(d)},
  {id:'egg',ico:'🥚',label:'Überraschungs-Ei',run:d=>egg(d)}
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
    hush();sfx.ok();confetti();
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
const scItem=tok=>{
  const [n,cls='']=tok.split(':');
  return FIG[n]?`<div class="sc ${cls}">${fig(n,cls==='dance'?'dance':cls==='flip'?'flip':'')}</div>`:`<div class="sc ${cls}">${n}</div>`;
};

/* ---------- Geschichten ---------- */
const STORIES=[
  {t:'Rosi, das fliegende Schwein',p:[
    {s:['pig:big','☁️'],x:'Das ist Rosi. Rosi ist ein Schwein. Aber kein normales Schwein – Rosi hat Flügel!'},
    {s:['☁️','pig','🐦'],x:'Rosi flattert hoch in den Himmel. Ein kleiner Vogel staunt: Ein Schwein, das fliegt?'},
    {s:['🎂','🎂','🎂','pig'],x:'Auf einer Wolke findet Rosi drei Torten. Mampf, mampf, mampf! Rosi isst alle auf.'},
    {s:['pig:fall','💦'],x:'Oh nein! Jetzt ist Rosi zu schwer. Sie plumpst hinunter – mitten in eine Matschpfütze!'},
    {s:['pig:big','😄'],x:'Platsch! Rosi lacht. Denn was mögen Schweine am allerliebsten? Matsch! Ende.'}]},
  {t:'Pirat Paul und der Schatz',p:[
    {s:['pirate:big','🗺️'],x:'Das ist Pirat Paul. Er hat eine Schatzkarte! Arrr!'},
    {s:['⛵','🌊','🏝️'],x:'Paul segelt über das große Meer zu einer kleinen Insel.'},
    {s:['pirate','⛏️','🏝️'],x:'Dort buddelt er und buddelt er. Da – eine Schatzkiste!'},
    {s:['🧦','💨','pirate'],x:'Paul macht die Kiste auf. Drin ist … eine alte Stinkesocke! Puh!'},
    {s:['pirate:big','🧦'],x:'Paul lacht laut: Das ist ja meine Socke! Die suche ich schon seit Wochen! Ende.'}]},
  {t:'Klapper, das kitzlige Skelett',p:[
    {s:['🌙','skel:big','⭐'],x:'Nachts, wenn alle schlafen, wacht Klapper auf. Klapper ist ein Skelett.'},
    {s:['🎵','skel:dance','🎶'],x:'Klapper tanzt so gern! Klapper, klapper, klapper machen seine Knochen.'},
    {s:['monkey','skel:dance'],x:'Da kommt Affe Bobo und kitzelt Klapper. Hihi! Haha! Hohoho!'},
    {s:['💀','🦴','🦴','🦴'],x:'Klapper lacht so doll, dass alle Knochen auseinanderfallen. Klapper-di-klapp!'},
    {s:['monkey','skel:flip'],x:'Bobo baut ihn wieder zusammen – aber jetzt steht Klapper auf dem Kopf! Ende.'}]},
  {t:'Bobo und die Riesen-Banane',p:[
    {s:['🌴','monkey:big'],x:'Affe Bobo wohnt im Urwald, ganz oben auf einer Palme.'},
    {s:['monkey','🍌:big'],x:'Eines Tages findet Bobo eine Riesen-Banane. Die ist ja größer als er selbst!'},
    {s:['pig','pirate','skel'],x:'Allein schafft er die nicht. Also ruft er seine Freunde: Rosi, Paul und Klapper.'},
    {s:['🍌','🍌','🍌','🍌'],x:'Bobo teilt die Banane in vier Stücke. Eins für jeden!'},
    {s:['skel','🍌:fall'],x:'Klapper beißt ab – und das Stück plumpst durch seine Rippen auf den Boden. Alle lachen! Ende.'}]},
  {t:'Die große Schweine-Parade',p:[
    {s:['pig'],x:'Eins: Rosi fliegt los.'},
    {s:['pig','pig'],x:'Zwei: Ihr kleiner Bruder fliegt hinterher.'},
    {s:['pig','pig','pig'],x:'Drei: Oma Schwein fliegt auch mit – mit Brille und Hut!'},
    {s:['pig','pig','pig','🎺'],x:'Und Opa Schwein spielt Trompete dazu. Tröt, tröt! Ende.'}]}
];
let lastStory=-1;
async function story(done){
  hush();const t=token,o=overlay();
  o.innerHTML='<div class="q">📖</div><h2>Einen Moment …</h2>';
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

/* ---------- Rätsel ---------- */
const RIDDLES=[
  {q:'Ich bin rosa, habe Flügel und mache Oink. Wer bin ich?',o:['pig','monkey','skel'],a:'pig'},
  {q:'Ich klappere mit meinen Knochen. Wer bin ich?',o:['pirate','skel','pig'],a:'skel'},
  {q:'Ich segle über das Meer und rufe Arrr! Wer bin ich?',o:['monkey','pig','pirate'],a:'pirate'},
  {q:'Ich klettere auf Bäume und esse gern Bananen. Wer bin ich?',o:['skel','monkey','pirate'],a:'monkey'},
  {q:'Was ist gelb und krumm?',o:['🍎','🍌','🚗'],a:'🍌'},
  {q:'Wer macht Muh?',o:['🐱','🐶','🐮'],a:'🐮'},
  {q:'Was leuchtet nachts am Himmel?',o:['🌙','🍌','🐟'],a:'🌙'},
  {q:'Wer schwimmt im Wasser und hat Flossen?',o:['🐟','🐷','🦖'],a:'🐟'},
  {q:'Was schmilzt, wenn die Sonne scheint?',o:['🧱','🍦','🚂'],a:'🍦'},
  {q:'Womit buddelt der Pirat nach dem Schatz?',o:['🎈','🍌','⛏️'],a:'⛏️'},
  {q:'Wer hat einen gaaanz langen Hals?',o:['🦕','🐞','🐟'],a:'🦕'},
  {q:'Wer fliegt durch die Luft, obwohl es eigentlich gar nicht fliegen kann?',o:['pig','🐟','🚗'],a:'pig'},
  {q:'Was hat vier Räder und fährt auf der Straße?',o:['🐌','🚗','🌸'],a:'🚗'},
  {q:'Wer wohnt im Meer und hat acht Arme?',o:['🐙','🐶','🦆'],a:'🐙'}
];
async function riddles(done){
  hush();const t=token,o=overlay(),list=shuffle([...RIDDLES]).slice(0,3);
  let i=0;
  const ask=async()=>{
    if(t!==token)return;
    if(i>=list.length){confetti();await say('Du bist ja ein richtiger Rätsel-Profi!',t);done();return}
    const r=list[i];
    o.innerHTML=`<div class="q">🤔</div><h2>${esc(r.q)}</h2><div class="choices">${shuffle([...r.o]).map(x=>`<button class="opt ropt" data-x="${x}">${FIG[x]?fig(x):x}</button>`).join('')}</div>`;
    let locked=false;
    $$('.ropt').forEach(b=>b.onclick=async()=>{
      if(locked||b.disabled)return;quiet();
      if(b.dataset.x===r.a){
        locked=true;b.classList.add('right');confetti();
        if(CHAR[r.a])CHAR[r.a].sound();else sfx.ok();
        await say(praise()+(CHAR[r.a]?` Das ist ${CHAR[r.a].name}, ${CHAR[r.a].who}.`:''),t);
        i++;ask();
      }else{
        sfx.no();b.classList.add('wrong');b.disabled=true;
        await say('Hihi, nein! Versuch es nochmal.',t);
      }
    });
    await say(r.q,t);
  };
  await say('Rätselzeit!',t);ask();
}

/* ---------- Schatzsuche mit Pirat Paul ---------- */
const FINDS={'🦀':'Ein Krebs! Zwick, zwick!','💀':'Huch! Ein Totenkopf! Klapper, klapper!','🥾':'Nur ein alter Stiefel!','🐙':'Ein Tintenfisch! Blubb!','🐚':'Eine Muschel!'};
function treasure(done){
  hush();const t=token,o=overlay('sea');
  const items=shuffle(['💰','🦀','💀','🥾','🐙','🐚']);
  o.innerHTML=`<div class="side" style="left:2vw;bottom:2vh">${fig('pirate')}</div><h2>Wo ist der Schatz?</h2><div class="mounds">${items.map((x,k)=>`<button class="mound" data-k="${k}"></button>`).join('')}</div>`;
  let found=false;
  $$('.mound').forEach(m=>m.onclick=async()=>{
    if(found||m.classList.contains('dug'))return;
    const x=items[+m.dataset.k];quiet();sfx.dig();
    m.classList.add('dug');m.textContent=x;
    if(x==='💰'){
      found=true;sfx.arr();confetti(['💰','💎','👑','⭐']);
      restart($('.side'),'jump');
      await say(withName('Arrr! Du hast meinen Schatz gefunden')+'! Danke, mein kleiner Pirat!',t);
      endLater(t,done,{showAfter:500,autoAfter:15000});
    }else{
      if(x==='💀')sfx.rattle();
      await say(FINDS[x],t);
    }
  });
  say('Arrr! Ich bin Pirat Paul. Hilf mir, meinen Schatz zu finden! Tippe auf die Sandhügel!',t);
}

/* ---------- Skelett-Disco ---------- */
function disco(done){
  hush();const t=token,o=overlay('disco');
  o.innerHTML=`<h2>💀 Skelett-Disco 🕺</h2><div class="bigfig" id="sk">${fig('skel')}</div>
    <div class="discobtns"><button data-d="drum">🥁</button><button data-d="spin">💃</button><button data-d="trumpet">🎺</button><button data-d="xylo">🦴</button></div>`;
  const sk=$('#sk'),f=sk.querySelector('.fig');
  let beat=0;const iv=setInterval(()=>{if(t!==token||!$('#ov'))return clearInterval(iv);beat++;if(beat%2)sweep(120,50,.15,{type:'sine',vol:.25,lp:3000});else noise(.05,.15,6000)},300);
  const moves={
    drum:()=>{sfx.drum();restart(sk,'jump')},
    spin:()=>{sfx.boing();restart(sk,'spinme')},
    trumpet:()=>{sfx.trumpet();f.classList.add('dance');setTimeout(()=>f.classList.remove('dance'),1600)},
    xylo:()=>{sfx.xylo();sfx.rattle();f.classList.add('talk');setTimeout(()=>f.classList.remove('talk'),1200)}
  };
  $$('.discobtns button').forEach(b=>b.onclick=()=>{quiet();moves[b.dataset.d]()});
  sk.onclick=()=>moves.drum();
  say('Willkommen in der Skelett-Disco! Drück die Knöpfe, dann tanzt Klapper!',t);
  endLater(t,()=>{clearInterval(iv);done()},{showAfter:10000,autoAfter:40000});
}

/* ---------- Affe Bobo füttern ---------- */
function feedMonkey(done){
  hush();const t=token,o=overlay('jungle');
  o.innerHTML=`<h2>Bobo hat Hunger!</h2><div class="bigfig" id="mk" style="margin-top:22vh">${fig('monkey')}</div>`;
  const mk=$('#mk');let fed=0;const total=5;
  for(let i=0;i<total;i++){
    const b=document.createElement('button');b.className='banana';b.textContent='🍌';
    b.style.left=6+i*(80/total)+Math.random()*6+'vw';b.style.top=12+Math.random()*16+'vh';
    b.onclick=async()=>{
      if(b.dataset.used)return;b.dataset.used=1;quiet();
      const br=b.getBoundingClientRect(),mr=mk.getBoundingClientRect();
      b.style.transform=`translate(${mr.left+mr.width/2-br.left-br.width/2}px,${mr.top+mr.height*.55-br.top-br.height/2}px) scale(.4)`;b.style.opacity='0';
      await wait(500,t);if(t!==token)return;
      b.remove();sfx.chomp();restart(mk,'jump');fed++;
      if(fed<total){say(rnd(['Mmmh!','Lecker!','Mampf!','Noch eine!']),t);return}
      sfx.monkey();restart(mk,'flip360');confetti(['🍌','⭐','🎉']);
      await say(withName('Danke')+'! Mein Bauch ist jetzt ganz voll.',t);
      sfx.burp();await wait(800,t);
      await say('Oh! Entschuldigung! Hihi!',t);
      endLater(t,done,{showAfter:300,autoAfter:12000});
    };
    o.appendChild(b);
  }
  mk.onclick=()=>{sfx.monkey();restart(mk,'jump')};
  say('Bobo hat großen Hunger! Tipp auf die Bananen und füttere ihn!',t);
}

/* ---------- Fliegende Dinge fangen: Ballons und Schweine ---------- */
function catcher(done,{cls,title,intro,end,make,hit,every=650}){
  hush();const t=token,o=overlay(cls);
  o.innerHTML=`<h2 style="position:absolute;top:calc(16px + env(safe-area-inset-top));left:0;right:0">${title}</h2>`;
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
    confetti();await say(end,t);await wait(1200,t);if(t===token)done();
  },25000);
}
function boomAt(el,o,txt){
  const r=el.getBoundingClientRect(),b=document.createElement('div');
  b.className='boom';b.textContent=txt;b.style.left=r.left+'px';b.style.top=r.top+'px';o.appendChild(b);setTimeout(()=>b.remove(),500);
}
function balloons(done){
  const inside=['🦖','🐶','🐱','⭐','🦄','🐸','🍭','🐵','🦕','🌈'];
  catcher(done,{title:'🎈 Lass die Ballons platzen! 🎈',intro:'Ballon-Party! Lass ganz viele Ballons platzen!',end:'Juhu! Das hat Spaß gemacht!',every:450,
    make:()=>{const b=document.createElement('button');b.className='balloon';b.textContent='🎈';
      b.style.left=5+Math.random()*80+'vw';b.style.filter=`hue-rotate(${Math.floor(Math.random()*360)}deg)`;b.style.animationDuration=5+Math.random()*3+'s';return b},
    hit:(b,o)=>{sfx.bang();boomAt(b,o,Math.random()<.35?rnd(inside):'💥');b.remove()}});
}
function pigs(done){
  catcher(done,{title:'Fang die fliegenden Schweine!',intro:'Oh, schau mal! Fliegende Schweine! Tipp sie an!',end:'Oink oink! Alle Schweine sind nach Hause geflogen.',
    make:()=>{const p=document.createElement('button');p.className='flypig'+(Math.random()<.5?' rev':'');p.innerHTML=fig('pig');
      p.style.top=12+Math.random()*65+'vh';p.style.animationDuration=4+Math.random()*3+'s';return p},
    hit:(p,o)=>{sfx.oink();boomAt(p,o,rnd(['💫','💖','✨']));p.style.left=getComputedStyle(p).left;p.classList.add('hit');setTimeout(()=>p.remove(),700)}});
}

/* ---------- Überraschungs-Ei ---------- */
const HATCH=[{e:'🦖',n:'ein T-Rex'},{e:'🦕',n:'ein Langhals-Dino'},{e:'🐉',n:'ein Drache'},{e:'🐥',n:'ein Küken'},{e:'🐢',n:'eine Schildkröte'},{e:'🐊',n:'ein Krokodil'},{e:'🦄',n:'ein Einhorn'},{e:'🐧',n:'ein Pinguin'},
  {f:'pig',n:'Rosi, das fliegende Schwein'},{f:'skel',n:'Klapper, das Skelett'}];
function egg(done){
  hush();const t=token,o=overlay(),pet=rnd(HATCH);
  o.innerHTML=`<h2>Tipp auf das Ei!</h2><button class="egg" id="egg">🥚<svg viewBox="0 0 100 100"><polyline class="k1" points="10,48 25,40 36,52 50,42 62,54 75,44 90,50" fill="none" stroke="#5d4037" stroke-width="4"/><polyline class="k2" points="30,46 34,30 44,36 50,22 58,34 66,28 70,46" fill="none" stroke="#5d4037" stroke-width="4"/></svg></button>`;
  const el=$('#egg');let taps=0;
  say('Was ist wohl in dem Ei? Tipp ganz oft drauf!',t);
  el.onclick=async()=>{
    taps++;quiet();sfx.crack();restart(el,'shake');
    if(taps===3)el.classList.add('c1');
    if(taps===5)el.classList.add('c2');
    if(taps<7)return;
    el.onclick=null;
    o.innerHTML=`<h2>Oh! Schau mal!</h2><button class="hatch" id="pet" ${pet.f?'style="width:min(55vw,42vh);height:min(55vw,42vh)"':''}>${pet.f?fig(pet.f):pet.e}</button><p class="clock">Tipp drauf!</p>`;
    pet.f?CHAR[pet.f].sound():sfx.roar();confetti(['🎉','✨','🥚','⭐']);
    const p=$('#pet');
    p.onclick=()=>{restart(p,'jump');pet.f?CHAR[pet.f].sound():Math.random()<.5?sfx.roar():tone([700,900,1100],.08,'square',.06)};
    await say(`Das ist ${pet.n}!`,t);
    endLater(t,done,{showAfter:1500,autoAfter:25000});
  };
}

/* ---------- Dino-Video: eingebettet (über https oder die Startdatei) oder im eigenen Fenster ---------- */
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
  const openWin=()=>{win=window.open(`https://www.youtube.com/watch?v=${id}`,'dinovideo','width=960,height=600')};
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
          $('.ytbox').innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px"><p>Dieses Video darf nur direkt auf YouTube laufen.</p><button class="bigbtn" id="vwin">🦖 Video öffnen</button></div>`;
          $('#vwin').onclick=openWin;
        }}});
    }else $('.ytbox').innerHTML='<p style="padding:20px">Das Video kann gerade nicht geladen werden – gibt es Internet?</p>';
  }else{
    openWin();
    o.innerHTML=`<div style="font-size:min(30vw,22vh)">🦖🎬</div><h2>Das Video läuft im anderen Fenster.</h2><p class="clock" id="clock">⏱ ${fmt(left)}</p><button class="bigbtn" id="vdone">Fertig ▶</button>`;
    $('#vdone').onclick=finish;
    if(!win)$('h2').textContent='Das Fenster wurde blockiert – bitte Pop-ups für diese Seite erlauben.';
  }
}
