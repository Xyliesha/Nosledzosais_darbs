const CACHE_NAME = "kino-programma-v3";
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
  "../images/icons/admin.svg",
  "../images/icons/audio.svg",
  "../images/icons/events.svg",
  "../images/icons/gifts.svg",
  "../images/icons/login.svg",
  "../images/icons/logout.svg",
  "../images/icons/menu.svg",
  "../images/icons/movies.svg",
  "../images/icons/news.svg",
  "../images/icons/profile.svg",
  "../images/icons/register.svg",
  "../images/icons/sessions.svg",
  "../images/icons/subtitles.svg",
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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});
