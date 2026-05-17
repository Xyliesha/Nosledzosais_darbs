var currentUser = null;
var currentLang = localStorage.getItem("lang") || "en";
var adminMovies = [];
var defaultGenres = [
  { id: 1, name_en: "Action", name_lv: "Spriedze" },
  { id: 2, name_en: "Horror", name_lv: "Sausmu" },
  { id: 3, name_en: "Comedy", name_lv: "Komedija" },
  { id: 4, name_en: "Drama", name_lv: "Drama" },
  { id: 5, name_en: "Science Fiction", name_lv: "Zinatniska fantastika" },
  { id: 6, name_en: "Family Adventure", name_lv: "Gimenes piedzivojums" },
  { id: 7, name_en: "Animation", name_lv: "Animacija" },
  { id: 8, name_en: "Fantasy", name_lv: "Fantazija" },
  { id: 9, name_en: "Romance", name_lv: "Romantika" },
  { id: 10, name_en: "Thriller", name_lv: "Trilleris" },
  { id: 11, name_en: "Crime", name_lv: "Kriminalfilma" },
  { id: 12, name_en: "Documentary", name_lv: "Dokumentala filma" },
];

var words = {
  en: {
    movies: "Movies",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    admin: "Admin",
    menu: "Menu",
    language: "Language",
    hero_label: "Kino Programma",
    hero_description:
      "Browse movies, choose sessions and reserve cinema tickets.",
    browse_movies: "Browse Movies",
    movie_title_placeholder: "Example: Project Hail Mary",
    description_en_placeholder: "Write a short movie description in English.",
    description_lv_placeholder: "Write a short movie description in Latvian.",
    duration_placeholder: "Example: 120",
    poster_placeholder: "images/project_hail_mary.jpg",
    age_placeholder: "Example: 7+, 12+, 16+, 18+",
    audio_language_placeholder: "Example: English",
    subtitle_language_placeholder: "Example: Latvian, Russian",
    price_placeholder: "Example: 7.50",
    no_account: "If you do not have an account, you can",
    create_account: "create one",
    welcome: "Browse movies, choose a session, and reserve cinema tickets.",
    search: "Search",
    genre: "Genre",
    all_genres: "All genres",
    details: "View Details",
    sessions: "Sessions",
    news: "News",
    gifts: "Gifts",
    events: "Events",
    cinema_hours:
      "The cinema opens 15 minutes before the first session and closes 15 minutes after the last session starts.",
    reserve: "Reserve",
    tickets: "Tickets",
    seats_available: "Seats available",
    seats_limit_error:
      "The selected number of tickets exceeds the number of seats in the hall.",
    email: "Email",
    password: "Password",
    name: "Name",
    history: "Reservation history",
    my_reservations: "My reservations",
    admin_panel: "Admin panel",
    movie_management: "Movie management",
    session_management: "Session management",
    reservation_management: "Reservation management",
    total_users: "Total users",
    total_reservations: "Total reservations",
    popular_movie: "Most popular movie",
    title: "Title",
    movie_title: "Movie title",
    description_en: "Description in English",
    description_lv: "Description in Latvian",
    poster_help:
      "Put the poster file in the images folder and type its path here.",
    session_movie: "Movie for this session",
    session_datetime: "Session date and time",
    duration: "Duration",
    age: "Age restriction",
    minutes: "minutes",
    description: "Description",
    date: "Date",
    hall: "Hall",
    audio_language: "Audio language",
    subtitle_language: "Subtitles",
    price: "Price",
    status: "Status",
    customer: "Customer",
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    actions: "Actions",
    poster: "Poster path",
    seats: "Seats",
    add_session: "Add session",
    no_movies: "No movies found.",
    invalid_login: "Invalid email or password.",
    email_not_found: "No account with this email was found.",
    wrong_password: "Password is not correct.",
    invalid_data: "Please enter valid data.",
    email_exists: "Email already exists.",
    success_register: "Registration successful. You can login now.",
    login_required: "Please login first.",
    access_denied: "Access denied.",
    reserved: "Reservation saved.",
    not_enough_seats: "Not enough free seats for this session.",
    reservation_failed: "Could not save the reservation. Please try again.",
    invalid_session_data: "Please enter valid session data.",
    invalid_movie_data: "Please enter valid movie data.",
    invalid_reservation_data: "Please enter valid reservation data.",
    session_not_found: "Session was not found.",
    reservation_not_found: "Reservation was not found.",
    no_reservations: "No reservations yet.",
    status_updated: "Reservation status updated.",
    saved: "Saved in database.",
  },
  lv: {
    movies: "Filmas",
    login: "Pieslēgties",
    register: "Reģistrēties",
    logout: "Iziet",
    profile: "Profils",
    admin: "Administrācija",
    menu: "Izvēlne",
    language: "Valoda",
    hero_label: "Kino programma",
    hero_description:
      "Parluko filmas, izvelies seansus un rezerve kino biletes.",
    browse_movies: "Skatit filmas",
    movie_title_placeholder: "Piemers: Projekts Hail Mary",
    description_en_placeholder: "Uzraksti isu filmas aprakstu angliski.",
    description_lv_placeholder: "Uzraksti isu filmas aprakstu latviski.",
    duration_placeholder: "Piemers: 120",
    poster_placeholder: "images/project_hail_mary.jpg",
    age_placeholder: "Piemers: 7+, 12+, 16+, 18+",
    audio_language_placeholder: "Piemers: anglu",
    subtitle_language_placeholder: "Piemers: latviesu, krievu",
    price_placeholder: "Piemers: 7.50",
    no_account: "Ja tev nav konta, vari",
    create_account: "izveidot kontu",
    welcome: "Pārlūko filmas, izvēlies seansu un rezervē kino biļetes.",
    search: "Meklēt",
    genre: "Žanrs",
    all_genres: "Visi žanri",
    details: "Skatīt detaļas",
    sessions: "Seansi",
    news: "Jaunumi",
    gifts: "Dāvanas",
    events: "Pasākumi",
    cinema_hours:
      "Kinoteātris tiek atvērts 15 minūtes pirms pirmā seansa sākuma un tiek slēgts 15 minūtes pēc pēdējā seansa sākuma.",
    reserve: "Rezervēt",
    tickets: "Biļetes",
    seats_available: "Brīvas vietas",
    seats_limit_error: "Izveletais bilešu skaits parsniedz vietu skaitu zale.",
    email: "E-pasts",
    password: "Parole",
    name: "Vārds",
    history: "Rezervāciju vēsture",
    my_reservations: "Manas rezervācijas",
    admin_panel: "Administrācijas panelis",
    movie_management: "Filmu pārvaldība",
    session_management: "Seansu pārvaldība",
    reservation_management: "Rezervāciju pārvaldība",
    total_users: "Lietotāji kopā",
    total_reservations: "Rezervācijas kopā",
    popular_movie: "Populārākā filma",
    title: "Nosaukums",
    movie_title: "Filmas nosaukums",
    description_en: "Apraksts angliski",
    description_lv: "Apraksts latviski",
    poster_help: "Ievieto plakāta failu images mapē un ieraksti ceļu šeit.",
    session_movie: "Filma šim seansam",
    session_datetime: "Seansa datums un laiks",
    duration: "Ilgums",
    age: "Vecuma ierobežojums",
    minutes: "minūtes",
    description: "Apraksts",
    date: "Datums",
    hall: "Zāle",
    audio_language: "Audio valoda",
    subtitle_language: "Subtitri",
    price: "Cena",
    status: "Statuss",
    customer: "Klients",
    pending: "Gaida",
    paid: "Apmaksāts",
    cancelled: "Atcelts",
    cancel: "Atcelt",
    save: "Saglabāt",
    delete: "Dzēst",
    edit: "Labot",
    actions: "Darbības",
    poster: "Plakāta ceļš",
    seats: "Vietas",
    add_session: "Pievienot seansu",
    no_movies: "Filmas nav atrastas.",
    invalid_login: "Nepareizs e-pasts vai parole.",
    email_not_found: "Konts ar šo e-pastu nav atrasts.",
    wrong_password: "Parole nav pareiza.",
    invalid_data: "Ievadi derīgus datus.",
    email_exists: "E-pasts jau eksistē.",
    success_register: "Reģistrācija veiksmīga. Tagad vari pieslēgties.",
    login_required: "Vispirms pieslēdzies.",
    access_denied: "Piekļuve liegta.",
    reserved: "Rezervācija saglabāta.",
    not_enough_seats: "Šim seansam nav pietiekami brīvu vietu.",
    reservation_failed: "Neizdevās saglabāt rezervāciju. Mēģini vēlreiz.",
    invalid_session_data: "Ievadi derīgus seansa datus.",
    invalid_movie_data: "Ievadi derīgus filmas datus.",
    invalid_reservation_data: "Ievadi derīgus rezervācijas datus.",
    session_not_found: "Seanss nav atrasts.",
    reservation_not_found: "Rezervācija nav atrasta.",
    no_reservations: "Rezervāciju vēl nav.",
    status_updated: "Rezervācijas statuss atjaunināts.",
    saved: "Saglabāts datubāzē.",
  },
};

