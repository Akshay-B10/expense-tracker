async function forgotPassword(event) {
    try {
        event.preventDefault();
        const email = document.getElementById("email").value;
        await axios.post(`${baseUrl}/password/forgot-password`, {
            email: email
        });
    } catch (err) {
        alert(err.response.data);
    }
};

//Main code
var baseUrl = "http://localhost:4000";

document.querySelector(".btn").addEventListener("click", forgotPassword);