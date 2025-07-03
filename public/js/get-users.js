document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/users"); // <-- relative URL now
        if (!res.ok) throw new Error("Failed to fetch users");
        const users = await res.json();
        const table = document.querySelector("table");

        // Clear previous rows (except header)
        document.querySelectorAll("tr:not(:first-child)").forEach(r => r.remove());

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.paid ? "✅" : "❌"}</td>
                <td>
                    <button onclick="deleteUser('${user.email}')">🗑️</button>
                    <button onclick="changeUser('${user.email}')">✏️</button>
                </td>
            `;
            table.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load users:", err);
    }
});

async function deleteUser(email) {
    if (!confirm(`Delete ${email}?`)) return;

    try {
        const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message);
        location.reload();
    } catch {
        alert("Failed to delete user");
    }
}

async function changeUser(email) {
    const newEmail = prompt("New email:", email);
    if (!newEmail) return alert("Email is required");

    const newPassword = prompt("New password:");
    const newPaid = confirm("Paid? OK = true, Cancel = false");

    try {
        const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newEmail, newPassword, newPaid })
        });
        const data = await res.json();
        if (!res.ok) return alert("Failed to update: " + (data.error || data.message));
        alert(data.message);
        location.reload();
    } catch {
        alert("Failed to update user");
    }
}
