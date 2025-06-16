const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;


app.use(cors());

const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/api/users', (req, res) => {
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading user data' });
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch {
      res.status(500).json({ error: 'Invalid users.json format' });
    }
  });
});

app.delete('/api/users/:email', (req, res) => {
  const userEmail = decodeURIComponent(req.params.email).trim().toLowerCase();

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading user data' });

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid users.json format' });
    }

    const updatedUsers = users.filter(u => u.email.trim().toLowerCase() !== userEmail);
    if (updatedUsers.length === users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    fs.writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Error updating user list' });
      res.json({ message: `User ${userEmail} deleted` });
    });
  });
});




app.put('/api/users/:email', (req, res) => {
  const userEmail = decodeURIComponent(req.params.email).trim().toLowerCase();
  const { newEmail, newPassword } = req.body;

  console.log("PUT /api/users/:email called with:", { userEmail, newEmail, newPassword });

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading user data' });

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid users.json format' });
    }

    const userIndex = users.findIndex(u => u.email.trim().toLowerCase() === userEmail);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only update email if newEmail exists and it's not duplicate
    if (newEmail) {
      const normalizedNewEmail = newEmail.trim().toLowerCase();
      if (users.some((u, i) => i !== userIndex && u.email.trim().toLowerCase() === normalizedNewEmail)) {
        return res.status(409).json({ error: 'Email already in use by another user' });
      }
      users[userIndex].email = normalizedNewEmail;
    }

    // Update password if provided
    if (newPassword) {
      users[userIndex].password = newPassword;  // consider hashing in production
    }

    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Error updating user data' });
      console.log(`User ${userEmail} updated successfully.`);
      res.json({ message: 'User updated successfully' });
    });
  });
});



app.listen(PORT, () => {
  console.log(`✅ Admin server running at http://localhost:${PORT}`);
});
