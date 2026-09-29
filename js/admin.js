const contactCount = document.querySelector("#contact-count");
const backendStatus = document.querySelector("#backend-status");
const contactTableBody = document.querySelector("#contact-table-body");
const dashboardMessage = document.querySelector("#dashboard-message");
const refreshButton = document.querySelector("#refresh-button");
const mostRequested = document.querySelector("#most-requested");
const interestChart = document.querySelector("#interest-chart");


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


function formatInterest(interest) {
    const interestNames = {
        "creative-media": "Creative media",
        "artificial-intelligence": "Artificial intelligence",
        "oracle-database": "Oracle database services",
        "digital-product": "Digital product development"
    };

    return interestNames[interest] || interest;
}


function displayAnalytics(analytics) {
    interestChart.textContent = "";

    if (analytics.by_interest.length === 0) {
        interestChart.textContent =
            "No analytics are available yet.";

        mostRequested.textContent = "No data";
        return;
    }

    mostRequested.textContent =
        formatInterest(analytics.most_requested);

    const largestTotal = analytics.by_interest[0].total;

    analytics.by_interest.forEach(function (item) {
        const barItem = document.createElement("div");
        const label = document.createElement("div");
        const track = document.createElement("div");
        const fill = document.createElement("div");
        const value = document.createElement("div");

        barItem.className = "bar-item";
        label.className = "bar-label";
        track.className = "bar-track";
        fill.className = "bar-fill";
        value.className = "bar-value";

        label.textContent = formatInterest(item.interest);
        value.textContent = item.total;

        const percentage =
            (item.total / largestTotal) * 100;

        fill.style.width = `${percentage}%`;

        track.appendChild(fill);
        barItem.appendChild(label);
        barItem.appendChild(track);
        barItem.appendChild(value);
        interestChart.appendChild(barItem);
    });
}


async function loadAnalytics() {
    const response = await fetch(
        "http://127.0.0.1:5000/api/analytics"
    );

    if (!response.ok) {
        throw new Error("Analytics could not be loaded.");
    }

    const analytics = await response.json();

    contactCount.textContent = analytics.total_contacts;
    displayAnalytics(analytics);
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
        await loadAnalytics();
    } catch (error) {
        backendStatus.textContent = "Offline";
        dashboardMessage.textContent =
            "The dashboard data could not be loaded. Make sure Flask is running.";

        console.error(error);
    } finally {
        refreshButton.disabled = false;
    }
}


refreshButton.addEventListener("click", loadContacts);

loadContacts();