// Function to get all data
async function getAllExpenses() {
    try {
        // Token
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/user/get-all-expenses`, {
            headers: {
                "Authorization": token
            }
        });
        const expenses = res.data;
        for (let i = 0; i < expenses.length; i++) {
            displayExpense(expenses[i]);
        };
    } catch (err) {
        console.log(err)
    }
};

// Function to display data using DOM
function displayExpense(expense) {
    // Displaying users
    const li = document.createElement("li");
    li.className = "list-group-item";

    // to access id
    li.setAttribute("value", expense.id);
    li.appendChild(document.createTextNode(`${expense.amount} - ${expense.description} - ${expense.category}`));

    // Add Edit button
    const editBtn = document.createElement("input");
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("value", "Edit");
    editBtn.className = "btn btn-outline-primary mx-2";
    li.appendChild(editBtn);

    // Add Delete button
    const delBtn = document.createElement("input");
    delBtn.setAttribute("type", "button");
    delBtn.setAttribute("value", "Delete");
    delBtn.className = "btn btn-danger";
    li.appendChild(delBtn);
    ul.appendChild(li);
}

// Funtion to add expense
async function addExpense(e) {
    try {
        e.preventDefault()
        const expAmt = document.querySelector("#expAmt");
        const desc = document.querySelector("#desc");
        const category = document.querySelector("#category");
        if (expAmt.value == "" || desc.value == "" || category.value == "") {
            alert("Please fill required details");
        } else {
            // Data storage in mysql server
            const expense = {};
            expense.amount = expAmt.value;
            expense.desc = desc.value;
            expense.category = category.value;

            // Token from local storage
            const token = localStorage.getItem("token");
            const res = await axios.post(`${baseUrl}/user/add-expense`, expense, {
                headers: {
                    "Authorization": token
                }
            });
            displayExpense(res.data);
        }
    } catch (err) {
        console.log(err);
    }
};

// Function to delete expense
async function delExpense(e) {
    try {
        if (e.target.classList.contains('btn-danger')) {
            if (confirm('Are You Sure?')) {
                let li = e.target.parentElement;
                let id = li.getAttribute("value");
                // Token
                const token = localStorage.getItem("token");
                // Remove data from server
                await axios.get(`${baseUrl}/user/delete-expense?id=${id}`, {
                    headers: {
                        "Authorization": token
                    }
                });
                ul.removeChild(li);
            };
        }
    } catch (err) {
        console.log(err);
    }
};

// Function to edit expense
function editExpense(e) {
    if (e.target.classList.contains("btn-outline-primary")) {
        let li = e.target.parentElement;
        let id = li.getAttribute("value");
        // Remove data from server
        axios
            .get(`http://localhost:4000/edit-expense?id=${id}`)
            .then((res) => {
                document.querySelector("#expAmt").value = res.data.amount;
                document.querySelector("#desc").value = res.data.description;
                document.querySelector("#category").value = res.data.category;
                li.parentElement.removeChild(li);
            })
            .catch((err) => console.log(err));
    }
};


// Main Code Starts from here ..
var baseUrl = "http://localhost:4000";

const containerDiv = document.querySelector(".container");
const ul = document.createElement("ul");
ul.className = "list-group";
containerDiv.appendChild(ul);

// Addition of expense
const addBtn = document.querySelector(".btn");
addBtn.addEventListener("click", addExpense);

// Deletion of expense
ul.addEventListener("click", delExpense);

// Edit of expense
ul.addEventListener("click", editExpense);

window.addEventListener("DOMContentLoaded", getAllExpenses);
