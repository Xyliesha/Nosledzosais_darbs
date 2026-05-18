# Lumiere

`Lumiere` ir vienkārša kino biļešu rezervācijas tīmekļa vietne studentu noslēguma darbam.

Projekta priekšgals ir veidots ar parastu HTML, CSS un JavaScript. PHP tiek izmantots tikai datubāzes savienojumam un `api.php` failam, kas apstrādā pieprasījumus.

Filmas netiek veidotas automātiski no attēlu failu nosaukumiem. Filmas pievieno administrators caur administrācijas paneli.

## Projekta Struktūra

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

## Izmantotās Tehnoloģijas

- HTML
- CSS
- JavaScript
- PHP
- MySQL

## Uzstādīšana Ar XAMPP

1. Nokopē projekta mapi uz `C:\xampp\htdocs\kino-programma`.
2. Atver XAMPP Control Panel.
3. Ieslēdz Apache un MySQL.
4. Atver phpMyAdmin: `http://localhost/phpmyadmin`.
5. Importē datubāzes failu `DB/db.sql`.
6. Atver projektu pārlūkprogrammā:
   `http://localhost/kino-programma/index.html`

## Datubāze

Datubāzes nosaukums: `kino_programma`

Tabulas:

- `users`
- `genres`
- `halls`
- `movies`
- `sessions`
- `reservations`
- `payments`

## Testa Lietotāji

Administrators:

- E-pasts: `admin@kino.test`
- Parole: `password`

Administrācijas panelis ir pieejams tikai pēc pieslēgšanās ar šo administratora kontu.

Parasts lietotājs:

- E-pasts: `user@kino.test`
- Parole: `password`

## Projekta Funkcijas

- Filmu apskate
- Filmu meklēšana pēc nosaukuma
- Filtru izmantošana pēc žanra
- Filmas detalizēta skata atvēršana
- Filmas seansu apskate
- Pieejamo vietu skaita rādīšana seansiem
- Seansa audio valodas un subtitru valodas rādīšana
- Lietotāja reģistrācija
- Lietotāja pieslēgšanās
- Biļešu rezervācija
- Rezervāciju statusu pārvaldība
- Rezervāciju vēstures apskate
- Populāro filmu bloks pēc rezervēto biļešu skaita
- Administrators var pievienot, labot un dzēst filmas
- Administrators var pārvaldīt seansus
- Administrators var pārvaldīt rezervāciju statusus un dzēst rezervācijas
- Vienkārša statistika administrācijas panelī
- Angļu un latviešu valodas pārslēgšana
- Vienkāršs PWA atbalsts
- Filmu kartītēs tiek rādīts plakāts, žanrs, apraksts, ilgums un vecuma ierobežojums

## Administrācijas Paneļa Loģika

Administrators manuāli pievieno filmas caur `admin.html`.

Administratoram jāievada:

- filmas nosaukums
- žanrs
- apraksts angļu valodā
- apraksts latviešu valodā
- filmas ilgums
- vecuma ierobežojums
- plakāta ceļš, piemēram `images/Project_Hail_Mary.jpg`
- treilera saite, ja filmai tāda ir

Pēc filmas pievienošanas administrators var pievienot seansus:

- filma
- seansa datums un laiks
- zāle
- audio valoda
- subtitru valoda
- cena

Vietu skaits netiek ievadīts katram seansam atsevišķi. Tas tiek ņemts no izvēlētās zāles `halls` tabulā.

Administrators var arī mainīt rezervācijas statusu uz `pending`, `paid` vai `cancelled`. Ja rezervācija tiek atzīmēta kā `paid`, `payments` tabulā tiek izveidots maksājuma ieraksts.

Kad dati tiek saglabāti, tie nonāk MySQL datubāzē. Galvenā lapa `index.html` un filmas lapa `movie.html` ielādē datus no `api.php`, izmantojot JavaScript `fetch()`.

## Projekta Datu Plūsma

1. Plakātu attēli tiek glabāti `images/` mapē.
2. Filmu dati tiek glabāti MySQL datubāzē.
3. Administrators pievieno vai labo filmas `admin.html` lapā.
4. Administrators pievieno seansus, izvēloties filmu, zāli, laiku, audio valodu, subtitrus un cenu.
5. `api.php` saglabā datus datubāzē.
6. `index.html` ielādē filmu sarakstu un populārās filmas no datubāzes.
7. `movie.html` ielādē vienu izvēlēto filmu, tās seansus un aprēķina pieejamās vietas pēc zāles ietilpības un rezervācijām.

## Drošība

Projektā tiek izmantotas vienkāršas drošības metodes:

- PDO prepared statements datubāzes pieprasījumiem
- `password_hash()` paroles saglabāšanai
- `password_verify()` paroles pārbaudei
- PHP sesijas lietotāja pieslēgšanās saglabāšanai
- administratora lomas pārbaude administrācijas darbībām
- JavaScript pusē tiek izmantota teksta attīrīšana pirms datu ievietošanas lapā

## Testēšanas Piemēri

1. Reģistrācija:
   Izveido jaunu lietotāju un pārbaudi, vai var pieslēgties.

2. Pieslēgšanās:
   Pieslēdzies ar `user@kino.test` un paroli `password`.

3. Rezervācija:
   Atver filmu, izvēlies seansu, ievadi biļešu skaitu un izveido rezervāciju.

4. Administrācijas CRUD:
   Pieslēdzies kā administrators, pievieno filmu, izlabo un izdzēs.

5. Meklēšana un filtrēšana:
   Meklē filmu pēc nosaukuma un izmanto žanra filtru.

## Piezīmes

Lai projekts darbotos pareizi, tas jāatver caur XAMPP serveri, piemēram:

`http://localhost/kino-programma/index.html`

Projektu nevajag atvērt tieši kā failu ar `file://`, jo tad `api.php` un datubāzes pieprasījumi nedarbosies.
