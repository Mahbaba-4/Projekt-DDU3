const api = new API();
const ui = new UI(api);
ui.showGenres();

const addGenreForm = document.getElementById("add-box-genre");
const deleteGenreForm = document.getElementById("delete-box-genre");

addGenreForm.addEventListener("submit", function (event){
    event.preventDefault();
    ui.addGenre()
})

deleteGenreForm.addEventListener("submit", async function (event){
    event.preventDefault();
    const genreSelect = document.getElementById("genreSelect");
    const genreId = genreSelect.value;

    if(genreId){
        await ui.deleteGenre(genreId);
    }else{
        console.log("Choose a genre to delete")
    }
})