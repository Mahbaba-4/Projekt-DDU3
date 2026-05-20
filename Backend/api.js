import { extname } from "jsr:@std/path";

export let sessions = [];

function readData() {
    return JSON.parse(Deno.readTextFileSync("./movieDataBase.json"));
}

//Det är enklare att använda en funktion som skriver över datan vid PATCH OCH POST :)
function writeData(data) {
    Deno.writeTextFileSync("./movieDataBase.json", JSON.stringify(data, null, 2));
}

function getMovieById(request, id) {
    try {
        const db = readData();

        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401
            });
        }

        const movies = db.movies;

        let movie = null;
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id === id) {
                movie = movies[i];
                break;

            }
        }

        if (movie === null) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });


        }

        return new Response(JSON.stringify(movie), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });



    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function getGenres(request) {
    try {
        const data = readData();
        let genres = data.genre;

        return new Response(JSON.stringify(genres), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

}

async function createMovieReview(request) {
    try {
        const data = readData();
        const body = await request.json();

        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Not logged in" }), {
                status: 401,
            });
        }

        if (!body.title || !body.year || !body.genre || !body.director || !body.runtime || !body.posterUrl || !body.description || !body.status) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        if (body.status === "Watched" && body.rating === undefined && body.dateWatched === undefined) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        let maxId = 0;
        for (let movie of data.movies) {
            const id = parseInt(movie.id);
            if (id > maxId) maxId = id;
        }

        let newId = `${maxId + 1}`;

        let genreId = null;
        for (let genre of data.genre) {
            if (genre.name === body.genre) {
                genreId = genre.id;
                break;
            }
        }


        let targetList = null;
        for (let i = 0; i < data.lists.length; i++) {
            if (data.lists[i].type === body.status && data.lists[i].userId === userId) {
                targetList = data.lists[i];
                break;
            }
        }

        let listId = null;
        if (targetList) {
            listId = targetList.id;
        }

        const newMovie = {
            id: newId,
            userId: userId,
            title: body.title,
            year: body.year,
            genreId: genreId,
            director: body.director,
            runtime: body.runtime,
            posterUrl: body.posterUrl,
            description: body.description,
            status: body.status,
            rating: body.rating || null,
            dateWatched: body.dateWatched || null,
            listId: listId
        };

        data.movies.push(newMovie);

        if (targetList) {
            if (!targetList.movieIds) {
                targetList.movieIds = [];
            }

            targetList.movieIds.push(newId);
        }

        writeData(data);

        return new Response(null, {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function deleteMovieById(request, id) {
    try {
        const data = readData();
        let found = false;
        let movieIdList = null;
        const newMovies = [];

        for (let i = 0; i < data.movies.length; i++) {
            if (data.movies[i].id == id) {
                movieIdList = data.movies[i].listId;
                found = true;
            } else {
                newMovies.push(data.movies[i])
            }
        }

        if (!found) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        data.movies = newMovies;

        if (movieIdList) {
            for (let list of data.lists) {
                if (list.id == movieIdList) {
                    let newMovieIds = [];
                    for (let movieId of list.movieIds) {
                        if (movieId != id) {
                            newMovieIds.push(movieId)
                        }
                    }
                    list.movieIds = newMovieIds;
                    break;
                }
            }
        }
        writeData(data);

        return new Response(null, {
            status: 204
        })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

async function patchMovieById(request, id) {
    try {
        const data = readData();
        const body = await request.json();

        let found = false;
        let movieToUpdate = null;

        for (let movie of data.movies) {
            if (movie.id == id) {
                movieToUpdate = movie;
                found = true;
                break;
            }
        }

        if (!found) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        if (body.title) {
            movieToUpdate.title = body.title;
        }
        if (body.year) {
            movieToUpdate.year = body.year;
        }

        if (body.genre) {
            let genreId = null;
            for (let genre of data.genre) {
                if (genre.name === body.genre) {
                    genreId = genre.id;
                    break;
                }
            }
            if (genreId) {
                movieToUpdate.genreId = genreId;
            }
        }
        if (body.director) {
            movieToUpdate.director = body.director;
        }
        if (body.runtime) {
            movieToUpdate.runtime = body.runtime;
        }
        if (body.posterUrl) {
            movieToUpdate.posterUrl = body.posterUrl;
        }
        if (body.description) {
            movieToUpdate.description = body.description;
        }
        if (body.rating) {
            movieToUpdate.rating = body.rating;
        }
        if (body.dateWatched) {
            movieToUpdate.dateWatched = body.dateWatched;
        }

        let newStatus = body.status;
        let oldStatus = movieToUpdate.status;

        if (newStatus && newStatus !== oldStatus) {
            let oldListId = movieToUpdate.listId;
            movieToUpdate.status = newStatus;

            if (newStatus === "Watchlist") {
                movieToUpdate.rating = null;
                movieToUpdate.dateWatched = null;
            }

            for (let list of data.lists) {
                if (list.type === newStatus) {
                    movieToUpdate.listId = list.id;

                    if (!list.movieIds) {
                        list.movieIds = [];
                    }

                    list.movieIds.push(id);
                    break;
                }
            }

            for (let list of data.lists) {
                if (list.id == oldListId) {
                    let newMovieIds = [];
                    for (let movieId of list.movieIds) {
                        if (movieId != id) {
                            newMovieIds.push(movieId);
                        }
                    }
                    list.movieIds = newMovieIds;
                    break;
                }
            }
        }

        writeData(data);

        return new Response(null, {
            status: 204
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function getMovies(request) {
    try {
        const data = readData();

        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify("Not logged in"), {
                status: 401
            })
        }

        let movies = [];
        for (let i = 0; i < data.movies.length; i++) {
            if (data.movies[i].userId === userId) {
                movies.push(data.movies[i]);
            }
        }

        const url = new URL(request.url);
        const genreFilter = url.searchParams.get("genre");
        const statusFilter = url.searchParams.get("status");

        if (genreFilter) {
            let filteredByGenre = [];
            for (let i = 0; i < movies.length; i++) {
                if (movies[i].genreId === genreFilter) {
                    filteredByGenre.push(movies[i]);
                }
            }
            movies = filteredByGenre;
        }

        if (statusFilter) {
            if (statusFilter === "Watched") {
                const watchedMovies = [];
                for (let i = 0; i < movies.length; i++) {
                    if (movies[i].status === "Watched") {
                        watchedMovies.push(movies[i]);
                    }
                }
                movies = watchedMovies;
            } else if (statusFilter === "Watchlist") {
                const filteredMovies = [];
                for (let i = 0; i < movies.length; i++) {
                    if (movies[i].status === "Watchlist") {
                        filteredMovies.push(movies[i]);
                    }
                }
                movies = filteredMovies;
            } else {
                return new Response(JSON.stringify({ error: "No movies found with this status" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        }

        return new Response(JSON.stringify(movies), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function searchFilterMovies(request) {
    try {
        const data = readData();
        const url = new URL(request.url);
        const searchQuery = url.searchParams.get("q");

        if (!searchQuery || searchQuery === "") {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const movies = data.movies;
        const queryLower = searchQuery.toLowerCase();
        const matchedMovies = [];

        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
            const titleLowerCase = movie.title.toLowerCase();
            const directorLowerCase = movie.director.toLowerCase();
            const descriptionLowerCase = movie.description.toLowerCase();

            if (titleLowerCase.includes(queryLower) || directorLowerCase.includes(queryLower) || descriptionLowerCase.includes(queryLower)) {
                matchedMovies.push(movie);
            }
        }

        return new Response(JSON.stringify(matchedMovies), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });

    }

}

function postDefaultListsForUser(userId) {
    const data = readData();

    if (!data.lists) {
        data.lists = [];
    }

    let hasLists = false;
    for (let i = 0; i < data.lists.length; i++) {
        if (data.lists[i].userId === userId) {
            hasLists = true;
            break
        }
    }

    if (!hasLists) {
        let maxId = 0;
        for (let i = 0; i < data.lists.length; i++) {
            let id = parseInt(data.lists[i].id);
            if (id > maxId) {
                maxId = id
            }
        }
        let nextId = maxId + 1;

        let watchlist = {
            id: "" + nextId,
            userId: userId,
            name: "Want to watch",
            type: "Watchlist",
            movieIds: []
        }

        let watched = {
            id: "" + (nextId + 1),
            userId: userId,
            name: "Already Watched",
            type: "Watched",
            movieIds: []
        }

        data.lists.push(watchlist);
        data.lists.push(watched);
        writeData(data);
    }

}

async function postSignUp(request) {
    try {
        const data = readData();
        const body = await request.json();

        if (!body.email || !body.password || !body.username) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        if (!data.users) {
            data.users = [];
        }

        let userExists = false;
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].email === body.email) {
                userExists = true;
                break;
            }
        }

        if (userExists) {
            return new Response(JSON.stringify({}), {
                status: 409,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        let maxId = 0;
        for (let user of data.users) {
            const id = parseInt(user.id);
            if (id > maxId) {
                maxId = id;
            }
        }
        let newId = `${maxId + 1}`;

        let newUser = {
            id: newId,
            email: body.email,
            passwordHash: body.password,
            username: body.username
        }

        data.users.push(newUser);
        writeData(data);

        postDefaultListsForUser(newUser.id);

        let userWithoutPassword = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        }

        return new Response(JSON.stringify(userWithoutPassword), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

async function postLogIn(request) {
    try {
        const data = readData();
        const body = await request.json();


        if (!body.username || !body.password) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        const username = body.username;
        const password = body.password;




        let user = null;
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].username === username && data.users[i].passwordHash === password) {
                user = data.users[i];
                break;
            }
        }

        if (!user) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        const sessionId = crypto.randomUUID();

        sessions.push({
            sessionId: sessionId,
            userId: user.id
        });

        return new Response(JSON.stringify({ message: "Login successful", userId: user.id }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": "sessionId=" + sessionId + "; Max-Age=86400; Path=/; SameSite=None;"
            }
        })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function postLogOut(request) {
    try {

        const cookieHeader = request.headers.get("Cookie");

        if (!cookieHeader) {
            return new Response(null, {
                status: 204,
                headers: {
                    "Set-Cookie": "sessionId=; Max-Age=0; "
                }
            })

        }

        const cookies = cookieHeader.split(";");
        let sessionId = null;

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.includes("sessionId=")) {
                sessionId = cookie.split("=")[1];
                break;
            }

        }

        if (sessionId) {
            for (let i = 0; i < sessions.length; i++) {
                if (sessions[i].sessionId === sessionId) {
                    sessions.splice(i, 1);
                    break;
                }
            }
        }

        return new Response(null, {
            status: 204,
            headers: {
                "Set-Cookie": "sessionId=; Max-Age=0; "
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function getUserIdFromSession(request) {

    console.log("Sessions array:", sessions);
    console.log("Sessions length:", sessions.length);

    const cookieHeader = request.headers.get("Cookie");
    console.log("Cookie header:", cookieHeader);
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";");
    let sessionId = null;

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.includes("sessionId=")) {
            sessionId = cookie.split("=")[1];
            break;
        }

    }
    if (!sessionId) {
        return null;
    }

    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].sessionId === sessionId) {
            return sessions[i].userId;
        }
    }
      return null;


}

function getUserProfile(request) {
    try {
        const data = readData();

        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401
            });
        }

        let userFound = null;

        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === userId) {
                userFound = data.users[i];
                break;
            }
        }

        if (!userFound) {
            return new Response(JSON.stringify({}), {
                status: 404
            });
        }

        let user = {
            id: userFound.id,
            email: userFound.email,
            username: userFound.username,
            profileImage: userFound.profileImage
        };

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

async function patchUserProfile(request) {
    try {
        const data = readData();
        const body = await request.json();



        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401
            });
        }

        let userFound = null;

        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === userId) {
                userFound = data.users[i];
                break;
            }
        }

        if (!userFound) {
            return new Response(JSON.stringify({}), {
                status: 404
            });
        }

        if (body.username) {
            userFound.username = body.username;
        }
        if (body.email) {
            userFound.email = body.email;
        }

        writeData(data);

        return new Response(null, {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });


    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

async function postProfileImage(request) {
    try {
        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({ error: "Not logged in" }), {
                status: 401,
            });
        }

        const formData = await request.formData();
        const imageFile = formData.get("image");

        if (!imageFile) {
            return new Response(JSON.stringify({ error: "No image file provided" }), {
                status: 400
            });
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (imageFile.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({ error: "File too large" }), {
                status: 400
            });
        }

        const extension = extname(imageFile.name);

        const uniqueName = crypto.randomUUID();
        const newFilename = uniqueName + extension;

        const bytes = await imageFile.bytes();

        const filePath = `./uploads/profile-images/${newFilename}`;
        await Deno.writeFile(filePath, bytes);

        const data = readData();
        let user = null;
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === userId) {
                user = data.users[i];
                break;
            }
        }

        if (user.profileImage && user.profileImage.substring(0, 9) === "/uploads/") {
            const oldPath = `.${user.profileImage}`;
            try {
                await Deno.remove(oldPath);
            } catch (error) {
                console.log("Error deleting old image:", error);
            }
        }

        user.profileImage = `/uploads/profile-images/${newFilename}`;
        writeData(data);

        return new Response(JSON.stringify({ message: "Image uploaded", path: user.profileImage }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function getUsersStatistics(request) {
    try {
        const data = readData();

        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        let watchedCount = 0;
        let watchlistCount = 0;
        let totalWatchedMinutes = 0;
        let ratingTotal = 0;

        for (let movie of data.movies) {
            if (movie.userId == userId) {
                if (movie.status == "Watched") {
                    watchedCount++;
                    totalWatchedMinutes += movie.runtime;
                    if (movie.rating) {
                        ratingTotal += movie.rating;
                    }
                } else if (movie.status == "Watchlist") {
                    watchlistCount++;
                }
            }
        }

        let totalMovies = watchedCount + watchlistCount;

        let averageRating = 0;
        if (watchedCount > 0) {
            averageRating = ratingTotal / watchedCount;
            averageRating = Math.round(averageRating * 10) / 10;
        }

        let statistics = {
            totalMovies: totalMovies,
            watchedCount: watchedCount,
            watchlistCount: watchlistCount,
            avgRating: averageRating,
            totalMinutes: totalWatchedMinutes
        }

        return new Response(JSON.stringify(statistics), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

function monthlyStatistics(request) {
    try {
        const data = readData();

        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        let monthlyStats = [];
        for (let movie of data.movies) {
            if (movie.userId == userId) {
                if (movie.status == "Watched") {
                    let allParts = movie.dateWatched.split("-");
                    //måste dubbelkolla att vår type="date" i html skickar in år-månad-dag
                    let year = allParts[0];
                    let month = allParts[1];
                    let monthkey = year + "-" + month;

                    let found = false;
                    for (let stat of monthlyStats) {
                        if (stat.month == monthkey) {
                            stat.count++;
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        monthlyStats.push({
                            month: monthkey,
                            count: 1
                        });
                    }
                }
            }
        }

        return new Response(JSON.stringify(monthlyStats), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

async function postGenres(request) {
    try {
        const data = readData();
        const body = await request.json();

        if (!body.name) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        let genreExists = false;
        for (let genre of data.genre) {
            if (genre.name === body.name) {
                genreExists = true;
                break;
            }
        }

        if (genreExists) {
            return new Response(JSON.stringify({}), {
                status: 409,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        let maxId = 0;
        for (let genre of data.genre) {
            const id = parseInt(genre.id);
            if (id > maxId) {
                maxId = id;
            }
        }

        const newId = `${maxId + 1}`;

        const newGenre = {
            id: newId,
            name: body.name
        }

        data.genre.push(newGenre);
        writeData(data)

        return new Response(JSON.stringify({}), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function deleteGenre(request, id) {
    try {
        const data = readData();
        let found = false;
        const updatedGenres = [];

        for (let i = 0; i < data.genre.length; i++) {
            if (data.genre[i].id == id) {
                found = true;
            } else {
                updatedGenres.push(data.genre[i])
            }
        }

        if (!found) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        let isUsedInMovie = false;
        for (let i = 0; i < data.movies.length; i++) {
            if (data.movies[i].genreId == id) {
                isUsedInMovie = true;
                break;
            }
        }

        //VI MÅSTE kontrollera så att genre inte används i en film innan det kan raderas. 409 betyder conflict :)
        if (isUsedInMovie) {
            return new Response(JSON.stringify({}), {
                status: 409,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        data.genre = updatedGenres;
        writeData(data);

        return new Response(null, {
            status: 204,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function getUserMovieTitles(request) {
    try {
        const data = readData();
        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        const movieTitles = [];
        for (let i = 0; i < data.movies.length; i++) {
            const movie = data.movies[i];
            if (movie.userId === userId) {
                movieTitles.push({
                    id: movie.id,
                    title: movie.title
                });
            }
        }

        return new Response(JSON.stringify(movieTitles), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

}

async function createCustomList(request) {
    try {
        const data = readData();
        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        const body = await request.json();
        if (!body.name) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        let maxId = 0;
        for (let i = 0; i < data.lists.length; i++) {
            const id = parseInt(data.lists[i].id);
            if (id > maxId) { maxId = id };
        }
        const newId = `${maxId + 1}`;

        const newList = {
            id: newId,
            userId: userId,
            name: body.name,
            type: "custom",
            movieIds: []
        }

        data.lists.push(newList);
        writeData(data);

        return new Response(JSON.stringify(newList), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function getAllCustomLists(request) {
    try {

        const data = readData();
        const userId = getUserIdFromSession(request);

        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        const customLists = [];
        for (let i = 0; i < data.lists.length; i++) {
            const list = data.lists[i];
            if (list.userId === userId && list.type == "custom") {
                customLists.push(list);
            }
        }

        return new Response(JSON.stringify(customLists), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function deleteCustomList(request, id) {
    try {
        const data = readData();
        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        let listToDelete = null;
        for (let i = 0; i < data.lists.length; i++) {
            if (data.lists[i].id === id) {
                listToDelete = data.lists[i];
                break;
            }
        }

        if (!listToDelete) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        if (listToDelete.type !== "custom" || listToDelete.userId !== userId) {
            return new Response(JSON.stringify({}), {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const newLists = [];
        for (let i = 0; i < data.lists.length; i++) {
            if (data.lists[i].id !== id) {
                newLists.push(data.lists[i]);
            }
        }
        data.lists = newLists;
        writeData(data);

        return new Response(null, {
            status: 204
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function getMoviesByListId(request, listId) {
    try {
        const data = readData();
        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }

        let targetList = null;
        for (let i = 0; i < data.lists.length; i++) {
            if (data.lists[i].id === listId && data.lists[i].userId === userId) {
                targetList = data.lists[i];
                break;
            }
        }

        if (!targetList) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const moviesInList = [];
        for (let i = 0; i < data.movies.length; i++) {
            const movie = data.movies[i];
            for (let j = 0; j < targetList.movieIds.length; j++) {
                if (movie.id === targetList.movieIds[j]) {
                    moviesInList.push(movie);
                    break;
                }
            }
        }
        return new Response(JSON.stringify(moviesInList), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

export { createMovieReview, getGenres, getMovieById, getMovies, deleteMovieById, patchMovieById, searchFilterMovies, postSignUp, postLogIn, postLogOut, getUserProfile, patchUserProfile, postProfileImage, getUsersStatistics, monthlyStatistics, postGenres, deleteGenre, getUserMovieTitles, createCustomList, getAllCustomLists, deleteCustomList, getMoviesByListId, getUserIdFromSession };


