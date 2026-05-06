function readData() {
    return JSON.parse(Deno.readTextFileSync("./movieDataBase.json"));

}

//Det är enklare att använda en funktion som skriver över datan vid PATCH OCH POST :)
function writeData(data) {
    Deno.writeTextFileSync("./movieDataBase.json", JSON.stringify(data, null, 2));

}

function getGenres(request) {
    try {
        const data = readData();
        let genres = data.genre;

        console.log("Genres hämtade:", genres);
        console.log("Antal genres:", genres.length);

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
    if (request.headers.get("Content-Type") == "application/json") {
        try {
            const body = await request.json();

            if (!body.title || !body.year || !body.genre || !body.director || !body.runtime || !body.posterUrl || !body.description || !body.status) {
                return new Response(JSON.stringify({ error: "Bad Request - Missing required fields" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                });
            }


            const db = readData();

            let maxId = 0;

            for (let movie of db.movies) {
                const id = parseInt(movie.id);
                if (id > maxId) maxId = id;
            }

            let newId = maxId + 1;

            let genreId = null;
            for (let genre of db.genre) {
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
                status: body.status
            };

            db.movies.push(newMovie);

            writeData(db);

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
    } else {
        return new Response("Invalid Content Type", {
            status: 406,
            headers: { "Access-Control-Allow-Origin": "*" }
        })
    }
}

export { createMovieReview, getGenres };

