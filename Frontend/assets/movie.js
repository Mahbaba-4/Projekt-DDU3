class UI {
    constructor(apiInstance) {
        this.api = apiInstance;
        this.currentMovieId = null;
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

    async getMovies() {

        console.log("getMovies method called");

        let allCount = document.getElementById("all-count");
        let container = document.getElementById("movies-container");

        container.innerHTML = "";

        try {
            const allMovies = await api.getMovies();
            const allGenres = await api.getGenre();


            if (allCount) {
                allCount.textContent = allMovies.length;
                console.log(allCount.textContent)
            }

            for (let movie of allMovies) {
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

}



