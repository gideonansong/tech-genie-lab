const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");


loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginMessage.textContent = "Checking your details...";
    loginButton.disabled = true;

    const loginData = {
        username: usernameInput.value.trim(),
        password: passwordInput.value
    };

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/admin/login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        loginMessage.textContent = "Login successful.";

        window.location.href = "admin.html";
    } catch (error) {
        loginMessage.textContent =
            error.message || "The login was unsuccessful.";
    } finally {
        loginButton.disabled = false;
    }
});