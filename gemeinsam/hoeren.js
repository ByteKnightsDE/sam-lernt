/* Sam lernt – Zuhören: Sam antwortet mit seiner Stimme.
   Aufnahme läuft, bis er etwas gesagt hat und kurz still ist (oder höchstens ein paar Sekunden).
   Die Aufnahme geht an den eigenen Server (/api/hoeren), zurück kommt nur der Text.
   Ohne Server (PC über die .bat, kein Internet) gibt es kein Zuhören – die Spiele zeigen dann Knöpfe. */

const HOEREN={stream:null,laeuft:false};
const hoerenMoeglich=()=>!!(navigator.mediaDevices&&window.MediaRecorder&&typeof KI!=='undefined'&&KI.url==='/api'&&navigator.onLine!==false);

async function mikro(){
  if(HOEREN.stream&&HOEREN.stream.getTracks().some(t=>t.readyState==='live'))return HOEREN.stream;
  HOEREN.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  return HOEREN.stream;
}
// Nimmt auf und liefert den erkannten Text – oder '' wenn nichts gesagt wurde. onPegel(0..1) für die Anzeige.
async function hoere({max=5000,stille=900,ohneSprache=4500,onPegel}={}){
  if(HOEREN.laeuft)return '';
  HOEREN.laeuft=true;quiet();
  try{
    const stream=await mikro(),c=actx(),quelle=c.createMediaStreamSource(stream),an=c.createAnalyser();
    an.fftSize=1024;quelle.connect(an);const buf=new Float32Array(an.fftSize);
    const typ=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(x=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(x))||'';
    const rec=new MediaRecorder(stream,typ?{mimeType:typ}:undefined),teile=[];
    rec.ondataavailable=e=>e.data.size&&teile.push(e.data);
    const fertig=new Promise(r=>rec.onstop=r);
    rec.start(200);
    // Ruhepegel kurz messen, dann auf Sprache warten
    let ruhe=0.01,gesprochen=false,letzteSprache=0;const t0=performance.now();
    await new Promise(res=>{
      const tick=()=>{
        an.getFloatTimeDomainData(buf);let q=0;for(const x of buf)q+=x*x;const pegel=Math.sqrt(q/buf.length),jetzt=performance.now();
        if(jetzt-t0<250)ruhe=Math.max(ruhe,pegel*1.3);
        const laut=pegel>Math.max(0.025,ruhe*2.2);
        if(laut){gesprochen=true;letzteSprache=jetzt}
        onPegel&&onPegel(Math.min(1,pegel*8));
        if(jetzt-t0>max||(gesprochen&&jetzt-letzteSprache>stille)||(!gesprochen&&jetzt-t0>ohneSprache))return res();
        requestAnimationFrame(tick);
      };tick();
    });
    rec.stop();await fertig;quelle.disconnect();onPegel&&onPegel(0);
    if(!gesprochen||!teile.length)return '';
    const blob=new Blob(teile,{type:rec.mimeType||typ||'audio/webm'});
    const r=await fetch('/api/hoeren',{method:'POST',headers:{'content-type':blob.type},body:blob});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.fehler||('HTTP '+r.status));
    return String(j.text||'');
  }finally{HOEREN.laeuft=false}
}

/* ---------- Was hat Sam gesagt? ---------- */
const ZAHLWORT={null:0,zero:0,eins:1,ein:1,eine:1,einer:1,eis:1,zwei:2,zwo:2,drei:3,vier:4,'fünf':5,fuenf:5,'fümf':5,sechs:6,sieben:7,acht:8,neun:9,zehn:10,elf:11,'zwölf':12,zwoelf:12,
  dreizehn:13,vierzehn:14,'fünfzehn':15,sechzehn:16,siebzehn:17,achtzehn:18,neunzehn:19,zwanzig:20};
