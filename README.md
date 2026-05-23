# Projekt-DDU3
Projektet Filmlogg

Backend:

api.js - Alla backend funktioner/endpoints är kodade här och importerar funktioner till server.js. 

server.js - Där alla routing sker - Begäran (request) tas emot och exporterar funktioner från api.js. 

movieDataBase.json - All data finns här inne.


Frontend:

request.js: Där requests görs till api (fetch) Klassen API.

movie.js: Kommunicerar med DOM/HTML och anropar funktioner från request.js. Klassen UI.

front-page.html: Startsidan, där man väljer log in / sign up

main-page.js - main-page.html: Där recently added filmer visas och detta är sidan användaren hamnar när man loggar in. 

my-movie.js - my-movie.html: Där man kan se alla sina filmer, söka på mellan de, filtrera de (watched, watchlist, custom lists, genres). Man kan även trycka på dem för att se uppgifter på en movie. 

add.js - add-movie.html: Formulär för att lägga till filmer
profile.js - profile.html: Profil sidan där användaren kan se sina uppgifter, statistik och även ändra i sina uppgifter och ladda upp en  profilbild. 

genre.js - genre.html: Där man kan lägga till eller radera sina egna genrer.  

lists.js - manage-list.html: Där man kan hantera sina custom lists(skapa, radera).

one-movie.js - one-movie.html: Där en film visas enskilt när användaren har tryckt på den. Man kan också radera eller uppdatera/ändra i filmen. 

updateMovie.js - updateMovie.html: Formulär för att uppdatera/ändra i en film 

login.js - login.html: Formulär för att logga in. 

account.js - signup.html: Formulär för att registrera sig. 

Generellt: 

ALLA js-filer ligger i mappen assets i Frontend tillsammans med en css-mapp där alla css-filer för webbsidan ligger. Det finns även mappen där alla bilder/ikoner som används på sidan finns. 

Upload-mappen är för spara profile-images som användaren lägger in som profil-bild som ligger i Fronted-mappen




