const watchedExtra = document.getElementById('watchedExtra');
const stars = document.querySelectorAll('.rating-stars span');
const statusSelect = document.getElementById('statusSelect');
const ratingInput = document.getElementById('rating');


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
            } else {
                stars[c].innerHTML = "☆";
                stars[c].style.color = "#101010";
            }
        }
    });
}

//INTE KLAR!