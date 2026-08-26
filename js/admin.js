const contactCount = document.querySelector("#contact-count");
const backendStatus = document.querySelector("#backend-status");
const contactTableBody = document.querySelector("#contact-table-body");
const dashboardMessage = document.querySelector("#dashboard-message");
const refreshButton = document.querySelector("#refresh-button");

function createTableCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

function displayContacts(contacts) {
    contactTableBody.textContent = "";

    if (contacts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No enquiries have been submitted.";
        row.appendChild(cell);
        contactTableBody.appendChild(row);

        return;
    }

    contacts.forEach(function (contact) {
        const row = document.createElement("tr");

        row.appendChild(createTableCell(contact.id));
        row.appendChild(createTableCell(contact.name));
        row.appendChild(createTableCell(contact.email));
        row.appendChild(createTableCell(contact.interest));
        row.appendChild(createTableCell(contact.message));
        row.appendChild(createTableCell(contact.created_at));

        contactTableBody.appendChild(row);
    });
}

async function loadContacts() {
    dashboardMessage.textContent = "Loading enquiries...";
    refreshButton.disabled = true;

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/contacts"
        );

        if (!response.ok) {
            throw new Error("The backend returned an error.");
        }

        const result = await response.json();

        contactCount.textContent = result.total;
        backendStatus.textContent = "Online";
        dashboardMessage.textContent = "";

        displayContacts(result.contacts);
    } catch (error) {
        backendStatus.textContent = "Offline";
        dashboardMessage.textContent =
            "The records could not be loaded. Make sure Flask is running.";

        console.error(error);
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", loadContacts);

loadContacts();