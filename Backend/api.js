function readData() {
    return JSON.parese(Deno.readTextFileSync("./movieDataBase.json"));
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

export {getGenres};