const woerter=t=>String(t).toLowerCase().replace(/[.,!?;:"„“]/g,' ').replace(/\s+/g,' ').trim().split(' ');
// Erste Zahl im Text (Ziffern oder Wort) – oder null
function verstehZahl(text){
  for(const w of woerter(text)){
    if(/^\d{1,2}$/.test(w))return +w;
    if(w in ZAHLWORT)return ZAHLWORT[w];
  }
  return null;
}
// Uhrzeit verstehen: „drei Uhr“, „halb vier“, „Viertel nach zwei“, „Viertel vor fünf“, „3:30“, „drei Uhr dreißig“
function verstehUhr(text){
  const t=String(text).toLowerCase(),ws=woerter(t);
  const m=t.match(/(\d{1,2})[:.](\d{2})/);if(m)return {h:+m[1]%12||12,m:+m[2]};
  const zahlNach=i=>{for(let k=i;k<ws.length;k++){if(/^\d{1,2}$/.test(ws[k]))return +ws[k];if(ws[k] in ZAHLWORT)return ZAHLWORT[ws[k]]}return null};
  const vorher=h=>((h+10)%12)+1;   // eine Stunde zurück, 1 → 12
  const i=ws.findIndex(w=>w==='halb');if(i>=0){const h=zahlNach(i+1);if(h)return {h:vorher(h),m:30}}
  const v=ws.findIndex(w=>w==='viertel'||w==='dreiviertel');
  if(v>=0){
    const rest=ws.slice(v+1);
    if(ws[v]==='dreiviertel'){const h=zahlNach(v+1);if(h)return {h:vorher(h),m:45}}
    if(rest[0]==='nach'){const h=zahlNach(v+2);if(h)return {h:h%12||12,m:15}}
    if(rest[0]==='vor'){const h=zahlNach(v+2);if(h)return {h:vorher(h),m:45}}
  }
  const u=ws.findIndex(w=>w==='uhr');
  if(u>0){
    const h=ws[u-1] in ZAHLWORT?ZAHLWORT[ws[u-1]]:/^\d+$/.test(ws[u-1])?+ws[u-1]:null;
    if(h!=null){const min=ws[u+1]==='dreißig'||ws[u+1]==='dreissig'?30:ws[u+1]==='fünfzehn'?15:ws[u+1]==='fünfundvierzig'?45:0;return {h:h%12||12,m:min}}
  }
  const z=verstehZahl(t);if(z!=null&&z>=1&&z<=12)return {h:z,m:0};
  return null;
}

/* ---------- Sprech-Knopf: Mikrofon mit Pegel-Ring ---------- */
function mikroKnopf(){
  return `<button class="mikro" id="mik" aria-label="Sprechen"><span class="ring" id="ring"></span>🎙️</button><p class="hoerhinweis" id="hh">Tipp aufs Mikrofon und sag es laut!</p>`;
}
// Einmal zuhören mit Anzeige. Liefert Text oder '' (nichts gehört) oder null (Fehler/kein Server).
async function zuhoeren(t){
  const k=$('#mik'),ring=$('#ring'),hh=$('#hh');
  if(!hoerenMoeglich()){if(hh)hh.textContent='Zuhören geht nur mit Internet über die App-Adresse.';return null}
  k&&k.classList.add('live');if(hh)hh.textContent='Ich höre zu …';
  try{
    const text=await hoere({onPegel:p=>{if(ring)ring.style.transform=`scale(${1+p*.6})`}});
    if(t!==token)return null;
    if(hh)hh.textContent=text?`„${text.trim()}“`:'Ich habe nichts gehört.';
    return text;
  }catch(e){
    if(hh)hh.textContent=/denied|NotAllowed|Permission/i.test(e.name+e.message)?'Bitte das Mikrofon erlauben (Einstellungen › Safari › Mikrofon).':'Zuhören hat nicht geklappt: '+e.message;
    return null;
  }finally{k&&k.classList.remove('live')}
}
