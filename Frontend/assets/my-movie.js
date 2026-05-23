const api = new API();
const ui = new UI(api);
ui.filteredMovies();
ui.logOut();
ui.showGenres();
ui.getUserGenre();

async function select () {
    const listsSelect = document.getElementById("custom-lists");
    if (listsSelect) {
        const lists = await api.getAllCustomLists();
        console.log("Lists found:", lists);

        listsSelect.innerHTML = '<option value="">My Lists</option>';

        for (let list of lists) {
            const option = document.createElement("option");
            option.value = list.id;
            option.textContent = list.name;
            listsSelect.appendChild(option);
        }

        listsSelect.addEventListener("change", function () {
            const listId = listsSelect.value;
            if (listId) {
                ui.showMovieInList(listId);
            } else {
                ui.filteredMovies();
            }
        });
    }
}
select()

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.addEventListener("click", function () {
        ui.searchMovies();
    });
}
