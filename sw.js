/* Sam lernt – hält die Spiele für unterwegs bereit (offline spielbar).
   Bei jeder neuen Version VERSION hochzählen, damit Geräte die neuen Dateien holen. */
const VERSION='sam-lernt-2';
const FILES=['./','index.html','mathe.html','manifest.webmanifest',
  'gemeinsam/stil.css','gemeinsam/kern.js','gemeinsam/figuren.js','gemeinsam/belohnungen.js','gemeinsam/ki.js','gemeinsam/schrift/nunito.woff2',
  'bilder/icon-180.png','bilder/icon-192.png','bilder/icon-512.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});

// Eigene Dateien: erst das Netz fragen (damit Änderungen sofort ankommen), ohne Netz aus dem Speicher
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));return r})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
