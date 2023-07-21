async function forgotPassword(event) {
    try {
        event.preventDefault();
        const email = document.getElementById("email").value;
        if (email == "") {
            return alert("Please fill required credentials");
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(`${baseUrl}/password/forgot-password`, {
            email: email
        }, {
            headers: {
                "Authorization": token
            }
        });
        alert(res.data.message);
    } catch (err) {
        alert(err.response.data);
    }
};

//Main code
var baseUrl = "http://localhost:4000";

document.querySelector(".btn").addEventListener("click", forgotPassword);