require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const User = require("./modules/user");

const app = express();
const PORT = process.env.PORT || 3000; // <-- use env PORT for cloud

// ⛔ Block direct access to JSON files
app.use((req, res, next) => {
    if (req.url.endsWith(".json")) return res.status(403).send("Access Denied");
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Save users.json to data folder
async function syncUsersJson() {
    try {
        const users = await User.find({}).lean();
        fs.writeFileSync(path.join(__dirname, "data", "users.json"), JSON.stringify(users, null, 2), "utf8");
        console.log("✅ users.json synced from MongoDB");
    } catch (err) {
        console.error("❌ Failed to sync users.json:", err);
    }
}

// ✅ Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

app.get("/homepage.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "homepage.html"));
});

// ✅ Login
app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.toLowerCase();

        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });

        if (email === "admin@admin" && password === "admin")
            return res.json({ role: "admin", message: "Admin login successful", redirect: "/admin.html" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found. Please signup." });
        if (user.password !== password) return res.status(401).json({ message: "Incorrect password." });

        const message = user.paid ? "Login successful." : "Login successful. Free trial 30 days.";
        res.json({ role: "user", message, redirect: "/homepage.html" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// ✅ Signup
app.post("/signup", async (req, res) => {
    try {
        let { email, password, repeatPassword, paid } = req.body;
        if (email) email = email.toLowerCase();

        if (!email || !password || !repeatPassword || typeof paid !== "boolean")
            return res.status(400).json({ message: "All fields are required" });

        if (password !== repeatPassword)
            return res.status(400).json({ message: "Passwords do not match" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email already exists." });

        const newUser = new User({ email, password, paid });
        await newUser.save();
        await syncUsersJson();

        res.status(201).json({
            message: paid ? "Signup successful." : "Signup successful. Free trial 30 days."
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// ✅ Get all users (admin feature)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}).lean();
        await syncUsersJson();
        res.json(users);
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// ✅ Update user
app.put("/api/users/:email", async (req, res) => {
    try {
        const userEmail = decodeURIComponent(req.params.email).toLowerCase();
        const { newEmail, newPassword, newPaid } = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (newEmail && newEmail !== user.email) {
            const exists = await User.findOne({ email: newEmail });
            if (exists) return res.status(409).json({ error: "Email already in use" });
            user.email = newEmail.toLowerCase();
        }

        if (newPassword) user.password = newPassword;
        if (typeof newPaid === "boolean") user.paid = newPaid;

        await user.save();
        await syncUsersJson();

        res.json({ message: `User ${userEmail} updated.` });
    } catch (err) {
        console.error("Failed to update user:", err);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// ✅ Delete user
app.delete("/api/users/:email", async (req, res) => {
    try {
        const userEmail = decodeURIComponent(req.params.email).toLowerCase();
        const deleted = await User.findOneAndDelete({ email: userEmail });

        if (!deleted) return res.status(404).json({ error: "User not found" });

        await syncUsersJson();
        res.json({ message: `User ${userEmail} deleted.` });
    } catch (err) {
        console.error("Failed to delete user:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// ✅ Start Main Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
