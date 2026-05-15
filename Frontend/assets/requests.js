class API {
    //sign --> ett objekt som tar emot ett objet med 3 nycklar som är {username, email, password};
    async postSignUp(sign) {
        try {
            const response = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                hedares: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sign)
            });

            if (response.ok) {
                window.location.href = "/login.html";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async logIn(email, password) {
        try {

            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
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

    async logOut() {
        try {

            const response = await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                window.location.href = "/login.html";
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
                    "Content-Type": "application/json"
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

    async deleteProfileImage() {
        try {
            const response = await fetch('http://localhost:8000/user/profile/image', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Bilden har tagits bort!")
                return true;
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

    async getMontlyStatistics() {
        try {

            const response = await fetch("http://localhost:8000/user/statistics/monthly", {
                method: "GET",
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
                method: "GET"
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
            
            if(filter) {
                url += `?status=${filter}`;
            }

            const response = await fetch(url, {
                method: "GET",
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
}


//http://localhost:8000/


/* async metodNamn(){
    try {

        const response = await fetch ();
            
        if(response.ok){
            const data = await response.json();
            return data;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
    } catch (error){
        console.log(error.message);
    }
} */

