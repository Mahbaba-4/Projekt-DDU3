const api = new API();
const ui = new UI(api);
ui.loadRecentlyAdded(); 
ui.getMoviesById();
ui.logOut(); 
