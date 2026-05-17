document.addEventListener("DOMContentLoaded", function () {
    const api = new API();
    const ui = new UI(api);
    ui.signUpForm();
});