document.addEventListener("DOMContentLoaded", function () {
  translatePage();
  checkLogin();
  startPage();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("js/sw.js");
  }
});

function text(key) {
  return words[currentLang][key] || key;
}

function messageText(key, data) {
  if (!key) {
    return text("invalid_data");
  }

  if (key == "not_enough_seats" && data && data.available !== undefined) {
    return (
      text(key) + " " + text("seats_available") + ": " + data.available + "."
    );
  }

  return text(key);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  translatePage();
  startPage();
}

function translatePage() {
  document.documentElement.lang = currentLang;

  var items = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < items.length; i++) {
    var key = items[i].getAttribute("data-i18n");
    items[i].textContent = text(key);
  }

  var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  for (var j = 0; j < placeholders.length; j++) {
    var placeholderKey = placeholders[j].getAttribute("data-i18n-placeholder");
    placeholders[j].placeholder = text(placeholderKey);
  }

  var searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.placeholder =
      currentLang == "lv" ? "Meklēt pēc nosaukuma" : "Search by title";
  }

  var genreSelect = document.getElementById("genreSelect");
  if (genreSelect) {
    renderGenreOptions(genreSelect, defaultGenres, genreSelect.value, true);
  }
}

function api(action, formData) {
  var options = {};

  if (formData) {
    formData.append("action", action);
    options.method = "POST";
    options.body = formData;
    return fetch("api.php", options).then(function (response) {
      return response.json();
    });
  }

  return fetch("api.php?action=" + action).then(function (response) {
    return response.json();
  });
}

