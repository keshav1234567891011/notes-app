const express = require("express");
const mongoose = require("mongoose");

const Note = require("./models/Note");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://yt:iRbvQg6LY8kgOy4p@youtubecompletebackend.blqvbsn.mongodb.net/rndwa?appName=youtubecompletebackend")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("ERROR:", err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/notes", async (req, res) => {
  try {
    const { title, des } = req.body;

    if (!title || !des) {
      return res.status(400).json({ message: "All fields required" });
    }

    const note = new Note({ title, des });
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