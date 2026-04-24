const CACHE_NAME = "langgers-v1.0.0";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png"
];

// Install: cache semua asset inti
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first (cepat + offline)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request)
          .then((res) => {
            // simpan ke cache (runtime)
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
            return res;
          })
          .catch(() => caches.match("/index.html")) // fallback
      );
    })
  );
});
