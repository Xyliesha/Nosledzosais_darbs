var currentUser = null;
var currentLang = localStorage.getItem("lang") || "en";
var adminMovies = [];

var words = {
  en: {
    movies: "Movies",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    admin: "Admin",
    language: "Language",
    welcome: "Browse movies, choose a session, and reserve cinema tickets.",
    search: "Search",
    genre: "Genre",
    all_genres: "All genres",
    details: "View Details",
    sessions: "Sessions",
    reserve: "Reserve",
    tickets: "Tickets",
    fake_payment: "Fake payment confirmation",
    email: "Email",
    password: "Password",
    name: "Name",
    history: "Reservation history",
    admin_panel: "Admin panel",
    movie_management: "Movie management",
    session_management: "Session management",
    total_users: "Total users",
    total_reservations: "Total reservations",
    popular_movie: "Most popular movie",
    title: "Title",
    movie_title: "Movie title",
    description_en: "Description in English",
    description_lv: "Description in Latvian",
    poster_help: "Put the poster file in the images folder and type its path here.",
    session_movie: "Movie for this session",
    session_datetime: "Session date and time",
    duration: "Duration",
    age: "Age restriction",
    minutes: "minutes",
    description: "Description",
    date: "Date",
    hall: "Hall",
    price: "Price",
    status: "Status",
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
    invalid_data: "Please enter valid data.",
    email_exists: "Email already exists.",
    success_register: "Registration successful. You can login now.",
    login_required: "Please login first.",
    access_denied: "Access denied.",
    reserved: "Reservation saved.",
    saved: "Saved.",
  },
  lv: {
    movies: "Filmas",
    login: "Pieslēgties",
    register: "Reģistrēties",
    logout: "Iziet",
    profile: "Profils",
    admin: "Administrācija",
    language: "Valoda",
    welcome: "Pārlūko filmas, izvēlies seansu un rezervē kino biļetes.",
    search: "Meklēt",
    genre: "Žanrs",
    all_genres: "Visi žanri",
    details: "Skatīt detaļas",
    sessions: "Seansi",
    reserve: "Rezervēt",
    tickets: "Biļetes",
    fake_payment: "Viltus maksājuma apstiprinājums",
    email: "E-pasts",
    password: "Parole",
    name: "Vārds",
    history: "Rezervāciju vēsture",
    admin_panel: "Administrācijas panelis",
    movie_management: "Filmu pārvaldība",
    session_management: "Seansu pārvaldība",
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
    price: "Cena",
    status: "Statuss",
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
    invalid_data: "Ievadi derīgus datus.",
    email_exists: "E-pasts jau eksistē.",
    success_register: "Reģistrācija veiksmīga. Tagad vari pieslēgties.",
    login_required: "Vispirms pieslēdzies.",
    access_denied: "Piekļuve liegta.",
    reserved: "Rezervācija saglabāta.",
    saved: "Saglabāts.",
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

  var searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.placeholder =
      currentLang == "lv" ? "Meklēt pēc nosaukuma" : "Search by title";
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

  api("genres").then(function (data) {
    select.innerHTML = '<option value="0">' + text("all_genres") + "</option>";

    for (var i = 0; i < data.genres.length; i++) {
      var genre = data.genres[i];
      var name = currentLang == "lv" ? genre.name_lv : genre.name_en;
      select.innerHTML +=
        '<option value="' + genre.id + '">' + escapeHtml(name) + "</option>";
    }
  });
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
          "<label>" +
          text("tickets") +
          '<input type="number" min="1" max="10" value="1" id="tickets-' +
          session.id +
          '"></label>' +
          "</div>" +
          '<div class="actions">' +
          '<button onclick="reserveTickets(' +
          session.id +
          ', false)">' +
          text("reserve") +
          "</button>" +
          '<button class="secondary" onclick="reserveTickets(' +
          session.id +
          ', true)">' +
          text("fake_payment") +
          "</button>" +
          "</div>" +
          "</div>";
      }
    });
}

function reserveTickets(sessionId, pay) {
  if (!currentUser) {
    alert(text("login_required"));
    window.location.href = "login.html";
    return;
  }

  var formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append(
    "tickets",
    document.getElementById("tickets-" + sessionId).value,
  );

  if (pay) {
    formData.append("pay", "1");
  }

  api("reserve", formData).then(function (data) {
    if (data.success) {
      alert(text("reserved"));
      window.location.href = "profile.html";
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
        showMessage(text("invalid_login"), true);
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
      } else if (data.message == "email_exists") {
        showMessage(text("email_exists"), true);
      } else {
        showMessage(text("invalid_data"), true);
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
        escapeHtml(item.status) +
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
      alert(text("access_denied"));
      window.location.href = "index.html";
      return;
    }

        document.getElementById("totalUsers").textContent = data.totalUsers;
        document.getElementById("totalReservations").textContent = data.totalReservations;
        document.getElementById("popularMovie").textContent = data.popularMovie;

    fillAdminSelects(data);
    fillMovieTable(data.movies);
    fillSessionTable(data.sessions);
  });

  var movieForm = document.getElementById("movieForm");
  movieForm.onsubmit = function (event) {
    event.preventDefault();
    api("save_movie", new FormData(movieForm)).then(function () {
      movieForm.reset();
      document.getElementById("movieId").value = 0;
      loadAdminPage();
    });
  };

  var sessionForm = document.getElementById("sessionForm");
  sessionForm.onsubmit = function (event) {
    event.preventDefault();
    api("add_session", new FormData(sessionForm)).then(function () {
      sessionForm.reset();
      loadAdminPage();
    });
  };
}

function fillAdminSelects(data) {
  var movieGenre = document.getElementById("movieGenre");
  var sessionMovie = document.getElementById("sessionMovie");

  movieGenre.innerHTML = "";
  for (var i = 0; i < data.genres.length; i++) {
    movieGenre.innerHTML +=
      '<option value="' +
      data.genres[i].id +
      '">' +
      escapeHtml(data.genres[i].name_en) +
      "</option>";
  }

  sessionMovie.innerHTML = "";
  for (var j = 0; j < data.movies.length; j++) {
    sessionMovie.innerHTML +=
      '<option value="' +
      data.movies[j].id +
      '">' +
      escapeHtml(data.movies[j].title) +
      "</option>";
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
      escapeHtml(movie.name_en) +
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

function showMessage(message, isError) {
  var item = document.getElementById("message");
  item.textContent = message;
  item.className = isError ? "error" : "notice";
}

function formatDate(value) {
  return value.replace("T", " ").substring(0, 16);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
