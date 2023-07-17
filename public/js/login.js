async function userLogIn(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const res = await axios.post(`${baseUrl}/user/login`, {
        email: email,
        password: password
    });
    if (res.data.id) {
        alert("User logged in");
    } else {
        alert(res.data);
    }
}
var baseUrl = "http://localhost:4000"

const btn = document.querySelector(".btn");

btn.addEventListener("click", userLogIn);