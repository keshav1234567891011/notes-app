require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");

const Note = require("./models/Note");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("ERROR:", err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


app.get("/notes", async (req, res) => {
  try {
      const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/notes", async (req, res) => {
  try {
    const { title, des,userId } = req.body;

    if (!title || !des) {
      return res.status(400).json({ message: "All fields required" });
    }

   const note = new Note({
  title,
  des,
  userId: req.userId
});
    const saved = await note.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { title, des } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, des },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});






app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed
    });

    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json(err);
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret123", // later move to env
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
});