function checkLogin() {
  api("me").then(function (data) {
    currentUser = data.user;
    updateMenu();
  });
}

function updateMenu() {
  var guestLinks = document.querySelectorAll(".guest-link");
  var userLinks = document.querySelectorAll(".user-link");
  var adminLinks = document.querySelectorAll(".admin-link");

  for (var i = 0; i < guestLinks.length; i++) {
    guestLinks[i].style.display = currentUser ? "none" : "";
  }

  for (var j = 0; j < userLinks.length; j++) {
    userLinks[j].style.display = currentUser ? "" : "none";
  }

  for (var k = 0; k < adminLinks.length; k++) {
    adminLinks[k].style.display =
      currentUser && currentUser.role == "admin" ? "" : "none";
  }

  var logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.onclick = function (event) {
      event.preventDefault();
      api("logout").then(function () {
        window.location.href = "index.html";
      });
    };
  }
}

function toggleMenu() {
  var menu = document.getElementById("menuDropdown");
  if (menu) {
    menu.classList.toggle("is-open");
  }
}

function startPage() {
  var page = location.pathname.split("/").pop();

  if (page == "" || page == "index.html") {
    loadHomePage();
  }
  if (page == "movie.html") {
    loadMoviePage();
  }
  if (page == "login.html") {
    setupLogin();
  }
  if (page == "register.html") {
    setupRegister();
  }
  if (page == "profile.html") {
    loadProfilePage();
  }
  if (page == "admin.html") {
    loadAdminPage();
  }
}

function loadHomePage() {
  loadGenres();
  loadMovies();

  var form = document.getElementById("searchForm");
  if (form) {
    form.onsubmit = function (event) {
      event.preventDefault();
      loadMovies();
    };
  }
}

