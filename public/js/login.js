async function userLogIn(event) {
    try {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const res = await axios.post(`${baseUrl}/user/login`, {
            email: email,
            password: password
        });
        localStorage.setItem("token", res.data.token);
        window.location.href = "../user/home";
    } catch (err) {
        const form = document.querySelector("form");
        document.querySelector(".container").appendChild(document.createTextNode(`Error Code: ${err.response.status}/ Error message: ${err.response.data.message}`));
        setTimeout(() => {
            document.querySelector(".container").removeChild(document.querySelector(".container").lastChild);
        }, 3000);
    }
};

function getEmailSubmitForm() {
    window.location.href = "../password";
};

// Main code

var baseUrl = "http://52.87.50.226"

const btn = document.querySelector(".btn");
btn.addEventListener("click", userLogIn);

document.querySelector("#forgot-password-btn").addEventListener("click", getEmailSubmitForm);