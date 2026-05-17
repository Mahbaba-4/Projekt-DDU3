class UI {
    constructor(apiInstance) {
        this.api = apiInstance;
        this.currentProductId = null;
    }

    showError(message){
        console.log
    }

    signUpForm(){
        const signUpForm = document.getElementById("movieForm");

        signUpForm.addEventListener("submit", async (e) => {e.preventDefault()

            const usernameInput = document.getElementById("username").value;
            const emailInput = document.getElementById("email").value;
            const passwordInput = document.getElementById("password").value;

            if(!usernameInput || !emailInput || !passwordInput){
                console.log("Alla fält måste fyllas in");
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

        logInForm.addEventListener("submit", async (e) => {e.preventDefault()

            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;

            if(!usernameInput || !passwordInput ){
                console.log("Användarnamn och lösenord krävs för att logga in");
                return;
            }

            await this.api.logIn(usernameInput, passwordInput)
        })

    }

    logOutButton(){
        const logOutButton = document.getElementById("logOut");
        if(logOutButton){
            logOutButton.addEventListener("click", async (e) => {
                e.preventDefault();

                alert("Du kommer att loggas ut");
                await this.api.logOut();
            })
        }
    }
}

