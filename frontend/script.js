const allActiveTicketList = document.getElementById("all-active-ticket-list");
const myTicketList = document.getElementById("my-ticket-list");
const token = localStorage.getItem("token");
const ticketForm = document.getElementById("ticket-form");
const createTicketBtn = document.getElementById("create-ticket-btn");
const profileEmail = document.getElementById("profile-email");
const profileUserId = document.getElementById("profile-user-id");
const logoutBtn = document.getElementById("logout-btn");

let editingTicketId = null;


function authHeaders() {
    return {
    "Authorization" : "Bearer " + token
    };
}

function loadActiveTickets() {
    fetch("/tickets/active" , {
        method : "GET",
        headers : authHeaders()
    })
    .then(function(response){
        return response.json();
    })
    .then(function(tickets){
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];

            allActiveTicketList.insertAdjacentHTML("beforeend", `
            <div id="active-ticket-${ticket.id}">
            <h3>${ticket.title}</h3>
            <p><strong>Description:</strong> ${ticket.description}</p>
            <div class="ticket-meta">
                <p>Priority: <span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></p>
                <p>Status: <span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></p>
            </div>
        </div>
`);
        }
    })
}


function loadMyTickets(){
    fetch("/tickets/", {
        method : "GET",
        headers : authHeaders()
    })
    .then(function(response){
        return response.json()
    })
    .then(function(tickets){
        myTicketList.innerHTML = "";
        for(let i = 0; i < tickets.length; i++){
            const ticket = tickets[i];

            myTicketList.insertAdjacentHTML("beforeend", `
            <div id="my-ticket-${ticket.id}">
            <h3>${ticket.title}</h3>
            <p><strong>Description:</strong> ${ticket.description}</p>
            <div class="ticket-meta">
                <p>Priority: <span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></p>
                <p>Status: <span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></p>
            </div>
            <button class="delete-btn" onclick="deleteTicket(${ticket.id})">Delete</button>
            <button class ="edit-btn" onclick="editTicket(${ticket.id})">Edit</button>
        </div>
`);
        }
    })
}

if(!token){
    window.location.href = "/login";
}else {
    loadActiveTickets();
    loadMyTickets();
    loadProfile();
}

if(ticketForm){
    ticketForm.addEventListener("submit", function(event){
        event.preventDefault();

        const title = document.getElementById("ticket-title").value;
        const description = document.getElementById("ticket-description").value;
        const priority = document.getElementById("ticket-priority").value;

        const ticket = {
            title: title,
            description: description,
            priority: priority
        };

        fetch("/tickets/", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            },
            body: JSON.stringify(ticket)
        })
        .then(function(response){
            return response.json().then(function(data){
                if(!response.ok){
                    throw new Error(data.detail || "Ticket creation failed");
                }
                return data;
            })
        })
        .then(function(data){
            alert("Ticket created successfully!");
            ticketForm.reset();

            allActiveTicketList.innerHTML = "";
            myTicketList.innerHTML = "";

            loadActiveTickets();
            loadMyTickets();
        })
        .catch(function(error) {
            alert(error.message);
        });
    });
}

function deleteTicket(ticketId) {
    if (confirm("Are you sure you want to delete this ticket?")) {
        fetch("/tickets/" + ticketId, {
            method: "DELETE",
            headers: authHeaders(),
        })
        .then(function(response){
            return response.json().then(function(data){
                if(!response.ok){
                    throw new Error(data.detail || "Unable to delete ticket");
                }
                return data;
            })
        })
        .then(function(data){
            document.getElementById("my-ticket-" + ticketId).remove();
            document.getElementById("active-ticket-" + ticketId).remove();
        })
        .catch(function(error) {
            alert(error.message);
        });
    }
}

