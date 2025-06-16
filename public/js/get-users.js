document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error("Can't load users");

        const users = await response.json();
        const table = document.querySelector("table");

        // Clear old rows (if any)
        document.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.paid ? "✅" : "❌"}</td>
                <td>
                    <button onclick="deleteUser('${user.email}')">🗑️ Delete</button>
                    <button onclick="changeUser('${user.email}')">✏️ Change</button>
                </td>
            `;
            table.appendChild(row);
        });

    } catch (err) {
        console.error("Error from Admin:", err);
    }
});

async function deleteUser(email) {
    if (!confirm(`Delete user ${email}?`)) return;

    try {
        const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message);
        location.reload();
    } catch (err) {
        alert("Failed to delete user.");
        console.error(err);
    }
}

async function changeUser(email) {
    const newEmail = prompt("Enter new email (leave empty to keep current):", email);
    const newPassword = prompt("Enter new password (leave empty to keep current):");

    // If both are empty, do nothing
    if (!newEmail && !newPassword) {
        alert("No changes made.");
        return;
    }

    try {
        const res = await fetch(`localhost:8080/api/users/${encodeURIComponent(email)}`, {
            method: "PUT", // or "PATCH" if you prefer
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: newEmail || undefined,
                password: newPassword || undefined
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update user");

        alert(data.message);
        location.reload();
    } catch (err) {
        alert("Failed to update user.");
        console.error(err);
    }
}


