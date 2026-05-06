function readData() {
    return JSON.parese(Deno.readTextFileSync("./movieDataBase.json"));
}

