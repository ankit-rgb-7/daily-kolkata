const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();
        console.log("Registration form submitted!");


        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        const user = {
            email: email,
            password: password,
            confirm_password: confirmPassword
        };

        fetch("/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(function(response) {
            return response.json().then(function(data) {
                if (!response.ok) {
                    throw new Error(data.detail || "Registration failed");
                }
                return data;
            });
        })
        .then(function(data) {
            alert(data.message);
            window.location.href = "/login";
        })
        .catch(function(error) {
            alert(error.message);
        });

    });

}

console.log("Auth.js loaded successfully!");

if(loginForm){
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const credentials = {
            email : email,
            password : password
        };

        fetch("/users/login", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(credentials)
        })
        .then(function(response){
            return response.json().then(function(data){
                if(!response.ok){
                    throw new Error(data.detail || "Login failed");
                }
                return data;
            })
        })
        .then(function(data) {
            console.log("Login response:", data);

            localStorage.setItem("token", data.access_token);

            console.log("Saved token:", localStorage.getItem("token"));

            window.location.href = "/";
        })
        .catch(function(error) {
            alert(error.message);
        });
    })
}