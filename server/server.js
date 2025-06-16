const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");  // users.json is in same folder as server.js

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public"))); // Serve frontend files from ../public

// Explicitly serve index.html at root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Helper functions
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data || "[]");
    } catch (err) {
        console.error("Failed to parse users.json:", err);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Failed to write users.json:", err);
    }
}

// LOGIN endpoint
app.post("/login", (req, res) => {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Admin user check
    if (email === "admin@admin" && password === "admin") {
        // Redirect admin to admin.html
        return res.json({ role: "admin", message: "Admin login successful.", redirect: "/admin.html" });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "User not found. Please signup." });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password." });
    }

    const redirectUrl = "/homepage.html";
    const message = user.paid ? "Login successful." : "Login successful. Free trial 30 days.";

    res.json({ message, redirect: redirectUrl });
});

// SIGNUP endpoint
app.post("/signup", (req, res) => {
    let { email, password, repeatPassword, paid } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !password || !repeatPassword || typeof paid !== "boolean") {
        return res.status(400).json({ message: "All fields including paid status are required." });
    }

    if (password !== repeatPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const users = readUsers();
    if (users.some(u => u.email === email)) {
        return res.status(409).json({ message: "Email already exists." });
    }

    users.push({ email, password, paid });
    writeUsers(users);

    res.status(201).json({
        message: paid
            ? "Signup successful."
            : "Signup successful. Free trial 30 days."
    });
});

// Admin: Get all users
app.get("/api/users", (req, res) => {
    const users = readUsers();
    res.json(users);
});

// Admin: Delete a user by email
app.delete("/api/users/:email", (req, res) => {
    const emailToDelete = req.params.email.toLowerCase();
    let users = readUsers();
    const initialLength = users.length;

    users = users.filter(u => u.email !== emailToDelete);
    if (users.length === initialLength) {
        return res.status(404).json({ message: "User not found." });
    }

    writeUsers(users);
    res.json({ message: `User ${emailToDelete} deleted.` });
});

// Admin: Update user by email
app.put("/api/users/:email", (req, res) => {
    const emailToUpdate = req.params.email.toLowerCase();
    const { email: newEmail, password: newPassword, paid: newPaid } = req.body;

    let users = readUsers();
    const index = users.findIndex(u => u.email === emailToUpdate);

    if (index === -1) {
        return res.status(404).json({ error: "User not found." });
    }

    // If newEmail is provided and different, check for duplicates
    if (newEmail && newEmail.toLowerCase() !== emailToUpdate) {
        if (users.some((u, i) => i !== index && u.email === newEmail.toLowerCase())) {
            return res.status(409).json({ error: "Email already in use by another user." });
        }
        users[index].email = newEmail.toLowerCase();
    }

    // Update password if provided
    if (newPassword) {
        users[index].password = newPassword;
    }

    // Update paid if provided
    if (typeof newPaid === "boolean") {
        users[index].paid = newPaid;
    }

    writeUsers(users);
    res.json({ message: `User ${emailToUpdate} updated.` });
});

// Serve admin.html explicitly (to allow redirect)
app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

// Serve homepage.html explicitly (if needed)
app.get("/homepage.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "homepage.html"));
});

// Catch-all for other static files is handled by express.static

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
