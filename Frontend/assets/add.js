const api = new API();
const ui = new UI(api);
ui.showGenres();

const watchedExtra = document.getElementById("watchedExtra");
const stars = document.querySelectorAll(".rating-stars span");
const statusSelect = document.getElementById("statusSelect");
const ratingInput = document.getElementById("rating");
// const addGenreForm = document.getElementById("add-box-genre");

// addGenreForm.addEventListener("submit", function (event){
//     ui.addGenre(event)
// })

statusSelect.addEventListener("click", function () {
    if (statusSelect.value === 'Watched') {
        watchedExtra.style.display = "block";
    } else {
        watchedExtra.style.display = "none";
    }
});

for (let i = 0; i < stars.length; i++) {
    stars[i].addEventListener("click", function () {
        const val = i + 1;
        ratingInput.value = val;

        for (let c = 0; c < stars.length; c++) {
            if (c < val) {
                stars[c].innerHTML = "★";
                stars[c].style.fontSize = "30px";
                stars[c].style.color = "#DB2424";
            } else {
                stars[c].innerHTML = "☆";
                stars[c].style.color = "#DB2424";
            }
        }
    });
}



//INTE KLAR!