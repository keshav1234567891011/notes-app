import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  // 🔹 Fetch notes from backend
  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // 🔹 Add OR Update note
  const addNote = async () => {
    if (!title || !des) {
      alert("Please fill all fields");
      return;
    }
    if (editId) {
      // UPDATE
      const res = await fetch(`http://localhost:5000/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, des }),
      });

      const updatedNote = await res.json();

      setNotes(notes.map((n) => (n._id === editId ? updatedNote : n)));
      setEditId(null);
    } else {
      // ADD
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, des }),
      });

      const newNote = await res.json();
      setNotes([...notes, newNote]);
    }

    setTitle("");
    setDes("");
  };

  // 🔹 Delete note
  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    });

    setNotes(notes.filter((n) => n._id !== id));
  };

  // 🔹 Start edit
  const startEdit = (note) => {
    setTitle(note.title);
    setDes(note.des);
    setEditId(note._id);
  };

  return (
    <div className="app">
      <h1>My Notes</h1>
      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={des}
        placeholder="Description"
        onChange={(e) => setDes(e.target.value)}
      />
      <button onClick={addNote}>{editId ? "Update Note" : "Add Note"}</button>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      ///note container
      <div className="notes-container">
        {notes.length === 0 && <p>No notes yet</p>}
        {notes
          .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
          .map((n) => (
            <div className="note-card" key={n._id}>
              <h3>{n.title}</h3>
              <p>{n.des}</p>

              <button onClick={() => deleteNote(n._id)}>Delete</button>
              <button onClick={() => startEdit(n)}>Edit</button>

              <p>{n.createdAt && new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
