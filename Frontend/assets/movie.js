class UI {
    constructor(apiInstance) {
        this.api = apiInstance;
    }

    // BEHÅLL DENNA FUNKTION!! DET ÄR 2 ANDRA FUNKTIONER OSM ANVÄNDER SIG AV DEN OCH DET ÄR ANLEDNINGEN TILL ATT LISTS FUNGERAR SOM DET SKA, jag förklarar varför det är så när vi ses!
    async renderMovies(moviesToShow, container) {
        try {
            if (!moviesToShow || moviesToShow.length === 0) {
                container.innerHTML = "<p style='text-align: center; padding: 60px; color: #666;'>No movies found.</p>";
                return;
            }

            const allGenres = await this.api.getGenre();

            for (let movie of moviesToShow) {
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
        `;

                if (movie.status == "Watched") {
                    const ratingContainer = document.createElement("div");
                    ratingContainer.classList.add("movie-rating");
                    for (let i = 0; i < 5; i++) {
                        let star = document.createElement("span");
                        star.innerHTML = i < movie.rating ? "★" : "☆";
                        ratingContainer.appendChild(star);
                    }
                    movieCard.querySelector(".movie-info").appendChild(ratingContainer);
                }

                a.appendChild(movieCard);
                container.appendChild(a);
            }
        } catch (error) {
            console.log(error.meessage)
        }
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


            await this.renderMovies(filteredMovies, container);

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


    async getUserGenre() {
        try {

            const genres = await this.api.getUserGenre();
            const genreDelete = document.getElementById("genreDelete");
            genreDelete.innerHTML = `<option value="">Delete genre</option>`;

            for (let genre of genres) {
                const option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                genreDelete.appendChild(option);
            }

        } catch (error) {
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
            genresSelect.addEventListener("change", function (e) {
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

    async searchMovies() {
        try {
            let allCount = document.getElementById("all-count");
            let watchedCount = document.getElementById("watched-count");
            let watchlistCount = document.getElementById("watchlist-count");
            let container = document.getElementById("movies-container");

            container.innerHTML = "";

            const searchInput = document.getElementById("searchInput");
            const query = searchInput.value;

            if (query === "") return;

            const result = await api.searchMovies(query);
            if (!result) return;


            await this.renderMovies(result, container);

        } catch (error) {
            console.error('Could not load movies', error.message);
        }
    }

    async loadProfile() {
        try {
            const user = await this.api.getUserProfile();

            if (user) {
                let displayName;
                if (user.username) {
                    displayName = user.username;
                } else {
                    displayName = user.email;
                }
                document.getElementById("profileUsername").textContent = displayName;
                document.getElementById("profileEmail").textContent = user.email;

                if (user.profileImage) {
                    document.getElementById("profileImage").src = user.profileImage;
                } else {
                    document.getElementById("profileImage").src = 'assets/images/avatar-default.png';
                }
            } else {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Could not load profile:', error);

        }
    }

    showEditForm() {
        const currentUsername = document.getElementById("profileUsername").textContent;
        const currentEmail = document.getElementById("profileEmail").textContent;
        const currentBio = document.getElementById("profileBio").textContent;
        const currentImage = document.getElementById("profileImage").src;

        document.getElementById("editUsername").value = currentUsername;
        document.getElementById("editEmail").value = currentEmail;

        document.getElementById("editImageUpload").value = "";
        document.getElementById("editProfileForm").style.display = "block";

    }

    hideEditForm() {
        document.getElementById("editProfileForm").style.display = "none";
    }

    async saveProfileChanges() {
        const newUsername = document.getElementById("editUsername").value;
        const newEmail = document.getElementById("editEmail").value;
        const imageFile = document.getElementById("editImageUpload").files[0];

        const currentUsername = document.getElementById("profileUsername").textContent;
        const currentEmail = document.getElementById("profileEmail").textContent;

        const profileData = {};

        if (newUsername !== currentUsername && newUsername !== "") {
            profileData.username = newUsername;
        }

        if (newEmail !== currentEmail && newEmail !== "") {
            profileData.email = newEmail;
        }


        let hasChanges = false;
        for (let key in profileData) {
            hasChanges = true;
            break;
        }

        if (hasChanges) {
            const success = await this.api.updateUserProfile(profileData);
            if (!success) {
                alert("Kunde inte uppdatera profil");
                return;
            }
        }

        if (imageFile) {
            const result = await this.api.uploadProfileImage(imageFile);
            if (!result) {
                alert("Kunde inte ladda upp bild");
                return;
            }
        }

        await this.loadProfile();

        this.hideEditForm();

        alert("Profil uppdaterad");
    }

    initProfile() {
        const self = this;

        this.loadProfile();

        const editBtn = document.getElementById("editProfileBtn");
        editBtn.addEventListener("click", function () {
            self.showEditForm();
        });

        const chooseImageBtn = document.getElementById("chooseImageBtn");
        chooseImageBtn.addEventListener("click", function () {
            document.getElementById("editImageUpload").click();
        });
        //Visa filnamn 
        const imageUpload = document.getElementById('editImageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', function (event) {
                const file = event.target.files[0];
                const fileNameSpan = document.getElementById('selectedFileName');

                if (file) {
                    fileNameSpan.textContent = file.name;
                } else {
                    fileNameSpan.textContent = "No file chosen";
                }
            });

        }

        const saveBtn = document.getElementById("saveProfileBtn");
        saveBtn.addEventListener("click", function () {
            self.saveProfileChanges();
        });

        const cancelBtn = document.getElementById("cancelEditBtn");
        cancelBtn.addEventListener("click", function () {
            self.hideEditForm();
        });
    }
    
    async createLists(listName, selectedMovieIds) {
        if (!listName) {
            alert("Enter a list name!")
            return;
        }

        try {

            await api.createCustomList(listName, selectedMovieIds);
            await this.showMoviesAndLists();

            alert(`List "${listName}" created!!`)

        } catch (error) {
            console.log(error.message);
        }
    }

    async showMoviesAndLists() {
        try {
            const movies = await api.getMovies();
            const movieContainer = document.getElementById("moviesCheckboxes");
            const lists = await api.getAllCustomLists();
            const listContainer = document.getElementById("listsContainer");

            if (movies.length === 0) {
                movieContainer.innerHTML = "<p style='color: #DB2424; text-align: center; padding: 20px;'>No movies yet. Add some movies first!</p>"
            } else {
                movieContainer.innerHTML = "";
                for (let movie of movies) {
                    const div = document.createElement("div");
                    div.className = "movie-checkbox";
                    div.innerHTML = `
                        <input type = "checkbox" value="${movie.id}">
                        <span>${movie.title} - (${movie.year})</span>
                    `
                    movieContainer.appendChild(div);
                }
            }

            if (lists.length === 0) {
                listContainer.innerHTML = "<p style='color: #DB2424; text-align: center; padding: 20px;'>No custom lists yet. create your first list above!!</p>"
            } else {
                listContainer.innerHTML = "";


                for (let list of lists) {
                    let count = 0;
                    if (list.movieIds) {
                        count = list.movieIds.length;
                    }

                    const div = document.createElement("div");
                    div.className = "list-item";
                    div.innerHTML = `
                        <span> ${list.name} - (${count})</span>
                        <button class="delete-list-btn" data-id="${list.id}">Delete</button>
                    `;
                    listContainer.appendChild(div);
                }
            }

            const deleteButtons = document.querySelectorAll(".delete-list-btn");
            const self = this;

            for (let oneBtn of deleteButtons) {
                oneBtn.addEventListener("click", async function () {
                    const listId = oneBtn.getAttribute("data-id");
                    if (confirm("Do you really want to delete this?")) {
                        await api.deleteCustomList(listId);
                        await self.showMoviesAndLists();
                    }
                })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    async showMovieInList(listId) {
        try {
            const container = document.getElementById("movies-container");
            container.innerHTML = "";

            const movies = await api.getMoviesByListId(listId);

            await this.renderMovies(movies, container);

        } catch (error) {
            console.log(error.message);
        }
    }
}
