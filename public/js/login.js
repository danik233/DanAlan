const loginBtn = document.getElementById("loginBtn");

async function handleLogin() {
    const email = document.getElementById("emailInput").value.trim().toLowerCase();
    const password = document.getElementById("passInput").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.role === "admin") {
        alert(data.message);
        window.location.href = "admin.html";
        return;
    }

    if (response.ok) {
        alert(data.message);
        window.location.href = "homepage.html";
    } else {
        alert(data.message || "Login failed.");
    }
}

loginBtn.addEventListener("click", handleLogin);

["emailInput", "passInput"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    });
});

document.getElementById("signupBtn").addEventListener("click", () => {
    window.location.href = "signup.html";
});