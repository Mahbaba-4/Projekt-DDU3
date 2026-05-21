const api = new API();
const ui = new UI(api);
ui.filteredMovies(); 
ui.logOut(); 
ui.showGenres(); 



const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.addEventListener("click", function() {
       ui.searchMovies(); 
    });
}