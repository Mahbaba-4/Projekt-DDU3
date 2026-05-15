class API {
    //sign --> ett objekt som tar emot ett objet med 3 nycklar som är {username, email, password};
    async postSignUp(sign) {
        try {
            const response = await fetch ("http://localhost:8000/auth/signup", {
                method: "POST",
                hedares: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sign)
            });

            if(response.ok) {
                window.location.href = "/login.html";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async logIn(email, password){
        try {

        const response = await fetch ("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
            credentials: "include"
        });
            
        if(response.ok){
            window.location.href = "/main-page.html";
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
    } catch (error){
        console.log(error.message);
    }
    }

    async logOut(){
        try {

            const response = await fetch ("http://localhost:8000/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            
            if(response.ok){
                window.location.href = "/login.html"; 
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
        } catch (error){
            console.log(error.message);
        }
    }
}

//http://localhost:8000/



/* async metodNamn(){
    try {

        const response = await fetch ();
            
        if(response.ok){
            const data = await response.json();
            return data;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
    } catch (error){
        console.log(error.message);
    }
} */