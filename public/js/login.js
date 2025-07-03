const loginBtn = document.getElementById("loginBtn");

// Function to handle login
async function handleLogin() {
    const emailInput = document.getElementById("emailInput");
    const passInput = document.getElementById("passInput");

    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("/login", {  // <-- changed here: relative URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed.");
            return;
        }

        alert(data.message || "Login successful.");
        if (data.redirect) {
            window.location.href = data.redirect;
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Server error. Please try again later.");
    }
}

// Handle login button click
loginBtn.addEventListener("click", handleLogin);

// Handle Enter key on both input fields
["emailInput", "passInput"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    });
});

// Navigate to signup page
document.getElementById("signupBtn").addEventListener("click", () => {
    window.location.href = "signup.html";
});