function loadGenres() {
  var select = document.getElementById("genreSelect");
  if (!select) {
    return;
  }

  renderGenreOptions(select, defaultGenres, select.value, true);

  api("genres").then(function (data) {
    var genres =
      data.genres && data.genres.length ? data.genres : defaultGenres;

    renderGenreOptions(select, genres, select.value, true);
  });
}

function renderGenreOptions(select, genres, selectedValue, showAllOption) {
  select.innerHTML = "";

  if (showAllOption) {
    select.innerHTML = '<option value="0">' + text("all_genres") + "</option>";
  }

  for (var i = 0; i < genres.length; i++) {
    var genre = genres[i];
    var name = currentLang == "lv" ? genre.name_lv : genre.name_en;
    select.innerHTML +=
      '<option value="' + genre.id + '">' + escapeHtml(name) + "</option>";
  }

  if (selectedValue) {
    select.value = selectedValue;
  }
}

function loadMovies() {
  var list = document.getElementById("movieList");
  if (!list) {
    return;
  }

  var search = document.getElementById("searchInput").value;
  var genre = document.getElementById("genreSelect").value;
  var url =
    "api.php?action=movies&search=" +
    encodeURIComponent(search) +
    "&genre=" +
    encodeURIComponent(genre);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      list.innerHTML = "";

      if (data.movies.length == 0) {
        list.innerHTML = "<p>" + text("no_movies") + "</p>";
      }

      for (var i = 0; i < data.movies.length; i++) {
        var movie = data.movies[i];
        var genreName = currentLang == "lv" ? movie.name_lv : movie.name_en;
        var description =
          currentLang == "lv" ? movie.description_lv : movie.description_en;

        list.innerHTML +=
          '<article class="movie-card">' +
          '<img class="movie-poster" src="' +
          escapeHtml(movie.poster) +
          '" alt="' +
          escapeHtml(movie.title) +
          ' poster">' +
          '<div class="movie-body">' +
          '<p class="tag">' +
          escapeHtml(genreName) +
          "</p>" +
          "<h2>" +
          escapeHtml(movie.title) +
          "</h2>" +
          '<div class="movie-meta">' +
          "<span>" +
          movie.duration +
          " " +
          text("minutes") +
          "</span>" +
          "<span>" +
          escapeHtml(movie.age_restriction) +
          "</span>" +
          "</div>" +
          "<p>" +
          escapeHtml(description.substring(0, 110)) +
          "...</p>" +
          '<a class="button" href="movie.html?id=' +
          movie.id +
          '">' +
          text("details") +
          "</a>" +
          "</div>" +
          "</article>";
      }
    });
}

function loadMoviePage() {
  var id = new URLSearchParams(location.search).get("id");
  var details = document.getElementById("movieDetails");
  var sessions = document.getElementById("sessionList");

  fetch("api.php?action=movie&id=" + encodeURIComponent(id))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.movie) {
        details.innerHTML = "<p>" + text("no_movies") + "</p>";
        return;
      }

      var movie = data.movie;
      var genreName = currentLang == "lv" ? movie.name_lv : movie.name_en;
      var description =
        currentLang == "lv" ? movie.description_lv : movie.description_en;

      details.innerHTML =
        '<section class="detail-layout">' +
        '<img class="detail-poster" src="' +
        escapeHtml(movie.poster) +
        '" alt="' +
        escapeHtml(movie.title) +
        ' poster">' +
        '<article class="detail">' +
        '<p class="tag">' +
        escapeHtml(genreName) +
        "</p>" +
        "<h1>" +
        escapeHtml(movie.title) +
        "</h1>" +
        "<p><strong>" +
        text("duration") +
        ":</strong> " +
        movie.duration +
        " " +
        text("minutes") +
        "</p>" +
        "<p><strong>" +
        text("age") +
        ":</strong> " +
        escapeHtml(movie.age_restriction) +
        "</p>" +
        "<p><strong>" +
        text("description") +
        ":</strong> " +
        escapeHtml(description) +
        "</p>" +
        "</article>" +
        "</section>";

      sessions.innerHTML = "";
      for (var i = 0; i < data.sessions.length; i++) {
        var session = data.sessions[i];
        var seatsAvailable = Number(
          session.seats_available || session.seats_total || 0,
        );
        var buttonsDisabled = seatsAvailable < 1 ? " disabled" : "";
        sessions.innerHTML +=
          '<div class="session-row">' +
          "<div>" +
          "<strong>" +
          formatDate(session.show_time) +
          "</strong>" +
          "<p>" +
          text("hall") +
          ": " +
          escapeHtml(session.hall) +
          " | " +
          text("price") +
          ": EUR " +
          session.price +
          "</p>" +
          '<p class="session-language">' +
          '<span class="language-item">' +
          '<img class="language-icon" src="images/icons/audio.svg" alt="" aria-hidden="true">' +
          escapeHtml(session.audio_language || "-") +
          "</span>" +
          '<span class="language-item">' +
          '<img class="language-icon" src="images/icons/subtitles.svg" alt="" aria-hidden="true">' +
          escapeHtml(session.subtitle_language || "-") +
          "</span>" +
          "</p>" +
          "<p>" +
          text("seats_available") +
          ": " +
          seatsAvailable +
          "</p>" +
          "<label>" +
          text("tickets") +
          '<input type="number" min="1" max="' +
          seatsAvailable +
          '" value="' +
          (seatsAvailable > 0 ? "1" : "0") +
          '" id="tickets-' +
          session.id +
          '" oninput="checkTicketLimit(this)"' +
          buttonsDisabled +
          "></label>" +
          "</div>" +
          '<div class="actions">' +
          '<button onclick="reserveTickets(' +
          session.id +
          ')"' +
          buttonsDisabled +
          ">" +
          text("reserve") +
          "</button>" +
          "</div>" +
          "</div>";
      }
    });
}

