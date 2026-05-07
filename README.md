# Kino Programma

Kino Programma is a simple cinema booking website for a student final project.

The frontend is normal static HTML, CSS, and JavaScript. PHP is used only for the backend API and database connection.

## Project Structure

- `index.html`
- `movie.html`
- `login.html`
- `register.html`
- `profile.html`
- `admin.html`
- `css/style.css`
- `js/script.js`
- `api.php`
- `config.php`
- `DB/db.sql`
- `manifest.json`
- `js/sw.js`
- `images/`

## Technologies

- HTML
- CSS
- JavaScript
- PHP
- MySQL

## XAMPP Installation

1. Copy the project folder to `C:\xampp\htdocs\kino-programma`.
2. Start Apache and MySQL in XAMPP.
3. Open phpMyAdmin: `http://localhost/phpmyadmin`.
4. Import `DB/db.sql`.
5. Open the website: `http://localhost/kino-programma/index.html`.

## Database

The database name is `kino_programma`.

Tables:

- `users`
- `genres`
- `movies`
- `sessions`
- `reservations`

## Test Accounts

Admin:

- Email: `admin@kino.test`
- Password: `password`

User:

- Email: `user@kino.test`
- Password: `password`

## Features

- Browse movies
- Search movies by title
- Filter movies by genre
- View movie details and sessions
- Real poster images from the `images/` folder
- Duration and age restriction on movie cards
- Register and login
- Reserve tickets
- Fake payment confirmation
- View reservation history
- Admin movie CRUD
- Admin session management
- Simple statistics
- English and Latvian language switch
- Simple PWA files

## Test Cases

1. Registration: create a new account on `register.html`.
2. Login: login on `login.html` with the test user.
3. Reservation: open a movie, choose tickets, and reserve a session.
4. Admin CRUD: login as admin, add/edit/delete a movie on `admin.html`.
5. Search/filter: search movies and filter by genre on `index.html`.
