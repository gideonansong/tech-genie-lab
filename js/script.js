console.log("Tech Genie Lab JavaScript loaded successfully.");

const discoverButton = document.querySelector("#discover-button");
const introduction = document.querySelector("#introduction");
const currentYear = document.querySelector("#current-year");
const menuButton = document.querySelector("#menu-button");
const navigationLinks = document.querySelector("#navigation-links");
const navigationItems = document.querySelectorAll("#navigation-links a");

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