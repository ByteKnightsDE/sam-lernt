/* Sam lernt – fest eingebauter KI-Helfer (ChatGPT über den eigenen Server in ki-server/).
   Die KI erfindet neue Geschichten mit den Figuren und schreibt Eltern-Berichte.
   Ohne Internet oder ohne Zugangscode nimmt das Spiel still die eingebauten Geschichten. */

// Adresse des eigenen KI-Servers – fest für alle Geräte. Steht nach "npx wrangler deploy" im Terminal.
const KI_ADRESSE='';

// Was die KI in Bildern zeigen darf – muss zur Liste im Server passen
const KI_TOKENS=['pig','pig:big','pig:fall','monkey','monkey:big','skel','skel:big','skel:dance','skel:flip','pirate','pirate:big',
  '☁️','🌙','⭐','🌈','☀️','🌊','🏝️','🌴','🌳','🌸','🍎','🍌','🍓','🎂','🍦','🧦','🗺️','⛵','⛏️','💰','👑','🎈','🎁','🎵','🎶','🎺','🥁',
  '🐦','🐟','🐙','🦀','🐢','🦖','🦕','🐶','🐱','🐮','🐸','🦆','🐞','🦴','💀','💦','💨','😄','😂','😴','❤️','🏠','🚗','🚂','🚀','⚽','🧸'];
const KI_THEMEN=['ein Ausflug ans Meer','ein Geburtstag','ein verlorener Schuh','Regenwetter','ein Zauberhut','ein Picknick','ein Wettrennen','die Nacht im Zelt','ein Kuchen backen','ein neuer Freund','ein Ballon, der wegfliegt','Zählen bis fünf'];

const KI={
  // Eine im Eltern-Bereich eingetragene Adresse geht vor – nur zum Ausprobieren eines anderen Servers
  url:load('ki.url','')||KI_ADRESSE,code:load('ki.code',''),sendName:load('ki.sendName',true),
  ready(){return !!(this.url&&this.code)},
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
    const eigen=this.url!==KI_ADRESSE;
    return `<div class="box">
      <h2>KI-Helfer (ChatGPT) <span class="ki-status" id="kistat">${this.ready()?'prüfe …':'nicht eingerichtet'}</span></h2>
      <p>ChatGPT erfindet immer neue Geschichten mit Rosi, Bobo, Klapper und Paul und schreibt euch auf Wunsch einen kurzen Bericht über den Lernstand. Ohne Internet laufen die eingebauten Geschichten weiter.</p>
      <p>Zugangscode (einmal pro Gerät): <input type="text" id="kicode" value="${esc(this.code)}" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:12em"></p>
      <p><label><input type="checkbox" id="kiname" ${this.sendName?'checked':''}> Den Vornamen in die Geschichten einbauen (er wird dafür an ChatGPT geschickt)</label></p>
      <p><button class="sb" id="kitest">Verbindung testen</button> <button class="sb" id="kireport">📝 Lernbericht schreiben</button></p>
      <p id="kiout" style="white-space:pre-wrap"></p>
      <details ${eigen||!KI_ADRESSE?'open':''}><summary style="cursor:pointer;font-size:14px">Server-Adresse</summary>
        <p><input type="text" id="kiurl" style="width:100%" placeholder="https://sam-lernt-ki.….workers.dev" value="${esc(this.url)}" autocapitalize="off" spellcheck="false"></p>
        <p style="font-size:13px">${KI_ADRESSE?'Leer lassen für den fest eingebauten Server.':'Noch kein Server fest eingebaut – Adresse hier eintragen.'}</p>
      </details>
    </div>`;
  },
  async status(){
    try{await this.call('/status',{},10000);return true}catch(e){return e.message}
  },
  wireParents(getStats){
    const out=$('#kiout'),stat=$('#kistat');
    const zeige=async()=>{
      if(!stat)return;
      if(!this.ready()){stat.className='ki-status';stat.textContent=this.url?'Zugangscode fehlt':'nicht eingerichtet';return}
      stat.className='ki-status';stat.textContent='prüfe …';
      const r=await this.status();
      if(!stat.isConnected)return;
      stat.className='ki-status '+(r===true?'an':'aus');stat.textContent=r===true?'verbunden':'keine Verbindung';
      if(r!==true)out.textContent='✗ '+r;
    };
    $('#kiurl').onchange=e=>{const v=e.target.value.trim();save('ki.url',v);this.url=v||KI_ADRESSE;zeige()};
    $('#kicode').onchange=e=>{this.code=e.target.value.trim();save('ki.code',this.code);out.textContent='';zeige();this.prefetch()};
    $('#kiname').onchange=e=>{this.sendName=e.target.checked;save('ki.sendName',this.sendName);try{sessionStorage.removeItem('samlernt.kiStory')}catch(x){}};
    $('#kitest').onclick=async()=>{
      if(!this.ready()){out.textContent=this.url?'Bitte zuerst den Zugangscode eintragen.':'Bitte zuerst die Server-Adresse eintragen.';return}
      out.textContent='ChatGPT schreibt eine Probe-Geschichte …';
      try{const st=await this.fetchStory();out.textContent=`✓ Klappt! Neue Geschichte: „${st.t}“`;zeige()}
      catch(e){out.textContent='✗ Das hat nicht geklappt: '+e.message}
    };
    $('#kireport').onclick=async()=>{
      if(!this.ready()){out.textContent='Bitte zuerst den Zugangscode eintragen.';return}
      out.textContent='Der Bericht wird geschrieben …';
      try{out.textContent=await this.report(getStats())}catch(e){out.textContent='✗ Das hat nicht geklappt: '+e.message}
    };
    zeige();
  }
};
KI.prefetch();