function checkTicketLimit(input) {
  var ticketCount = Number(input.value);
  var maxTickets = Number(input.max);

  if (ticketCount > maxTickets) {
    showMessage(text("seats_limit_error"), true);
    input.value = maxTickets;
  }
}

function reserveTickets(sessionId) {
  if (!currentUser) {
    showMessage(text("login_required"), true);
    setTimeout(function () {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  var ticketInput = document.getElementById("tickets-" + sessionId);
  var ticketCount = Number(ticketInput.value);
  var maxTickets = Number(ticketInput.max);

  if (ticketCount > maxTickets) {
    showMessage(text("seats_limit_error"), true);
    ticketInput.value = maxTickets;
    return;
  }

  if (ticketCount < 1) {
    showMessage(text("invalid_data"), true);
    ticketInput.value = 1;
    return;
  }

  var formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("tickets", ticketCount);

  api("reserve", formData).then(function (data) {
    if (data.success) {
      showMessage(text("reserved"), false);
      setTimeout(function () {
        window.location.href = "profile.html";
      }, 700);
    } else {
      showMessage(messageText(data.message, data), true);
    }
  });
}

function setupLogin() {
  var form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    api("login", new FormData(form)).then(function (data) {
      if (data.success) {
        window.location.href = "profile.html";
      } else {
        showMessage(messageText(data.message), true);
      }
    });
  };
}

function setupRegister() {
  var form = document.getElementById("registerForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    api("register", new FormData(form)).then(function (data) {
      if (data.success) {
        showMessage(text("success_register"), false);
        form.reset();
      } else {
        showMessage(messageText(data.message), true);
      }
    });
  };
}

function loadProfilePage() {
  api("me").then(function (data) {
    if (!data.user) {
      window.location.href = "login.html";
      return;
    }

    currentUser = data.user;
    updateMenu();

    document.getElementById("profileInfo").innerHTML =
      "<p>" +
      text("name") +
      ": " +
      escapeHtml(data.user.name) +
      "</p>" +
      "<p>" +
      text("email") +
      ": " +
      escapeHtml(data.user.email) +
      "</p>";
  });

  api("reservations").then(function (data) {
    var list = document.getElementById("reservationList");
    if (!data.success) {
      return;
    }

    list.innerHTML = "";
    if (data.reservations.length == 0) {
      list.innerHTML = '<p class="empty">' + text("no_reservations") + "</p>";
      return;
    }

    for (var i = 0; i < data.reservations.length; i++) {
      var item = data.reservations[i];
      list.innerHTML +=
        '<article class="reservation">' +
        "<h3>" +
        escapeHtml(item.title) +
        "</h3>" +
        "<p>" +
        text("date") +
        ": " +
        formatDate(item.show_time) +
        "</p>" +
        "<p>" +
        text("tickets") +
        ": " +
        item.tickets +
        " | " +
        text("price") +
        ": EUR " +
        item.total_price +
        "</p>" +
        "<p>" +
        text("status") +
        ": " +
        statusLabel(item.status) +
        "</p>" +
        '<button class="danger" onclick="cancelReservation(' +
        item.id +
        ')">' +
        text("cancel") +
        "</button>" +
        "</article>";
    }
  });
}

