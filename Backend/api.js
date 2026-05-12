import { extname } from "jsr:@std/path";

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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });


        }

        return new Response(JSON.stringify(movie), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });



    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        if (!body.title || !body.year || !body.genre || !body.director || !body.runtime || !body.posterUrl || !body.description || !body.status) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        if (body.status === "Watched" && body.rating === undefined && body.dateWatched === undefined) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
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
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                    "Content-Type": "application/json",
                    "Acces-Control-Allow-Origin": "*"
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

        return new Response(null, { status: 204 })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        if (body.title) {
            movieToUpdate.title = body.title;
        }
        if (body.year) {
            movieToUpdate.year = body.year;
        }

        //SAMMA SOM I createMovieReview för genre :)
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
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

function getMovies(request) {
    try {
        const data = readData();
        let movies = data.movies;

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
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                });
            }
        }

        return new Response(JSON.stringify(movies), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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

        let watchList = {
            id: "" + nextId,
            userId: userId,
            name: "Want to watch",
            type: "WatchList",
            movieIds: []
        }

        let watched = {
            id: "" + (nextId + 1),
            userId: userId,
            name: "Already Watched",
            type: "Watched",
            movieIds: []
        }

        data.lists.push(watchList);
        data.lists.push(watched);
        writeData(data);
    }

}

function ownTokenGenerator(){
    return "Bearer" + crypto.randomUUID();
}

async function postSignUp(request) {
    try {
        const data = readData();
        const body = await request.json();

        if (!body.email || !body.password) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
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
                    "Content-Type": "application/json",
                    "Acess-Control-Allow-Origin": "*"
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
            token: ownTokenGenerator(),
        }

        data.users.push(newUser);
        writeData(data);

        postDefaultListsForUser(newUser.id);

        let userWithoutPassword = {
            id: newUser.id,
            email: newUser.email
        }

        return new Response(JSON.stringify(userWithoutPassword), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
}

async function postLogIn(request) {
    try {
        const data = readData();
        const body = await request.json();
        console.log("Recived body:", body);
        console.log("Users in databse:", data.users)

        if (!body.email || !body.password) {
            return new Response(JSON.stringify({}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            })
        }

        if (!data.users) {
            data.users = [];
        }

        let foundUser = null;
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].email === body.email && data.users[i].passwordHash === body.password) {
                foundUser = data.users[i];
                break;
            }
        }

        if (!foundUser) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            })
        }

        console.log("Found user", foundUser)

        if (!data.sessions) {
            data.sessions = [];
        }

        let newSessions = [];
        for (let i = 0; i < data.sessions.length; i++) {
            if (data.sessions[i].userId !== foundUser.id) {
                newSessions.push(data.sessions[i]);
            }
        }
        data.sessions = newSessions;

        let maxId = 0;
        for (let session of data.sessions) {
            const id = parseInt(session.id);
            if (id > maxId) {
                maxId = id
            }
        }
        let newSessionId = `${maxId + 1}`;

        let newSession = {
            id: newSessionId,
            userId: foundUser.id,
        }

        data.sessions.push(newSession);
        writeData(data);

        let userWithoutPasswordForLogIn = {
            id: foundUser.id,
            email: foundUser.email,
        }

        return new Response(JSON.stringify(userWithoutPasswordForLogIn), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Set-Cookie": "sessionId=" + newSessionId + "; Max-Age=86400; Path=/"
            }
        })

    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
}

function postLogOut(request) {
    try {
        const data = readData();
        const cookieHeader = request.headers.get("Cookie");

        if (!cookieHeader) {
            return new Response(JSON.stringify({}), {
                status: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
        }

        const cookieHeaderSplitInParts = cookieHeader.split("=");
        const sessionId = cookieHeaderSplitInParts[1]

        let found = false;
        let newSessions = [];

        for (let i = 0; i < data.sessions.length; i++) {
            if (data.sessions[i].id == sessionId) {
                found = true;
            } else {
                newSessions.push(data.sessions[i])
            }
        }

        if (!found) {
            return new Response(JSON.stringify({}), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            })
        }

        data.sessions = newSessions;
        writeData(data);

        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Set-Cookie": "sessionId=; Max-Age=0; Path=/"
            }
        })
    } catch (err) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
}

function getUserIdFromSession(request) {
    const data = readData();
    const cookieHeader = request.headers.get("Cookie");

    if (!cookieHeader) {
        return null;
    }

    const cookieHeaderSplit = cookieHeader.split("=");
    let sessionId = null;

    if (cookieHeaderSplit[0] === "sessionId") {
        sessionId = cookieHeaderSplit[1];
    }

    if (!sessionId) {
        return null;
    }

    for (let i = 0; i < data.sessions.length; i++) {
        if (data.sessions[i].id === sessionId) {
            return data.sessions[i].userId;
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
                status: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
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
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                status: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
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
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });


    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        const formData = await request.formData();
        const imageFile = formData.get("image");

        if (!imageFile) {
            return new Response(JSON.stringify({ error: "No image file provided" }), {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (imageFile.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({ error: "File too large" }), {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        const extension = extname(imageFile.name);

        const uniqueName = crypto.randomUUID();
        const newFilename = uniqueName + extension;

        const bytes = await imageFile.bytes();

        try {
            await Deno.mkdir("./uploads/profile-images", { recursive: true });
        } catch (error) {
            console.log("Error");
        }


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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

async function deleteProfileImage(request) {
    try {

        const userId = getUserIdFromSession(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Not logged in" }), {
                status: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        const data = readData();
        let user = null;
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === userId) {
                user = data.users[i];
                break;
            }
        }

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        if (user.profileImage && user.profileImage.substring(0, 9) === "/uploads/") {
            const filePath = `.${user.profileImage}`;
            try {
                await Deno.remove(filePath);
            } catch (error) {
                console.log("Could not remove image:", error);
            }
        }

        user.profileImage = null;
        writeData(data);

        return new Response(null, {
            status: 204,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });



    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

export { createMovieReview, getGenres, getMovieById, getMovies, deleteMovieById, patchMovieById, searchFilterMovies, postSignUp, postLogIn, postLogOut, getUserProfile, patchUserProfile, postProfileImage, deleteProfileImage };

