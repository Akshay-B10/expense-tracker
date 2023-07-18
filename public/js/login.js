async function userLogIn(event) {
    try {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const res = await axios.post(`${baseUrl}/user/login`, {
            email: email,
            password: password
        });
        console.log(res);
        window.location.href = "../user/home";
    } catch (err) {
        const form = document.querySelector("form");
        form.appendChild(document.createTextNode(`Error Code: ${err.response.status}/ Error message: ${err.response.data.message}`));
        setTimeout(() => {
            form.removeChild(form.lastChild);
        }, 3000);
    }
};

var baseUrl = "http://localhost:4000"

const btn = document.querySelector(".btn");

btn.addEventListener("click", userLogIn);