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
        if (!res.data.isPremium) {
            rzpBtn.style.display = "block";
        } else {
            rzpBtn.nextElementSibling.style.display = "inline-block";

            // Displaying show leaderboard button (Premium Feature)
            const leaderboardBtn = document.getElementById("leaderboard-btn");
            leaderboardBtn.style.display = "inline-block";
            leaderboardBtn.addEventListener("click", showLeaderboard);

            document.getElementById("download-report").disabled = false;
            document.getElementById("download-report").addEventListener("click", downloadReport); // Download report functional
            pagination();
            
            selectEle.parentElement.style.display = "block";
            selectEle.addEventListener("change", setDownloadsPerPage);
        }
        const expenses = res.data.expenses;
        for (let i = 0; i < expenses.length; i++) {
            displayExpense(expenses[i]);
        };
        

    } catch (err) {
        console.log(err)
    }
};

// Function to display data using DOM
function displayExpense(expense) {
    // Displaying expense
    const li = document.createElement("li");
    li.className = "list-group-item";

    // to access id
    li.setAttribute("value", expense._id);
    li.appendChild(document.createTextNode(`${expense.amount} - ${expense.description} - ${expense.category}`));

    // Add Delete button
    const delBtn = document.createElement("input");
    delBtn.setAttribute("type", "button");
    delBtn.setAttribute("value", "Delete");
    delBtn.className = "btn btn-danger mx-3";
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
            if (rzpBtn.style.display === "none" && containerDiv.lastElementChild.lastElementChild.classList.contains("list-group-item-light")) {
                if (containerDiv.lastElementChild.className === "list-group") {
                    containerDiv.removeChild(containerDiv.lastElementChild);
                }
                helperToShowLeaderboard();
            }
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
                if (rzpBtn.style.display === "none" && containerDiv.lastElementChild.lastElementChild.classList.contains("list-group-item-light")) {
                    if (containerDiv.lastElementChild.className === "list-group") {
                        containerDiv.removeChild(containerDiv.lastElementChild);
                    }
                    helperToShowLeaderboard();
                }
            };
        }
    } catch (err) {
        console.log(err);
    }
};

function setDownloadsPerPage() {
    localStorage.setItem("rowsPerPage", selectEle.value);
    pagination();
}

function pageButton(lastPage, prevPage, currentPage, nextPage) {
    const downloadDiv = document.querySelector("#download-div");
    if (prevPage >= 1) {
        const ppBtn = document.createElement("input");
        ppBtn.setAttribute("type", "button");
        ppBtn.setAttribute("value", prevPage);
        ppBtn.className = "btn btn-outline-light btn-sm mx-3";
        ppBtn.addEventListener("click", helperPagination);
        downloadDiv.appendChild(ppBtn);
    }
    const cpBtn = document.createElement("input");
    cpBtn.setAttribute("type", "button");
    cpBtn.setAttribute("value", currentPage);
    cpBtn.className = "btn btn-outline-light btn-md";
    downloadDiv.appendChild(cpBtn);
    if (nextPage <= lastPage) {
        const npBtn = document.createElement("input");
        npBtn.setAttribute("type", "button");
        npBtn.setAttribute("value", nextPage);
        npBtn.className = "btn btn-outline-light btn-sm mx-3";
        npBtn.addEventListener("click", helperPagination);
        downloadDiv.appendChild(npBtn);
    }
};

function helperPagination(event) {
    const page = event.target.getAttribute("value");
    pagination(page);
};

async function pagination(pageNo) {
    while (downloadUl.nextElementSibling) {
        downloadUl.nextElementSibling.removeEventListener("click", helperPagination);
        downloadUl.nextElementSibling.remove();
    }
    while (downloadUl.firstElementChild) {
        downloadUl.firstElementChild.remove();
    }
    const token = localStorage.getItem("token");
    const rowsPerPage = localStorage.getItem("rowsPerPage");
    const res = await axios.get(`${baseUrl}/user/downloads?page=${pageNo || 1}&rowsPerPage=${rowsPerPage || 1}`, {
        headers: {
            "Authorization": token
        }
    });
    if (res.data.total === 0) {
        return;
    }

    // Downloads UI
    const downloads = res.data.downloads;
    for (let i = 0; i < downloads.length; i++) {
        showDownload(downloads[i]);
    }

    // Page buttons UI
    const { lastPage, prevPage, currentPage, nextPage } = res.data;
    pageButton(lastPage, prevPage, currentPage, nextPage);
};