function cancelReservation(id) {
  var formData = new FormData();
  formData.append("id", id);

  api("cancel_reservation", formData).then(function () {
    loadProfilePage();
  });
}

function loadAdminPage() {
  api("admin_data").then(function (data) {
    if (!data.success) {
      window.location.href = "index.html";
      return;
    }

    var adminContent = document.getElementById("adminContent");
    if (adminContent) {
      adminContent.style.display = "";
    }

    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("totalReservations").textContent =
      data.totalReservations;
    document.getElementById("popularMovie").textContent = data.popularMovie;

    fillAdminSelects(data);
    fillMovieTable(data.movies);
    fillSessionTable(data.sessions);
    fillReservationTable(data.reservations);
  });

  var movieForm = document.getElementById("movieForm");
  movieForm.onsubmit = function (event) {
    event.preventDefault();
    api("save_movie", new FormData(movieForm)).then(function (data) {
      if (data.success) {
        showMessage(text("saved"), false);
        movieForm.reset();
        document.getElementById("movieId").value = 0;
        document.getElementById("duration").value = "";
        document.getElementById("ageRestriction").value = "";
        document.getElementById("poster").value = "";
        loadAdminPage();
      } else {
        showMessage(messageText(data.message), true);
      }
    });
  };

  var sessionForm = document.getElementById("sessionForm");
  sessionForm.onsubmit = function (event) {
    event.preventDefault();
    api("add_session", new FormData(sessionForm)).then(function (data) {
      if (data.success) {
        showMessage(text("saved"), false);
        sessionForm.reset();
        loadAdminPage();
      } else {
        showMessage(messageText(data.message), true);
      }
    });
  };
}

function fillAdminSelects(data) {
  var movieGenre = document.getElementById("movieGenre");
  var sessionMovie = document.getElementById("sessionMovie");
  var sessionHall = document.getElementById("sessionHall");
  var genres = data.genres && data.genres.length ? data.genres : defaultGenres;

  renderGenreOptions(movieGenre, genres, movieGenre.value, false);

  sessionMovie.innerHTML = "";
  for (var j = 0; j < data.movies.length; j++) {
    sessionMovie.innerHTML +=
      '<option value="' +
      data.movies[j].id +
      '">' +
      escapeHtml(data.movies[j].title) +
      "</option>";
  }

  sessionHall.innerHTML = "";
  for (var k = 0; k < data.halls.length; k++) {
    sessionHall.innerHTML +=
      '<option value="' +
      data.halls[k].id +
      '">' +
      escapeHtml(data.halls[k].name) +
      " (" +
      data.halls[k].seats_total +
      " " +
      text("seats") +
      ")</option>";
  }
}

function fillMovieTable(movies) {
  var table = document.getElementById("movieTable");
  adminMovies = movies;
  table.innerHTML = "";

  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" +
      escapeHtml(movie.title) +
      "</td>" +
      "<td>" +
      escapeHtml(currentLang == "lv" ? movie.name_lv : movie.name_en) +
      "</td>" +
      "<td>" +
      movie.duration +
      "</td>" +
      "<td>" +
      escapeHtml(movie.age_restriction) +
      "</td>" +
      '<td class="actions">' +
      '<button class="secondary" onclick="editMovie(' +
      movie.id +
      ')">' +
      text("edit") +
      "</button>" +
      '<button class="danger" onclick="deleteMovie(' +
      movie.id +
      ')">' +
      text("delete") +
      "</button>" +
      "</td>" +
      "</tr>";
  }
}

