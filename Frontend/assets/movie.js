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

            if(!usernameInput || !emailInput || !passwordInput){
                this.showError("Alla fält måste fyllas in");
                return;
            }

            await this.api.postSignUp({
                username: usernameInput,
                email: emailInput, 
                password: passwordInput
            })
        })
    }

    logInForm(){
        const logInForm = document.getElementById("movieForm");

        logInForm.addEventListener("submit", async function(e) {e.preventDefault()

            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;

            if(!username || !password){
                this.showError("Användarnamn och lösenord krävs för att logga in");
                return;
            }

            await this.api.logIn(usernameInput, passwordInput)
        })

    }
}

