console.log("Tech Genie Lab JavaScript loaded successfully.");

const discoverButton = document.querySelector("#discover-button");
const introduction = document.querySelector("#introduction");
const currentYear = document.querySelector("#current-year");
const menuButton = document.querySelector("#menu-button");
const navigationLinks = document.querySelector("#navigation-links");
const navigationItems = document.querySelectorAll("#navigation-links a");
const contactForm = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const interestInput = document.querySelector("#interest");
const messageInput = document.querySelector("#message");
const formStatus = document.querySelector("#form-status");

discoverButton.addEventListener("click", function () {
    introduction.textContent =
        "Welcome to a space where creative storytelling, artificial intelligence, and enterprise database technology work together.";

    discoverButton.textContent = "Welcome to the Lab";
});

currentYear.textContent = new Date().getFullYear();
function openMenu() {
    navigationLinks.classList.add("is-open");
    menuButton.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
}

function closeMenu() {
    navigationLinks.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", function () {
    const menuIsOpen = navigationLinks.classList.contains("is-open");

    if (menuIsOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

navigationItems.forEach(function (navigationItem) {
    navigationItem.addEventListener("click", function () {
        closeMenu();
    });
});

function showError(input, message) {
    const errorElement = document.querySelector(`#${input.id}-error`);

    input.classList.add("input-error");
    errorElement.textContent = message;
}

function clearError(input) {
    const errorElement = document.querySelector(`#${input.id}-error`);

    input.classList.remove("input-error");
    errorElement.textContent = "";
}

function emailIsValid(email) {
    return email.includes("@") && email.includes(".");
}

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formIsValid = true;

    clearError(nameInput);
    clearError(emailInput);
    clearError(interestInput);
    clearError(messageInput);
    formStatus.textContent = "";

    if (nameInput.value.trim() === "") {
        showError(nameInput, "Please enter your full name.");
        formIsValid = false;
    }

    if (emailInput.value.trim() === "") {
        showError(emailInput, "Please enter your email address.");
        formIsValid = false;
    } else if (!emailIsValid(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        formIsValid = false;
    }

    if (interestInput.value === "") {
        showError(interestInput, "Please select an area of interest.");
        formIsValid = false;
    }

    if (messageInput.value.trim().length < 10) {
        showError(
            messageInput,
            "Your message must contain at least 10 characters."
        );

        formIsValid = false;
    }

    if (!formIsValid) {
        return;
    }

    const contactData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        interest: interestInput.value,
        message: messageInput.value.trim()
    };

    formStatus.textContent = "Sending your enquiry...";

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        formStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        formStatus.textContent =
            "The enquiry could not be sent. Make sure the Flask server is running.";

        console.error(error);
    }
});