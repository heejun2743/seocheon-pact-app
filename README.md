

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="description" content="4인 전용 채팅·사진첩·공지 커뮤니티 앱 서천결의" />
    <link rel="manifest" href="/seocheon-pact-app/manifest.json" />
    <link rel="apple-touch-icon" href="/seocheon-pact-app/icons/icon-192.png" />
    <title>서천결의</title>
    <script type="module" crossorigin src="/seocheon-pact-app/assets/index-CYD4VvIB.js"></script>
    <link rel="stylesheet" crossorigin href="/seocheon-pact-app/assets/index-D-679e_G.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

{
  "name": "서천결의",
  "short_name": "서천결의",
  "description": "4인 전용 채팅·사진첩·공지 커뮤니티 앱",
  "start_url": "/seocheon-pact-app/",
  "scope": "/seocheon-pact-app/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/seocheon-pact-app/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/seocheon-pact-app/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
const CACHE_NAME = "seocheon-pact-v1";
const ASSETS = ["/", "/index.html", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
