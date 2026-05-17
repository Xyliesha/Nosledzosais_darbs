<?php
require 'config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

function answer($data) {
    echo json_encode($data);
    exit;
}

function requireUser() {
    if (!isset($_SESSION['user'])) {
        answer(array('success' => false, 'message' => 'login_required'));
    }
}

function requireAdmin() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
        answer(array('success' => false, 'message' => 'access_denied'));
    }
}

if ($action == 'genres') {
    $genres = $pdo->query('SELECT * FROM genres ORDER BY name_en')->fetchAll();
    answer(array('success' => true, 'genres' => $genres));
}

if ($action == 'movies') {
    $search = trim($_GET['search'] ?? '');
    $genre = (int)($_GET['genre'] ?? 0);

    $sql = "SELECT movies.*, genres.name_en, genres.name_lv
            FROM movies
            JOIN genres ON movies.genre_id = genres.id
            WHERE 1";
    $params = array();

    if ($search != '') {
        $sql .= " AND movies.title LIKE ?";
        $params[] = '%' . $search . '%';
    }

    if ($genre > 0) {
        $sql .= " AND movies.genre_id = ?";
        $params[] = $genre;
    }

    $sql .= " ORDER BY movies.title";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    answer(array('success' => true, 'movies' => $stmt->fetchAll()));
}

