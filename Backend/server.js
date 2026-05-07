import { createMovieReview, getGenres, getMovieById, getMovies, deleteMovieById } from "./api.js";

function handler(request) {
    let url = new URL(request.url);

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
                "Access-Control-Max-Age": "86400"
            }
        })
    }

    if (request.headers.get("Authorization") !== "Bearer 780be64f-1fa4-477a-949a-ab3270c31be6") {
        return new Response(JSON.stringify({}), {
            status: 401,
            headers: { "Access-Control-Allow-Orgin": "*" }
        })
    }

    if (request.headers.get("Accept") !== "application/json" || request.headers.get("Content-Type") !== "application/json") {
        return new Response(JSON.stringify({}), {
            status: 406,
            headers: { "Access-Control-Allow-Orgin": "*" }
        })
    } 

    if (url.pathname === "/movies/genre" && request.method === "GET") {
        return getGenres(request);
    }

    if(url.pathname == "/user/movies" && request.method === "GET") {
        return getMovies(request);
    }

    if (url.pathname == "/user/movies" && request.method == "POST") {
        return createMovieReview(request);
    }

    if (url.pathname == "/user/movies/:id" && request.method == "DELETE") {
        return getMovieById(request);
    }



    return new Response(JSON.stringify({}), {
        status: 404,
        headers: { "Access-Control-Allow-Orgin": "*" }
    })
}

Deno.serve(handler);