function showDownload(download) {
    if (downloadUl.previousElementSibling.style.display == "none") {
        downloadUl.previousElementSibling.style.display = "block";
    }
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-info";
    li.setAttribute("value", download.id);
    li.appendChild(document.createTextNode(`${download.createdAt.slice(0, 10)}`));

    // Show download button
    const delBtn = document.createElement("input");
    delBtn.setAttribute("type", "button");
    delBtn.setAttribute("value", "download");
    delBtn.className = "btn btn-outline-light btn-sm mx-3";
    li.appendChild(delBtn);

    downloadUl.appendChild(li);
};

async function downloadPrevReport(event) {
    if (event.target.classList.contains("btn-outline-light")) {
        const li = event.target.parentElement;
        const id = li.getAttribute("value");
        const res = await axios.get(`${baseUrl}/user/prev/download?id=${id}`);
        const a = document.createElement("a");
        a.href = res.data.fileUrl;
        a.download = "expense.csv";
        a.click();
    }
};

async function downloadReport(event) {
    try {
        event.preventDefault();
        const res = await axios.get(`${baseUrl}/user/download`, {
            headers: {
                "Authorization": token
            }
        });
        if (res.status == 201) {
            const a = document.createElement("a");
            a.href = res.data.fileUrl;
            a.download = "expense.csv";
            a.click();

            // Show in downloads
            showDownload(res.data.download);
        } else {
            throw (res.data.message);
        }
    } catch (err) {
        console.log(err);
    }
};

// Function for Premium Payment
async function buyPremium(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}/buy/premium-membership`, {
        headers: {
            "Authorization": token
        }
    });
    // response contains order object and key_id
    let options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (res) {
            await axios.post(`${baseUrl}/buy/update-transaction-status`, {
                orderId: options.order_id,
                paymentId: res.razorpay_payment_id
            }, {
                headers: {
                    "Authorization": token
                }
            });
            alert("Congratulations, You are premium user.");
            rzpBtn.style.display = "none";
            rzpBtn.nextElementSibling.style.display = "inline-block";
            const leaderboardBtn = document.getElementById("leaderboard-btn");
            leaderboardBtn.style.display = "inline-block";
            leaderboardBtn.addEventListener("click", showLeaderboard);

            document.getElementById("download-report").disabled = false;
            document.getElementById("download-report").addEventListener("click", downloadReport); // Download Functional
        }
    };
    let instance = new Razorpay(options);
    instance.open();
    event.preventDefault();
    instance.on("payment.failed", (err) => {
        console.log(err); // Some error while payment
        alert("Something went wrong");
    });
};

// Function Show Leaderboard
function showLeaderboard(event) {
    event.preventDefault();
    helperToShowLeaderboard();
};

async function helperToShowLeaderboard() {
    if (!ul.nextElementSibling) {
        const leaderboardHead = document.createElement("h2");
        leaderboardHead.appendChild(document.createTextNode("Leaderboard"));
        containerDiv.appendChild(leaderboardHead);
    }
    const leaderboardUl = document.createElement("ul");
    leaderboardUl.className = "list-group";
    containerDiv.appendChild(leaderboardUl);
    const res = await axios.get(`${baseUrl}/user/premium/show-leaderboard`);
    const users = res.data;
    // users --> array of objects contains name and their total amount
    for (let i = 0; i < users.length; i++) {
        const userLi = document.createElement("li");
        userLi.className = "list-group-item list-group-item-light";
        userLi.appendChild(document.createTextNode(`Name: ${users[i].name} Total Amount: ${users[i].totalAmount || 0}`));
        leaderboardUl.appendChild(userLi);
    };
    document.getElementById("leaderboard-btn").removeEventListener("click", showLeaderboard);
};

// Main Code Starts from here ..
var baseUrl = "http://localhost:4000";
const token = localStorage.getItem("token");

const containerDiv = document.querySelector("#main-div");
const ul = document.createElement("ul");
ul.className = "list-group";
containerDiv.appendChild(ul);

// Addition of expense
const addBtn = document.querySelector("#add-btn");
addBtn.addEventListener("click", addExpense);

// Deletion of expense
ul.addEventListener("click", delExpense);

// Buy Premium
const rzpBtn = document.querySelector("#rzp-btn");
rzpBtn.addEventListener("click", buyPremium);

// For downloads
const downloadUl = document.querySelector("#download-div").lastElementChild;
downloadUl.addEventListener("click", downloadPrevReport);

// Previous downloads per page (Premium)
const selectEle = document.querySelector("#rows-per-page");
selectEle.value = localStorage.getItem("rowsPerPage") || 1;

window.addEventListener("DOMContentLoaded", getAllExpenses);
