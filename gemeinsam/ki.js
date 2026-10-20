/* Sam lernt – Anbindung an den KI-Helfer (server/). Ohne eingetragene Adresse bleibt alles lokal.
   Die KI erfindet neue Geschichten mit den Figuren und schreibt Eltern-Berichte. */

// Was die KI in Bildern zeigen darf – muss zur Liste im Server passen
const KI_TOKENS=['pig','pig:big','pig:fall','monkey','monkey:big','skel','skel:big','skel:dance','skel:flip','pirate','pirate:big',
  '☁️','🌙','⭐','🌈','☀️','🌊','🏝️','🌴','🌳','🌸','🍎','🍌','🍓','🎂','🍦','🧦','🗺️','⛵','⛏️','💰','👑','🎈','🎁','🎵','🎶','🎺','🥁',
  '🐦','🐟','🐙','🦀','🐢','🦖','🦕','🐶','🐱','🐮','🐸','🦆','🐞','🦴','💀','💦','💨','😄','😂','😴','❤️','🏠','🚗','🚂','🚀','⚽','🧸'];
const KI_THEMEN=['ein Ausflug ans Meer','ein Geburtstag','ein verlorener Schuh','Regenwetter','ein Zauberhut','ein Picknick','ein Wettrennen','die Nacht im Zelt','ein Kuchen backen','ein neuer Freund','ein Ballon, der wegfliegt','Zählen bis fünf'];

const KI={
  url:load('ki.url',''),code:load('ki.code',''),sendName:load('ki.sendName',false),
  ready(){return !!this.url},
  async call(path,body,ms=45000){
    const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),ms);
    try{
      const r=await fetch(this.url.replace(/\/+$/,'')+path,{method:'POST',signal:ctrl.signal,
        headers:{'content-type':'application/json','x-zugang':this.code},body:JSON.stringify(body)});
      const j=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(j.fehler||('HTTP '+r.status));
      return j;
    }finally{clearTimeout(to)}
  },
  // Nur Geschichten durchlassen, die das Spiel auch zeigen kann
  valid(st){
    return st&&typeof st.t==='string'&&Array.isArray(st.p)&&st.p.length>=2&&st.p.length<=8&&
      st.p.every(pg=>pg&&typeof pg.x==='string'&&pg.x.length<400&&Array.isArray(pg.s)&&pg.s.length>=1&&pg.s.length<=4&&pg.s.every(x=>KI_TOKENS.includes(x)));
  },
  async fetchStory(){
    const st=await this.call('/geschichte',{name:this.sendName?state.name:'',thema:rnd(KI_THEMEN)});
    if(!this.valid(st))throw new Error('Geschichte unpassend');
    return st;
  },
  // Eine Geschichte liegt immer schon bereit, damit das Kind nicht warten muss
  prefetch(){
    if(!this.ready()||this._loading)return;
    try{if(sessionStorage.getItem('samlernt.kiStory'))return}catch(e){}
    this._loading=this.fetchStory().then(st=>{try{sessionStorage.setItem('samlernt.kiStory',JSON.stringify(st))}catch(e){}})
      .catch(()=>{}).finally(()=>{this._loading=null});
  },
  async story(){
    let st=null;
    try{st=JSON.parse(sessionStorage.getItem('samlernt.kiStory')||'null');sessionStorage.removeItem('samlernt.kiStory')}catch(e){}
    if(!this.valid(st))st=await this.fetchStory();
    this.prefetch();
    return st;
  },
  async report(stats){return (await this.call('/bericht',{name:this.sendName?state.name:'',stats},60000)).text},

  parentsHTML(){
    return `<div class="box">
      <h2>KI-Helfer (optional)</h2>
      <p>Mit KI erfindet das Spiel immer neue Geschichten mit Rosi, Bobo, Klapper und Paul und schreibt euch einen kurzen Bericht über den Lernstand. Dafür braucht es Internet und den eigenen KI-Server (siehe <i>LIESMICH.md</i>). Ohne Adresse bleibt alles lokal.</p>
      <p>Adresse: <input type="text" id="kiurl" style="width:100%" placeholder="https://sam-lernt-ki.….workers.dev" value="${esc(this.url)}"></p>
      <p>Zugangscode: <input type="text" id="kicode" value="${esc(this.code)}" autocomplete="off"></p>
      <p><label><input type="checkbox" id="kiname" ${this.sendName?'checked':''}> Den Vornamen an die KI schicken (sonst bleibt er auf dem Gerät)</label></p>
      <p><button class="sb" id="kitest">Verbindung testen</button> <button class="sb" id="kireport">📝 Bericht schreiben lassen</button></p>
      <p id="kiout" style="white-space:pre-wrap"></p>
    </div>`;
  },
  wireParents(getStats){
    $('#kiurl').onchange=e=>{this.url=e.target.value.trim();save('ki.url',this.url)};
    $('#kicode').onchange=e=>{this.code=e.target.value.trim();save('ki.code',this.code)};
    $('#kiname').onchange=e=>{this.sendName=e.target.checked;save('ki.sendName',this.sendName)};
    const out=$('#kiout');
    $('#kitest').onclick=async()=>{
      if(!this.ready()){out.textContent='Bitte zuerst die Adresse eintragen.';return}
      out.textContent='Frage den KI-Helfer nach einer Geschichte …';
      try{const st=await this.fetchStory();out.textContent=`✓ Klappt! Neue Geschichte: „${st.t}“`}
      catch(e){out.textContent='✗ Keine Verbindung: '+e.message}
    };
    $('#kireport').onclick=async()=>{
      if(!this.ready()){out.textContent='Bitte zuerst die Adresse eintragen.';return}
      out.textContent='Der Bericht wird geschrieben …';
      try{out.textContent=await this.report(getStats())}catch(e){out.textContent='✗ Das hat nicht geklappt: '+e.message}
    };
  }
};
KI.prefetch();
