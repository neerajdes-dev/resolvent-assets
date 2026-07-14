const CACHE_NAME="resolvent-vcard-v2-2";
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/style.css",
  "./assets/script.js",
  "./assets/Resolvent_Logo.jpg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./neeraj-desai/",
  "./neeraj-desai/index.html",
  "./neeraj-desai/profile.jpg",
  "./neeraj-desai/neeraj-desai.vcf",
  "./neeraj-sahu/",
  "./neeraj-sahu/index.html",
  "./neeraj-sahu/profile.jpg",
  "./neeraj-sahu/neeraj-sahu.vcf"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).catch(()=>caches.match("./index.html")))
  );
});