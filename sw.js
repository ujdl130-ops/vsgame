const CACHE_NAME = "the-last-prayer-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./js/core.js",
  "./js/save.js",
  "./js/stage.js",
  "./js/player.js",
  "./js/audio.js",
  "./js/poseidonSkillAnimation.js",
  "./js/hero.js",
  "./js/soldier.js",
  "./js/currency.js",
  "./js/projectile.js",
  "./js/unit.js",
  "./js/enemy.js",
  "./js/formation.js",
  "./js/prebattleFormation.js",
  "./js/gacha.js",
  "./js/shop.js",
  "./js/mission.js",
  "./js/inventory.js",
  "./js/ui.js",
  "./js/battle.js",
  "./js/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
