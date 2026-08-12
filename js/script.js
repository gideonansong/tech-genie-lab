const discoverButton = document.querySelector("#discover-button");
const introduction = document.querySelector("#introduction");

discoverButton.addEventListener("click", function () {
    introduction.textContent =
        "Welcome to a space where creative storytelling, artificial intelligence, and enterprise database technology work together.";

    discoverButton.textContent = "Welcome to the Lab";
});