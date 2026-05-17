CREATE DATABASE IF NOT EXISTS kino_programma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kino_programma;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS halls;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(80) NOT NULL,
    name_lv VARCHAR(80) NOT NULL
);

CREATE TABLE halls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    seats_total INT NOT NULL
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description_en TEXT NOT NULL,
    description_lv TEXT NOT NULL,
    duration INT NOT NULL,
    age_restriction VARCHAR(10) NOT NULL DEFAULT '12+',
    poster VARCHAR(255) NOT NULL,
    trailer_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    hall_id INT NOT NULL,
    show_time DATETIME NOT NULL,
    audio_language VARCHAR(80) NOT NULL,
    subtitle_language VARCHAR(120) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE RESTRICT
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    tickets INT NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    status ENUM('paid', 'failed') NOT NULL DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@kino.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Test User', 'user@kino.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO halls (name, seats_total) VALUES
('Hall 1', 60),
('Hall 2', 55),
('Hall 3', 45);

INSERT INTO genres (name_en, name_lv) VALUES
('Action', 'Spriedze'),
('Horror', 'Sausmu'),
('Comedy', 'Komedija'),
('Drama', 'Drama'),
('Science Fiction', 'Zinatniska fantastika'),
('Family Adventure', 'Gimenes piedzivojums'),
('Animation', 'Animacija'),
('Fantasy', 'Fantazija'),
('Romance', 'Romantika'),
('Thriller', 'Trilleris'),
('Crime', 'Kriminalfilma'),
('Documentary', 'Dokumentala filma');

CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_genre ON movies(genre_id);
CREATE INDEX idx_sessions_movie ON sessions(movie_id);
CREATE INDEX idx_sessions_hall ON sessions(hall_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_session ON reservations(session_id);
