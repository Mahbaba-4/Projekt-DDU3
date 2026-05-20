class API {
 

    async postSignUp(sign) {
        try {
            const response = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(sign)
            });

            if (response.ok) {
                window.location.href = "login.html";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async logIn(username, password) {

        try {
            const credentials = { username: username, password: password };

            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: "include"
            });

            if (response.ok) {
                window.location.href = "/main-page.html";
      
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async logOut() {
    
        try {
            const response = await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                window.location.href = "front-page.html";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getUserProfile() {
        try {
            const response = await fetch('http://localhost:8000/user/profile', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async updateUserProfile(profileData) {
        try {
            const response = await fetch('http://localhost:8000/user/profile', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Profil uppdaterad!")
                return true;
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async uploadProfileImage(imageFile) {
        try {

            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch('http://localhost:8000/user/profile/image', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getStatistics() {
        try {

            const response = await fetch("http://localhost:8000/user/statistics", {
                method: "GET",
                headers: {
                    "Accept": "application/json",

                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }

    }

    async getMonthlyStatistics() {
        try {

            const response = await fetch("http://localhost:8000/user/statistics/monthly", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getGenre() {
        try {

            const response = await fetch("http://localhost:8000/movies/genre", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getMovies(filter) {
        try {

            let url = "http://localhost:8000/user/movies";

            if (filter) {
                url += `?status=${filter}`;
            }

            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                 headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async searchMovies(query) {
        try {
            const response = await fetch(`http://localhost:8000/user/movies/search?q=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getMoviesById(movieId) {
        try {

            const response = await fetch(`http://localhost:8000/user/movies/${movieId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async createMovie(movieData) {
        try {

            const response = await fetch("http://localhost:8000/user/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieData),
                credentials: "include"
            });

            if (response.ok) {
                console.log('Film skapad');
                return true;
            }
        } catch (error) {
            console.log(error.message);

        }
    }

    async updateMovie(movieId, updatedData) {
        try {
            const response = await fetch(`http://localhost:8000/user/movies/${movieId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Film uppdaterad")

                return true;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMovie(movieId) {
        try {
            const response = await fetch(`http://localhost:8000/user/movies/${movieId}`, {
                method: "DELETE",
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Film raderad")
                return true;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.log(error.message);
        }


    }

    async postGenre(genreName) {
        try {

            const response = await fetch("http://localhost:8000/movies/genre", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ name: genreName }),
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteGenres(genreId) {
        try {

            const response = await fetch(`http://localhost:8000/movies/genre/${genreId}`, {
                method: "Delete",
                credentials: "include"
            });

            if (response.ok) {
                console.log("Genre raderad");
                return true
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getAllCustomLists() {
        try {
            const response = await fetch("http://localhost:8000/user/lists", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
            return [];
        }


    }

    async createCustomList(listName, movieIds = []) {
        try {
            const response = await fetch("http://localhost:8000/user/lists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ name: listName, movieIds }),
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteCustomList(listId) {
        try {
            const response = await fetch(`http://localhost:8000/user/lists/${listId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                console.log("Listan har tagits bort!");
                return true;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async getMoviesByListId(listId) {
        try {
            const response = await fetch(`http://localhost:8000/user/lists/${listId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    async getUserMovieTitles() {
        try {
            const response = await fetch("http://localhost:8000/user/movies/title", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

}

