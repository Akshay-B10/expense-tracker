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
        const containerDiv = document.querySelector(".container");
        containerDiv.appendChild(document.createTextNode(`Error Code: ${err.response.status}/ Error message: ${err.response.data.message}`));
        setTimeout(() => {
            containerDiv.removeChild(containerDiv.lastChild);
        }, 3000);
    }
};

function getEmailSubmitForm() {
    window.location.href = "../password";
};

// Main code

var baseUrl = "http://localhost:4000"

const btn = document.querySelector(".btn");
btn.addEventListener("click", userLogIn);

document.querySelector("#forgot-password-btn").addEventListener("click", getEmailSubmitForm);