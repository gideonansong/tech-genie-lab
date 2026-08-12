console.log("Tech Genie Lab JavaScript loaded successfully.");

const discoverButton = document.querySelector("#discover-button");
const introduction = document.querySelector("#introduction");
const currentYear = document.querySelector("#current-year");

discoverButton.addEventListener("click", function () {
    introduction.textContent =
        "Welcome to a space where creative storytelling, artificial intelligence, and enterprise database technology work together.";

    discoverButton.textContent = "Welcome to the Lab";
});

currentYear.textContent = new Date().getFullYear();