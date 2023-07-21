async function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    axios.post(`${baseUrl}/password/forgot-password`, {
        email: email
    });
};

//Main code
var baseUrl = "http://localhost:4000";

document.querySelector(".btn").addEventListener("click", forgotPassword);