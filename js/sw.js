const CACHE_NAME = "kino-programma-v2";
const ASSETS = [
  "../index.html",
  "../movie.html",
  "../login.html",
  "../register.html",
  "../profile.html",
  "../admin.html",
  "../css/style.css",
  "script.js",
  "../manifest.json",
  "../images/icon.svg",
  "../images/Drama.jpg",
  "../images/Hokum.jpg",
  "../images/Hoppers.jpg",
  "../images/Maikl.jpg",
  "../images/Outcome.jpg",
  "../images/Project_Hail_Mary.jpg",
  "../images/Ready_or_not.webp",
  "../images/The_Devil_Wears_Prada_2.webp",
  "../images/woodwalkers_2.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request)),
  );
});
