// server/modules/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  paid: { type: Boolean, required: true },
  favArray: { type: [String], default: [] }, // favorite movies
});

module.exports = mongoose.model("User", userSchema);

