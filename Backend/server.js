
import { createMovieReview, getGenres, getMovieById, getMovies, deleteMovieById, patchMovieById, searchFilterMovies, postSignUp, postLogIn, postLogOut, getUserProfile, patchUserProfile, postProfileImage, getUsersStatistics, monthlyStatistics, getUserMovieTitles, createCustomList, getAllCustomLists, deleteCustomList, getMoviesByListId } from "./api.js";

const movieByIdRoute = new URLPattern({ pathname: "/user/movies/:id" });
const genreByIdRoute = new URLPattern({ pathname: "/movie/genre/:id" })
const listByIdRoute = new URLPattern({ pathname: "/user/lists/:id" })


function handler(request) {
    let url = new URL(request.url);

        if (url.pathname == "/auth/signup" && request.method === "POST") {
        return postSignUp(request)
    }

    if (url.pathname === "/auth/login" && request.method === "POST") {
        return postLogIn(request);
    }

    if (url.pathname === "/auth/logout" && request.method === "POST") {
        return postLogOut(request)
    }

    /*  if (/* kolla om den cookien som dom skickade finns och är aktiv cookie ){
        return new Response(JSON.stringify({}), {
            status: 401
        })
    }*/

    if (url.pathname == "/") {
        // const userCookie = request.headers.get("Cookie");
        // for (let cookie of cookies) {
        //     if (cookie.value.includes(userCookie)) {
        //         const userId = cookie.userId;
        //         // ..  nu vet vi vem det är
        //         // visa rätt HTMLsida

        return serveFile(request, "main-page.html");
        //     }
        // }
    }

  



    if (url.pathname === "/user/profile" && request.method === "GET") {
        return getUserProfile(request);
    }

    if (url.pathname === "/user/profile" && request.method === "PATCH") {
        return patchUserProfile(request);
    }

    if (url.pathname === "/user/profile/image" && request.method === "POST") {
        return postProfileImage(request);
    }

    if (url.pathname === "/user/statistics" && request.method === "GET") {
        return getUsersStatistics(request);
    }

    if (url.pathname === "/user/statistics/monthly" && request.method === "GET") {
        return monthlyStatistics(request);
    }

    if (request.method === "GET") {
        if (request.headers.get("Accept") !== "application/json") {
            return new Response(JSON.stringify({}), {
                status: 406,
            })
        }
    }

    if (request.method === "POST") {
        if (request.headers.get("Content-Type") !== "application/json") {
            return new Response(JSON.stringify({}), {
                status: 406,
            })
        }
    }

    if (url.pathname === "/user/lists" && request.method === "GET") {
        return getAllCustomLists(request);
    }

    if (url.pathname === "/user/lists" && request.method === "POST") {
        return createCustomList(request);
    }

    let listMatch = listByIdRoute.exec(request.url);

    if (listMatch && request.method === "GET") {
        let id = listMatch.pathname.groups.id;
        return getMoviesByListId(request, id);
    }

    if (listMatch && request.method === "DELETE") {
        let id = listMatch.pathname.groups.id;
        return deleteCustomList(request, id);
    }

    if (url.pathname === "/user/movies/title" && request.method === "GET") {
        return getUserMovieTitles(request);
    }

    if (url.pathname === "/movies/genre" && request.method === "GET") {
        return getGenres(request);
    }

    if (url.pathname === "/movies/genre" && request.method === "POST") {
        return postGenres(request);
    }

    if (url.pathname == "/user/movies" && request.method === "GET") {
        return getMovies(request);
    }

    if (url.pathname == "/user/movies" && request.method == "POST") {
        return createMovieReview(request);
    }

    if (url.pathname == "/user/movies/search" && request.method === "GET") {
        return searchFilterMovies(request);
    }

    let genreMatch = genreByIdRoute.exec(request.url);
    if (genreMatch && request.method === "DELETE") {
        let id = genreMatch.pathname.groups.id;
        return deleteGenre(request, id);
    }

    let movieMatch = movieByIdRoute.exec(request.url);
    if (movieMatch && request.method === "GET") {
        let id = movieMatch.pathname.groups.id;
        return getMovieById(request, id);
    }

    if (movieMatch && request.method === "DELETE") {
        let id = movieMatch.pathname.groups.id;
        return deleteMovieById(request, id)
    }

    if (movieMatch && request.method === "PATCH") {
        let id = movieMatch.pathname.groups.id;
        return patchMovieById(request, id);
    }

    return new Response(JSON.stringify({}), {
        status: 404,
    })

}

Deno.serve(handler);