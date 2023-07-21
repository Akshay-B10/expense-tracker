async function submitNewPassword(event) {
    try {
        event.preventDefault();
        const password = document.getElementById("password").value;
        if (password == "") {
            return alert("Please fill required credentials");
        }
        console.log("hello");
        const token = localStorage.getItem("token");
        const res = await axios.post(`${baseUrl}/password/reset-password/update`, {
            password: password
        }, {
            headers: {
                "Authorization": token
            }
        });
        alert(res.data.message);
    } catch (err) {
        alert("Something went wrong");
    }
};

// Main code
var baseUrl = "http://localhost:4000";

document.querySelector(".btn").addEventListener("click", submitNewPassword);