const api = new API();
const ui = new UI(api);
ui.getUserGenreDelete();

const addGenreForm = document.getElementById("add-box-genre");
const deleteGenreForm = document.getElementById("delete-box-genre");

addGenreForm.addEventListener("submit", function (event){
    event.preventDefault();
    ui.addGenre()
})

deleteGenreForm.addEventListener("submit", async function (event){
    event.preventDefault();
    const genreDelete = document.getElementById("genreDelete");
    const genreId = genreDelete.value;

    if(genreId){
        await ui.deleteGenre(genreId);
    }else{
        console.log("Choose a genre to delete")
    }
})