function editMovie(id) {
  var movie = null;

  for (var i = 0; i < adminMovies.length; i++) {
    if (adminMovies[i].id == id) {
      movie = adminMovies[i];
    }
  }

  if (!movie) {
    return;
  }

  document.getElementById("movieId").value = movie.id;
  document.getElementById("movieTitle").value = movie.title;
  document.getElementById("movieGenre").value = movie.genre_id;
  document.getElementById("descriptionEn").value = movie.description_en;
  document.getElementById("descriptionLv").value = movie.description_lv;
  document.getElementById("duration").value = movie.duration;
  document.getElementById("ageRestriction").value = movie.age_restriction;
  document.getElementById("poster").value = movie.poster;
}

function deleteMovie(id) {
  var formData = new FormData();
  formData.append("id", id);

  api("delete_movie", formData).then(function () {
    loadAdminPage();
  });
}

function fillSessionTable(sessions) {
  var table = document.getElementById("sessionTable");
  table.innerHTML = "";

  for (var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" +
      escapeHtml(session.title) +
      "</td>" +
      "<td>" +
      formatDate(session.show_time) +
      "</td>" +
      "<td>" +
      escapeHtml(session.hall) +
      " (" +
      session.seats_total +
      " " +
      text("seats") +
      ")" +
      "</td>" +
      "<td>" +
      escapeHtml(session.audio_language || "-") +
      "</td>" +
      "<td>" +
      escapeHtml(session.subtitle_language || "-") +
      "</td>" +
      '<td><button class="danger" onclick="deleteSession(' +
      session.id +
      ')">' +
      text("delete") +
      "</button></td>" +
      "</tr>";
  }
}

function deleteSession(id) {
  var formData = new FormData();
  formData.append("id", id);

  api("delete_session", formData).then(function () {
    loadAdminPage();
  });
}

function fillReservationTable(reservations) {
  var table = document.getElementById("adminReservationTable");
  if (!table) {
    return;
  }

  table.innerHTML = "";
  if (reservations.length == 0) {
    table.innerHTML =
      '<tr><td colspan="7">' + text("no_reservations") + "</td></tr>";
    return;
  }

  for (var i = 0; i < reservations.length; i++) {
    var item = reservations[i];
    table.innerHTML +=
      "<tr>" +
      "<td>" +
      escapeHtml(item.name) +
      "<br><small>" +
      escapeHtml(item.email) +
      "</small></td>" +
      "<td>" +
      escapeHtml(item.title) +
      "</td>" +
      "<td>" +
      formatDate(item.show_time) +
      "</td>" +
      "<td>" +
      item.tickets +
      "</td>" +
      "<td>EUR " +
      item.total_price +
      "</td>" +
      '<td><select onchange="updateReservationStatus(' +
      item.id +
      ', this.value)">' +
      statusOption("pending", item.status) +
      statusOption("paid", item.status) +
      statusOption("cancelled", item.status) +
      "</select></td>" +
      '<td><button class="danger" onclick="deleteReservation(' +
      item.id +
      ')">' +
      text("delete") +
      "</button></td>" +
      "</tr>";
  }
}

function statusOption(value, current) {
  return (
    '<option value="' +
    value +
    '"' +
    (value == current ? " selected" : "") +
    ">" +
    statusLabel(value) +
    "</option>"
  );
}

function updateReservationStatus(id, status) {
  var formData = new FormData();
  formData.append("id", id);
  formData.append("status", status);

  api("update_reservation_status", formData).then(function (data) {
    if (data.success) {
      showMessage(text("status_updated"), false);
      loadAdminPage();
    } else {
      showMessage(messageText(data.message), true);
    }
  });
}

function deleteReservation(id) {
  var formData = new FormData();
  formData.append("id", id);

  api("delete_reservation", formData).then(function (data) {
    if (data.success) {
      loadAdminPage();
    } else {
      showMessage(messageText(data.message), true);
    }
  });
}

function showMessage(message, isError) {
  var item = document.getElementById("message");
  if (!item) {
    item = document.createElement("p");
    item.id = "message";
    var container = document.querySelector(".container") || document.body;
    container.insertBefore(item, container.firstChild);
  }

  item.textContent = message;
  item.className = (isError ? "error" : "notice") + " page-message";
  item.setAttribute("role", "status");
  item.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function formatDate(value) {
  return value.replace("T", " ").substring(0, 16);
}

function statusLabel(status) {
  return escapeHtml(text(status));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
