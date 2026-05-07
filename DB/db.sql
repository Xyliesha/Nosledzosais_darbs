CREATE DATABASE IF NOT EXISTS kino_programma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kino_programma;

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS movies;
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

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description_en TEXT NOT NULL,
    description_lv TEXT NOT NULL,
    duration INT NOT NULL,
    age_restriction VARCHAR(10) NOT NULL DEFAULT '12+',
    poster VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    show_time DATETIME NOT NULL,
    hall VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    seats_total INT NOT NULL DEFAULT 60,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
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

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@kino.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Test User', 'user@kino.test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO genres (name_en, name_lv) VALUES
('Action', 'Spriedze'),
('Horror', 'Sausmu'),
('Comedy', 'Komedija'),
('Drama', 'Drama'),
('Science Fiction', 'Zinatniska fantastika'),
('Family Adventure', 'Gimenes piedzivojums');

INSERT INTO movies (genre_id, title, description_en, description_lv, duration, age_restriction, poster) VALUES
(4, 'Drama', 'A heartfelt story about a young actor trying to rebuild his life after one difficult mistake changes his career and family relationships.', 'Sirsnigs stasts par jaunu aktieri, kurs megina sakartot dzivi pec kludas, kas maina karjeru un gimenes attiecibas.', 108, '12+', 'images/Drama.jpg'),
(2, 'Hokum', 'A creepy small-town horror film where an old stage trick becomes dangerously real during a midnight performance.', 'Baisa mazpilsetas sausmu filma, kur sena skatuves iluzija pusnakts izrade klust bistami ista.', 101, '16+', 'images/Hokum.jpg'),
(6, 'Hoppers', 'A bright animated adventure about clever kids who discover a secret world and learn that courage can start with one small jump.', 'Koss animacijas piedzivojums par berniem, kuri atklaj slepenu pasauli un saprot, ka drosme sakas ar vienu mazu lecienu.', 94, '7+', 'images/Hoppers.jpg'),
(4, 'Maikl', 'An emotional drama about a musician named Maikl who returns home and faces the choices he left behind.', 'Emocionala drama par muziki Maiklu, kurs atgriezas majas un sastopas ar reiz atstatajam izvelem.', 112, '12+', 'images/Maikl.jpg'),
(1, 'Outcome', 'A tense action thriller about a former investigator pulled into one final case where every decision has a consequence.', 'Spraigs spriedzes trilleris par bijuso izmekletaju, kuru ierauj pedeja lieta, kur katrai izvelei ir sekas.', 116, '16+', 'images/Outcome.jpg'),
(5, 'Project Hail Mary', 'A science fiction adventure about a lone astronaut who wakes up on a mission that may decide the future of Earth.', 'Zinatniskas fantastikas piedzivojums par astronautu, kurs pamostas misija, kas var izskirt Zemes nakotni.', 128, '12+', 'images/Project_Hail_Mary.jpg'),
(2, 'Ready or Not', 'A dark horror comedy where a wedding night turns into a deadly family game with terrifying rules.', 'Tumsa sausmu komedija, kur kazu nakts parversas navejosa gimenes spele ar biedejosiem noteikumiem.', 95, '16+', 'images/Ready_or_not.webp'),
(3, 'The Devil Wears Prada 2', 'A stylish comedy drama about fashion, ambition, and old rivals meeting again in a changing magazine world.', 'Stiliga komedijdrama par modi, ambicijam un seniem konkurentiem, kas atkal satiekas mainiga zurnalu pasaule.', 110, '12+', 'images/The_Devil_Wears_Prada_2.webp'),
(6, 'Woodwalkers 2', 'A family fantasy adventure where young shapeshifters must protect their school and discover who they can trust.', 'Gimenes fantazijas piedzivojums, kur jaunajiem parvertajiem jaaizsarga sava skola un jasaprot, kam uzticeties.', 103, '7+', 'images/woodwalkers_2.jpg');

INSERT INTO sessions (movie_id, show_time, hall, price, seats_total) VALUES
(1, '2026-05-10 18:00:00', 'Hall 1', 7.50, 60),
(2, '2026-05-10 21:00:00', 'Hall 2', 8.00, 55),
(3, '2026-05-11 15:30:00', 'Hall 1', 5.50, 60),
(4, '2026-05-11 19:00:00', 'Hall 3', 7.00, 45),
(5, '2026-05-12 20:30:00', 'Hall 2', 8.50, 55),
(6, '2026-05-13 19:30:00', 'Hall 1', 8.50, 60),
(7, '2026-05-14 21:15:00', 'Hall 3', 7.50, 45),
(8, '2026-05-15 18:45:00', 'Hall 2', 7.00, 55),
(9, '2026-05-16 16:00:00', 'Hall 1', 6.00, 60),
(6, '2026-05-16 21:00:00', 'Hall 2', 8.50, 55);

INSERT INTO reservations (user_id, session_id, tickets, total_price, status) VALUES
(2, 1, 2, 15.00, 'paid'),
(2, 4, 1, 7.00, 'pending');
