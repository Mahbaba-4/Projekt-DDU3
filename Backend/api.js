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

        let targetList = null;
        for (let i = 0; i < data.lists.length; i++) {
            if (data.lists[i].type === body.status) {
                targetList = data.lists[i].id;

                if (!targetList.movieIds) {
                    targetList.movieIds = [];
                }

                targetList.movieIds.push(newId);
                break;
            }
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

            const newMovie = {
                id: newId,
                title: body.title,
                year: body.year,
                genreId: genreId,
                genre: body.genre,
                director: body.director,
                runtime: body.runtime,
                posterUrl: body.posterUrl,
                description: body.description,
                status: body.status,
                rating: body.rating || null,
                dateWatched: body.dateWatched || null,
                listId: targetListId
            };

            data.movies.push(newMovie);

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
            const newMovies = [];

            for (let i = 0; i < data.movies.length; i++) {
                if (data.movies[i].id !== id) {
                    newMovies.push(data.movies[i]);
                } else {
                    found = true;
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

    function getMovies(request) {
        try {
            const data = readData();
            let movies = data.movies;

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

    export { createMovieReview, getGenres, getMovieById, getMovies, deleteMovieById };