function editTicket(ticketId){
    fetch("/tickets/", {
        method: "GET",
        headers: authHeaders()
    })
    .then(function(response){
        return response.json().then(function(data){
            if(!response.ok){
                throw new Error("No ticket");
            }
            return data;
        })
    })
    .then(function(tickets){
        for(let i = 0; i < tickets.length; i++){
            if(tickets[i].id === ticketId){
                const ticket = tickets[i];
                editingTicketId = ticketId;
                const ticketCard = document.getElementById("my-ticket-" + ticketId);
                ticketCard.innerHTML = `
                    <label>Title</label>
                    <input class="edit-field" type="text" id="edit-title-${ticket.id}" value="${ticket.title}">

                    <label>Description</label>
                    <textarea class="edit-field" id="edit-description-${ticket.id}">${ticket.description}</textarea>

                    <label>Priority</label>
                    <select class="edit-field" id="edit-priority-${ticket.id}">
                        <option value="Low" ${ticket.priority === "Low" ? "selected" : ""}>Low</option>
                        <option value="Medium" ${ticket.priority === "Medium" ? "selected" : ""}>Medium</option>
                        <option value="High" ${ticket.priority === "High" ? "selected" : ""}>High</option>
                    </select>

                    <button onclick="saveTicket(${ticket.id})">Save</button>
                    <button onclick="cancelEdit(${ticket.id})">Cancel</button>
                `;
            }
        }
    })
}


function saveTicket(ticketId){
    const title = document.getElementById("edit-title-" + ticketId).value;
    const description = document.getElementById("edit-description-" + ticketId).value;
    const priority = document.getElementById("edit-priority-" + ticketId).value;

    const updatedTicket = {
        title: title,
        description: description,
        priority: priority
    }

    fetch("/tickets/" + ticketId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedTicket)
    })
    .then(function(response){
        return response.json().then(function(data){
            if(!response.ok){
                throw new Error("Cannot update");
            }
            return data;
        });
    })
    .then(function(data) {
        alert("Ticket updated successfully!");

        allActiveTicketList.innerHTML = "";
        myTicketList.innerHTML = "";

        loadActiveTickets();
        loadMyTickets();
    })
    .catch(function(error) {
        alert(error.message);
    });
}


function cancelEdit(ticketId){
    fetch("/tickets/", {
        method: "GET",
        headers: authHeaders()
    })
    .then(function(response){
        return response.json().then(function(data){
            if(!response.ok){
                throw new Error("unable to cancel");
            }
            return data;
        })
    })
    .then(function(tickets){
        for(let i = 0; i < tickets.length; i++){
            if(tickets[i].id === ticketId){
                const ticket = tickets[i];

                const ticketCard = document.getElementById("my-ticket-" + ticketId);

                ticketCard.innerHTML = `
                    <h3>${ticket.title}</h3>
                    <p><strong>Description:</strong> ${ticket.description}</p>
                    <div class="ticket-meta">
                        <p>Priority: <span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></p>
                        <p>Status: <span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></p>
                    </div>
                    <button class="delete-btn" onclick="deleteTicket(${ticket.id})">Delete</button>
                    <button class="edit-btn" onclick="editTicket(${ticket.id})">Edit</button>
                `;
                editingTicketId = null;
            }
        }
    })
    .catch(function(error){
        alert(error.message);
    });
}

createTicketBtn.addEventListener("click", function(){
    if(editingTicketId != null){
        cancelEdit(editingTicketId);
    }
    ticketForm.reset();

    document.getElementById("report-section").scrollIntoView({
        behavior: "smooth"
    });
});

function loadProfile(){
    fetch("/users/me", {
        method: "GET",
        headers: authHeaders()
    })
    .then(function(response){
        return response.json().then(function(data){
            if(!response.ok){
                throw new Error("Not available");
            }
            return data;
        })
    })
    .then(function(data){
        profileEmail.textContent = data.email;
        profileUserId.textContent = data.id;
    })
}

logoutBtn.addEventListener("click", function(){
    if(confirm("Do you want to Logout?")){
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
})