const api = new API();
const ui = new UI(api);

ui.showMoviesAndLists();

const createListForm = document.getElementById("createListForm");
createListForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const listName = document.getElementById("listName").value;

    const selectedMovies = [];
    const checkboxes = document.querySelectorAll("#moviesCheckboxes input:checked");
    for (let checkbox of checkboxes) {
        selectedMovies.push(checkbox.value);
    }

    await ui.createLists(listName, selectedMovies);

    document.getElementById("listName").value = "";
    const allCheckboxes = document.querySelectorAll("#moviesCheckboxes input");
    for (let checkbox of allCheckboxes) {
        checkbox.checked = false;
    }
});

