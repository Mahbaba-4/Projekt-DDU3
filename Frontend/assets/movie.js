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
                        <div class="movie-year-genre">${movie.year} - ${genreName} </div>
                    </div>

                `

                if (movie.status == "Watched") {
                    const ratingContainer = document.createElement("div");
                    ratingContainer.classList.add("movie-rating")

                    for (let i = 0; i < 5; i++) {
                        let star = document.createElement("span");
                        star.style.fontSize = "30px";
                        star.style.color = "#DB2424";

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

                container.appendChild(movieCard);
            }

        } catch (error) {
           console.log(error.message) ;
        }

    }

    async logOut(){

        const logOutLink = document.getElementById("logOut");
        console.log(logOutLink);
        const api = this.api;

        logOutLink.addEventListener("click", async function (e) {
             e.preventDefault();
             console.log("CLICKED LOGOUT");

            try{
                await api.logOut();
                
            }catch(error){
                console.log("Something went wrong while trying to log out", error.message);
            }
        })
    }
}