if ($action == 'movie') {
    $id = (int)($_GET['id'] ?? 0);

    $stmt = $pdo->prepare("SELECT movies.*, genres.name_en, genres.name_lv
                           FROM movies
                           JOIN genres ON movies.genre_id = genres.id
                           WHERE movies.id = ?");
    $stmt->execute(array($id));
    $movie = $stmt->fetch();

    $stmt = $pdo->prepare("SELECT sessions.*, halls.name AS hall, halls.seats_total,
                                  GREATEST(halls.seats_total - (
                                      SELECT COALESCE(SUM(reservations.tickets), 0)
                                      FROM reservations
                                      WHERE reservations.session_id = sessions.id
                                      AND reservations.status != 'cancelled'
                                  ), 0) AS seats_available
                           FROM sessions
                           JOIN halls ON sessions.hall_id = halls.id
                           WHERE sessions.movie_id = ?
                           ORDER BY sessions.show_time");
    $stmt->execute(array($id));

    answer(array('success' => true, 'movie' => $movie, 'sessions' => $stmt->fetchAll()));
}

if ($action == 'register') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($name == '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
        answer(array('success' => false, 'message' => 'invalid_data'));
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")');
        $stmt->execute(array($name, $email, password_hash($password, PASSWORD_DEFAULT)));
        answer(array('success' => true));
    } catch (PDOException $e) {
        answer(array('success' => false, 'message' => 'email_exists'));
    }
}

if ($action == 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute(array($email));
    $user = $stmt->fetch();

    if (!$user) {
        answer(array('success' => false, 'message' => 'email_not_found'));
    }

    if (password_verify($password, $user['password'])) {
        $_SESSION['user'] = array(
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        );
        answer(array('success' => true, 'user' => $_SESSION['user']));
    }

    answer(array('success' => false, 'message' => 'wrong_password'));
}

if ($action == 'logout') {
    session_destroy();
    answer(array('success' => true));
}

if ($action == 'me') {
    answer(array('success' => true, 'user' => $_SESSION['user'] ?? null));
}

if ($action == 'reserve') {
    requireUser();

    $sessionId = (int)($_POST['session_id'] ?? 0);
    $tickets = (int)($_POST['tickets'] ?? 1);
    $status = isset($_POST['pay']) ? 'paid' : 'pending';

    if ($tickets < 1) {
        $tickets = 1;
    }
    if ($tickets > 10) {
        $tickets = 10;
    }

    $stmt = $pdo->prepare('SELECT sessions.*, halls.seats_total FROM sessions JOIN halls ON sessions.hall_id = halls.id WHERE sessions.id = ?');
    $stmt->execute(array($sessionId));
    $session = $stmt->fetch();

    if (!$session) {
        answer(array('success' => false, 'message' => 'session_not_found'));
    }

    $stmt = $pdo->prepare("SELECT COALESCE(SUM(tickets), 0) AS taken
                           FROM reservations
                           WHERE session_id = ? AND status != 'cancelled'");
    $stmt->execute(array($sessionId));
    $taken = $stmt->fetch();
    $seatsAvailable = max((int)$session['seats_total'] - (int)$taken['taken'], 0);

    if ($tickets > $seatsAvailable) {
        answer(array('success' => false, 'message' => 'not_enough_seats', 'available' => $seatsAvailable));
    }

    $total = $tickets * $session['price'];

    $stmt = $pdo->prepare('INSERT INTO reservations (user_id, session_id, tickets, total_price, status) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute(array($_SESSION['user']['id'], $sessionId, $tickets, $total, $status));
    $reservationId = $pdo->lastInsertId();

    if ($status == 'paid') {
        $stmt = $pdo->prepare('INSERT INTO payments (reservation_id, amount, status) VALUES (?, ?, "paid")');
        $stmt->execute(array($reservationId, $total));
    }

    answer(array('success' => true));
}

if ($action == 'reservations') {
    requireUser();

    $stmt = $pdo->prepare("SELECT reservations.*, sessions.show_time, halls.name AS hall, movies.title
                           FROM reservations
                           JOIN sessions ON reservations.session_id = sessions.id
                           JOIN halls ON sessions.hall_id = halls.id
                           JOIN movies ON sessions.movie_id = movies.id
                           WHERE reservations.user_id = ?
                           ORDER BY reservations.created_at DESC");
    $stmt->execute(array($_SESSION['user']['id']));

    answer(array('success' => true, 'reservations' => $stmt->fetchAll()));
}

if ($action == 'cancel_reservation') {
    requireUser();

    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare('UPDATE reservations SET status = "cancelled" WHERE id = ? AND user_id = ?');
    $stmt->execute(array($id, $_SESSION['user']['id']));

    answer(array('success' => true));
}

if ($action == 'admin_data') {
    requireAdmin();

    $movies = $pdo->query('SELECT movies.*, genres.name_en, genres.name_lv FROM movies JOIN genres ON movies.genre_id = genres.id ORDER BY movies.title')->fetchAll();
    $genres = $pdo->query('SELECT * FROM genres ORDER BY name_en')->fetchAll();
    $halls = $pdo->query('SELECT * FROM halls ORDER BY name')->fetchAll();
    $sessions = $pdo->query('SELECT sessions.*, halls.name AS hall, halls.seats_total, movies.title FROM sessions JOIN halls ON sessions.hall_id = halls.id JOIN movies ON sessions.movie_id = movies.id ORDER BY sessions.show_time')->fetchAll();
    $reservationList = $pdo->query("SELECT reservations.*, users.name, users.email, sessions.show_time, halls.name AS hall, movies.title
                                    FROM reservations
                                    JOIN users ON reservations.user_id = users.id
                                    JOIN sessions ON reservations.session_id = sessions.id
                                    JOIN halls ON sessions.hall_id = halls.id
                                    JOIN movies ON sessions.movie_id = movies.id
                                    ORDER BY reservations.created_at DESC")->fetchAll();
    $users = $pdo->query('SELECT COUNT(*) AS total FROM users')->fetch();
    $reservations = $pdo->query('SELECT COUNT(*) AS total FROM reservations')->fetch();
    $popular = $pdo->query("SELECT movies.title, COALESCE(SUM(reservations.tickets), 0) AS tickets
                            FROM movies
                            LEFT JOIN sessions ON sessions.movie_id = movies.id
                            LEFT JOIN reservations ON reservations.session_id = sessions.id
                            GROUP BY movies.id
                            ORDER BY tickets DESC
                            LIMIT 1")->fetch();

    answer(array(
        'success' => true,
        'movies' => $movies,
        'genres' => $genres,
        'halls' => $halls,
        'sessions' => $sessions,
        'reservations' => $reservationList,
        'totalUsers' => $users['total'],
        'totalReservations' => $reservations['total'],
        'popularMovie' => $popular ? $popular['title'] : '-'
    ));
}

if ($action == 'update_reservation_status') {
    requireAdmin();

    $id = (int)($_POST['id'] ?? 0);
    $status = trim($_POST['status'] ?? '');
    $allowed = array('pending', 'paid', 'cancelled');

    if ($id < 1 || !in_array($status, $allowed)) {
        answer(array('success' => false, 'message' => 'invalid_reservation_data'));
    }

    $stmt = $pdo->prepare('SELECT * FROM reservations WHERE id = ?');
    $stmt->execute(array($id));
    $reservation = $stmt->fetch();

    if (!$reservation) {
        answer(array('success' => false, 'message' => 'reservation_not_found'));
    }

    if ($status != 'cancelled') {
        $stmt = $pdo->prepare('SELECT sessions.*, halls.seats_total FROM sessions JOIN halls ON sessions.hall_id = halls.id WHERE sessions.id = ?');
        $stmt->execute(array($reservation['session_id']));
        $session = $stmt->fetch();

        $stmt = $pdo->prepare("SELECT COALESCE(SUM(tickets), 0) AS taken
                               FROM reservations
                               WHERE session_id = ? AND id != ? AND status != 'cancelled'");
        $stmt->execute(array($reservation['session_id'], $id));
        $taken = $stmt->fetch();
        $seatsAvailable = max((int)$session['seats_total'] - (int)$taken['taken'], 0);

        if ((int)$reservation['tickets'] > $seatsAvailable) {
            answer(array('success' => false, 'message' => 'not_enough_seats', 'available' => $seatsAvailable));
        }
    }

    $stmt = $pdo->prepare('UPDATE reservations SET status = ? WHERE id = ?');
    $stmt->execute(array($status, $id));

    if ($status == 'paid') {
        $stmt = $pdo->prepare('SELECT id FROM payments WHERE reservation_id = ?');
        $stmt->execute(array($id));
        $payment = $stmt->fetch();

        if (!$payment) {
            $stmt = $pdo->prepare('INSERT INTO payments (reservation_id, amount, status) VALUES (?, ?, "paid")');
            $stmt->execute(array($id, $reservation['total_price']));
        }
    }

    answer(array('success' => true));
}

if ($action == 'delete_reservation') {
    requireAdmin();

    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare('DELETE FROM reservations WHERE id = ?');
    $stmt->execute(array($id));

    answer(array('success' => true));
}

if ($action == 'save_movie') {
    requireAdmin();

    $id = (int)($_POST['id'] ?? 0);
    $genreId = (int)($_POST['genre_id'] ?? 0);
    $title = trim($_POST['title'] ?? '');
    $descriptionEn = trim($_POST['description_en'] ?? '');
    $descriptionLv = trim($_POST['description_lv'] ?? '');
    $duration = (int)($_POST['duration'] ?? 90);
    $ageRestriction = trim($_POST['age_restriction'] ?? '12+');
    $poster = trim($_POST['poster'] ?? '');

    if ($genreId < 1 || $title == '' || $descriptionEn == '' || $descriptionLv == '' || $duration < 1 || $ageRestriction == '' || $poster == '') {
        answer(array('success' => false, 'message' => 'invalid_movie_data'));
    }

    if ($id > 0) {
        $stmt = $pdo->prepare('UPDATE movies SET genre_id = ?, title = ?, description_en = ?, description_lv = ?, duration = ?, age_restriction = ?, poster = ? WHERE id = ?');
        $stmt->execute(array($genreId, $title, $descriptionEn, $descriptionLv, $duration, $ageRestriction, $poster, $id));
    } else {
        $stmt = $pdo->prepare('INSERT INTO movies (genre_id, title, description_en, description_lv, duration, age_restriction, poster) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute(array($genreId, $title, $descriptionEn, $descriptionLv, $duration, $ageRestriction, $poster));
    }

    answer(array('success' => true));
}

if ($action == 'delete_movie') {
    requireAdmin();

    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare('DELETE FROM movies WHERE id = ?');
    $stmt->execute(array($id));

    answer(array('success' => true));
}

if ($action == 'add_session') {
    requireAdmin();

    $movieId = (int)($_POST['movie_id'] ?? 0);
    $hallId = (int)($_POST['hall_id'] ?? 0);
    $showTime = trim($_POST['show_time'] ?? '');
    $audioLanguage = trim($_POST['audio_language'] ?? '');
    $subtitleLanguage = trim($_POST['subtitle_language'] ?? '');
    $price = (float)($_POST['price'] ?? 0);

    if ($movieId < 1 || $hallId < 1 || $showTime == '' || $audioLanguage == '' || $subtitleLanguage == '' || $price < 0) {
        answer(array('success' => false, 'message' => 'invalid_session_data'));
    }

    $stmt = $pdo->prepare('INSERT INTO sessions (movie_id, hall_id, show_time, audio_language, subtitle_language, price) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute(array(
        $movieId,
        $hallId,
        $showTime,
        $audioLanguage,
        $subtitleLanguage,
        $price
    ));

    answer(array('success' => true));
}

if ($action == 'delete_session') {
    requireAdmin();

    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare('DELETE FROM sessions WHERE id = ?');
    $stmt->execute(array($id));

    answer(array('success' => true));
}

answer(array('success' => false, 'message' => 'unknown_action'));
?>
