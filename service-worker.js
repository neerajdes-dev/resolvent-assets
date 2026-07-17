const CACHE="resolvent-card-2-5-2";
const ASSETS=["./","./employee.html","./assets/css/style.css","./assets/js/app.js","./data/employees.json","./data/company.json","./data/services.json","./data/industries.json","./data/technologies.json","./data/engagement-models.json","./data/stats.json","./data/testimonials.json","./data/clients.json"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener("fetch",event=>event.respondWith(fetch(event.request).catch(()=>caches.match(event.request))));
