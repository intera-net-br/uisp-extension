// Cópia local do trampolim: depois da primeira visita, login.html abre mesmo com o
// GitHub fora, e a navegação (que leva o referrer do equipamento) não sai do navegador.
// A cópia é atualizada no máximo uma vez por dia, sem referrer.
const CACHE = "uisp-login-v1";
const FILES = ["login.html", "style.css"];
const STAMP = "__updated";
const DAY = 24 * 60 * 60 * 1000;

function fresh(file) {
  return fetch(new URL(file, self.registration.scope), { referrerPolicy: "no-referrer", cache: "no-cache" });
}

async function refresh() {
  const cache = await caches.open(CACHE);
  await Promise.all(FILES.map(async (file) => {
    const response = await fresh(file);
    if (response.ok) await cache.put(new URL(file, self.registration.scope), response);
  }));
  await cache.put(STAMP, new Response(String(Date.now())));
}

async function refreshIfOld() {
  const cache = await caches.open(CACHE);
  const stamp = await cache.match(STAMP);
  const updated = stamp ? Number(await stamp.text()) : 0;
  if (Date.now() - updated > DAY) await refresh();
}

self.addEventListener("install", (event) => {
  event.waitUntil(refresh().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const file = FILES.find((name) => url.href.split("#")[0].split("?")[0] === new URL(name, self.registration.scope).href);
  if (event.request.method !== "GET" || !file) return;

  event.respondWith((async () => {
    const cached = await caches.match(new URL(file, self.registration.scope));
    if (cached) {
      event.waitUntil(refreshIfOld().catch(() => {}));
      return cached;
    }
    // Sem cópia local: busca na rede, mas sem repassar o referrer
    const response = await fresh(file);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(new URL(file, self.registration.scope), response.clone());
    }
    return response;
  })());
});
