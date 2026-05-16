class UI {
    constructor(apiInstance) {
        this.api = apiInstance;
        this.currentProductId = null;
    }

    signUpForm(){
        const signUpForm = document.getElementById("movieForm");

        signUpForm.addEventListener("submit", async function(e) {e.preventDefault()

            const usernameInput = signUpForm.getElementById("username").value;
            const emailInput = signUpForm.getElementById("email").value;
            const passwordInput = signUpForm.getElementById("password").value;

            if(!username || !email || !password){
                this.showError("Alla fält måste fyllas in");
                return;
            }

            await this.api.postSignUp({username, email, password})
        })
    }
}

