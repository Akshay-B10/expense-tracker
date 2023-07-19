async function onSubmit(event) {
    try {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (name === "" || email === "" || password === "") {
            alert("Enter required field");
        } else {
            const userDetails = {};
            userDetails.name = name;
            userDetails.email = email;
            userDetails.password = password;

            const response = await axios.post(`${baseUrl}/add-user`, userDetails);
            /*
            if (response.data === "Email already exist" || response.data === "Please fill required credentials") {
                alert(response.data);
            }
            */
            alert(response.data.message);
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        }
    } catch (err) {
        alert(err.response.data);
    }
};

var baseUrl = "http://localhost:4000";

const btn = document.querySelector(".btn");

btn.addEventListener("click", onSubmit);
