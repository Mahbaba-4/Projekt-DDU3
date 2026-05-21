class UI {
    constructor(apiInstance) {
        this.api = apiInstance;
        //this.currentMovieId = null; <-- används inte i koden just nu så kommenterar ut den, men har kvar den ifall att vi väljer att vi vill använda det som vi gjorde på U1. Men tror inte det kommer behövas. :)
    }

    signUpForm() {

        const signUpForm = document.getElementById("movieForm");

        signUpForm.addEventListener("submit", async function (e) {
            e.preventDefault()

            const usernameInput = document.getElementById("username").value;
            const emailInput = document.getElementById("email").value;
            const passwordInput = document.getElementById("password").value;

            if (!usernameInput || !emailInput || !passwordInput) {
                console.log("Alla fält måste fyllas in");
                return;
            }

            await api.postSignUp({
                username: usernameInput,
                email: emailInput,
                password: passwordInput
            })
        })
    }

    logInForm() {
        const logInForm = document.getElementById("logInForm");
        const api = this.api

        logInForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;

            if (!usernameInput || !passwordInput) {
                console.log("Användarnamn och lösenord krävs för att logga in");
                return;
            }

            await api.logIn(usernameInput, passwordInput)
        })

    }

    async getMovies(genreId = "", status = "") {

        console.log("getMovies method called");

        let allCount = document.getElementById("all-count");
        let watchedCount = document.getElementById("watched-count");
        let watchlistCount = document.getElementById("watchlist-count");
        let container = document.getElementById("movies-container");

        container.innerHTML = "";

        try {
            const allMovies = await api.getMovies();
            const allGenres = await api.getGenre();
            const filteredMovies = await this.api.getMoviesWithFilter(genreId, status);

            let allMoviesCount = 0;
            let watchedMoviesCount = 0;
            let watchlistMoviesCount = 0;

            for (let i = 0; i < allMovies.length; i++) {
                allMoviesCount++;
                if (allMovies[i].status == "Watched") {
                    watchedMoviesCount++;
                } else if (allMovies[i].status == "Watchlist") {
                    watchlistMoviesCount++;
                }

            }

            if (allCount) {
                allCount.textContent = allMoviesCount;
                console.log(allCount.textContent)
            }

            if (watchedCount) {
                watchedCount.textContent = watchedMoviesCount;
            }

            if (watchlistCount) {
                watchlistCount.textContent = watchlistMoviesCount;
            }


            for (let movie of filteredMovies) {
                const a = document.createElement("a");
                a.href = `one-movie.html?id=${movie.id}`;
                a.style.textDecoration = "none";

                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");

                let genreName = "";
                for (let genre of allGenres) {
                    if (genre.id == movie.genreId) {
                        genreName = genre.name;
                        break;
                    }
                }

                movieCard.innerHTML = `
                    <img class="movie-poster" src="${movie.posterUrl}">
                    <div class="movie-info">
                        <div class="movie-card-title">${movie.title}</div>
                        <div class="movie-year-genre">${movie.year} • ${genreName} </div>
                    </div>

                `

                if (movie.status == "Watched") {
                    const ratingContainer = document.createElement("div");
                    ratingContainer.classList.add("movie-rating")

                    for (let i = 0; i < 5; i++) {
                        let star = document.createElement("span");

                        if (i < movie.rating) {
                            star.innerHTML = "★";
                        } else {
                            star.innerHTML = "☆";
                        }

                        ratingContainer.appendChild(star);
                    }

                    let movieInfo = movieCard.querySelector(".movie-info");
                    movieInfo.appendChild(ratingContainer)
                }

                a.appendChild(movieCard);
                container.appendChild(a);
            }

        } catch (error) {
            console.log(error.message);
        }

    }

    async logOut() {

        const logOutLink = document.getElementById("logOut");

        const api = this.api;

        logOutLink.addEventListener("click", async function (e) {
            e.preventDefault();


            try {
                await api.logOut();
                console.log("CLICKED LOGOUT");
            } catch (error) {
                console.log("Something went wrong while trying to log out", error.message);
            }
        })
    }

    async getMoviesById() {
        const urlParam = new URLSearchParams(window.location.search);
        const movieId = urlParam.get("id");

        if (!movieId) {
            console.log("No id found :(");
            return;
        }

        try {

            const movie = await api.getMoviesById(movieId);
            const allGenres = await api.getGenre();

            let genreName = "";
            for (let genre of allGenres) {
                if (genre.id == movie.genreId) {
                    genreName = genre.name;
                    break;
                }
            }

            const movieTitle = document.getElementById("movie-title");
            const movieYear = document.getElementById("movie-year");
            const movieGenre = document.getElementById("movie-genre");
            const movieRuntime = document.getElementById("movie-runtime");
            const movieDirector = document.getElementById("movie-director");
            const moviePoster = document.getElementById("movie-poster");
            const watchedDateSpan = document.getElementById("watched-date");
            const movieRating = document.getElementById("movie-rating");
            const movieReview = document.getElementById("movie-review");

            movieTitle.textContent = movie.title;
            movieYear.textContent = movie.year;
            movieGenre.textContent = genreName;
            movieRuntime.textContent = movie.runtime + " min";
            movieDirector.textContent = "Directed by " + movie.director;
            moviePoster.src = movie.posterUrl;

            if (movie.status === "Watched" && movie.dateWatched) {
                watchedDateSpan.innerHTML = "Watched on " + movie.dateWatched;
            } else {
                watchedDateSpan.innerHTML = "Not watched yet";
            }

            if (movie.status == "Watched") {
                movieRating.innerHTML = "";

                for (let i = 0; i < 5; i++) {
                    let star = document.createElement("span");
                    if (i < movie.rating) {
                        star.innerHTML = "★";
                    } else {
                        star.innerHTML = "☆";
                    }
                    movieRating.appendChild(star);
                }
            } else {
                movieRating.innerHTML = "Not rated";
            }

            movieReview.textContent = movie.description;

        } catch (error) {

        }
    }

    async showGenres() {
        try {

            const genres = await this.api.getGenre();

            const genreSelect = document.getElementById("genreSelect");

            genreSelect.innerHTML = `<option value="">Select genre</option>`;

            for (let genre of genres) {
                const option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            }

        } catch (error) {
            console.error("Failed to load genres:", error.message);
            const genreSelect = document.getElementById("genreSelect");
            genreSelect.innerHTML = `<option value="">Error loading genres</option>`;
        }
    }


    async getUserGenre(){
        try{

            const genres = await this.api.getUserGenre();
            const genreDelete = document.getElementById("genreDelete");
            genreDelete.innerHTML = `<option value="">Delete genre</option>`;

            for (let genre of genres) {
                const option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                genreDelete.appendChild(option);
            }

        }catch(error){
            console.error("Failed to load genres:", error.message);
            const genreDelete = document.getElementById("genreDelete");
            genreDelete.innerHTML = `<option value="">Error loading generes</option>`;
        }
    }


    async addGenre() {
        try {

            const genreNameInput = document.getElementById("genreInput");

            await this.api.postGenre(genreNameInput.value);

            genreNameInput.value = "";

        } catch (error) {
            console.log("Failed to add genre", error.message)
        }
    }

    async deleteGenre(genreId) {
        try {
            await this.api.deleteGenres(genreId);
        } catch (error) {
            console.log("Failed to delete genre", error.message)
        }
    }



    async filteredMovies() {

        await this.showGenres(); 

        let currentGenre = "";
        let currentStatus = "all";

        const self = this; 

        const allBtn = document.querySelector('.filter-btn:first-child');
        const watchedBtn = document.querySelector('.filter-btn:nth-child(2)');
        const watchlistBtn = document.querySelector('.filter-btn:nth-child(3)');
        const genresSelect = document.getElementById("genreSelect");


        if (allBtn) {
            allBtn.addEventListener("click", function (e) {
                currentStatus = "all";

                e.target.style.backgroundColor = "#161515";
                watchedBtn.style.backgroundColor = "transparent";
                watchlistBtn.style.backgroundColor = "transparent";

                let genreValue = "";
                let statusValue = "";
                if (currentGenre !== "") genreValue = currentGenre;
                if (currentStatus !== "all") statusValue = currentStatus;
                self.getMovies(genreValue, statusValue);
            });
        }

        if (watchedBtn) {
            watchedBtn.addEventListener("click", function (e) {
                currentStatus = "Watched";

                e.target.style.backgroundColor = "#161515";
                watchlistBtn.style.backgroundColor = "transparent";
                allBtn.style.backgroundColor = "transparent";

                let genreValue = "";
                let statusValue = "";
                if (currentGenre !== "") genreValue = currentGenre;
                if (currentStatus !== "all") statusValue = currentStatus;
                 self.getMovies(genreValue, statusValue);
            });
        }

        if (watchlistBtn) {
            watchlistBtn.addEventListener("click", function (e) {
                currentStatus = "Watchlist";

                e.target.style.backgroundColor = "#161515";
                allBtn.style.backgroundColor = "transparent";
                watchedBtn.style.backgroundColor = "transparent";

                let genreValue = "";
                let statusValue = "";
                if (currentGenre !== "") genreValue = currentGenre;
                if (currentStatus !== "all") statusValue = currentStatus;
                 self.getMovies(genreValue, statusValue);
            });
        }

        if (genresSelect) {
            genresSelect.addEventListener("change", function(e) {
                currentGenre = e.target.value;

                let genreValue = "";
                let statusValue = "";
                if (currentGenre !== "") genreValue = currentGenre;
                if (currentStatus !== "all") statusValue = currentStatus;
                 self.getMovies(genreValue, statusValue);
            });
        }

        let genreValue = "";
        let statusValue = "";
        if (currentGenre !== "") genreValue = currentGenre;
        if (currentStatus !== "all") statusValue = currentStatus;
         self.getMovies(genreValue, statusValue);

    }

    async searchMovies(){

         let allCount = document.getElementById("all-count");
        let watchedCount = document.getElementById("watched-count");
        let watchlistCount = document.getElementById("watchlist-count");
        let container = document.getElementById("movies-container");

        container.innerHTML = "";
    
        const allGenres = await api.getGenre();
        const searchInput = document.getElementById("searchInput");
        const query = searchInput.value;

        if (query === "") return;


        const result = await api.searchMovies(query);

        if (!result) return;

        const movies = result.data;

        for (let movie of result) {
                const a = document.createElement("a");
                a.href = `one-movie.html?id=${movie.id}`;
                a.style.textDecoration = "none";

                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");

                let genreName = "";
                for (let genre of allGenres) {
                    if (genre.id == movie.genreId) {
                        genreName = genre.name;
                        break;
                    }
                }

                movieCard.innerHTML = `
                    <img class="movie-poster" src="${movie.posterUrl}">
                    <div class="movie-info">
                        <div class="movie-card-title">${movie.title}</div>
                        <div class="movie-year-genre">${movie.year} • ${genreName} </div>
                    </div>

                `

                if (movie.status == "Watched") {
                    const ratingContainer = document.createElement("div");
                    ratingContainer.classList.add("movie-rating")

                    for (let i = 0; i < 5; i++) {
                        let star = document.createElement("span");

                        if (i < movie.rating) {
                            star.innerHTML = "★";
                        } else {
                            star.innerHTML = "☆";
                        }

                        ratingContainer.appendChild(star);
                    }

                    let movieInfo = movieCard.querySelector(".movie-info");
                    movieInfo.appendChild(ratingContainer)
                }

                a.appendChild(movieCard);
                container.appendChild(a);
            }

    }

}



