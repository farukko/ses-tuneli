const CACHE='ses-tuneli-v2';
const FILES=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','apple-touch-icon.png',
'fonts/bricolage-grotesque-latin-500-normal.woff2','fonts/bricolage-grotesque-latin-ext-500-normal.woff2',
'fonts/bricolage-grotesque-latin-800-normal.woff2','fonts/bricolage-grotesque-latin-ext-800-normal.woff2',
'fonts/figtree-latin-400-normal.woff2','fonts/figtree-latin-ext-400-normal.woff2',
'fonts/figtree-latin-600-normal.woff2','fonts/figtree-latin-ext-600-normal.woff2',
'fonts/jetbrains-mono-latin-500-normal.woff2','fonts/jetbrains-mono-latin-ext-500-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate';
  if(isPage){ // önce ağ, yoksa önbellek: güncellemeler hemen gelsin
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
