import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Signup from "./Signup";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [search, setSearch] = useState("");

  // 🔹 Fetch notes from backend
  useEffect(() => {
    fetch("https://notes-app-qlxd.onrender.com/notes", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
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
      const res = await fetch(
        `https://notes-app-qlxd.onrender.com/notes/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ title, des }),
        },
      );

      const updatedNote = await res.json();

      setNotes(notes.map((n) => (n._id === editId ? updatedNote : n)));
      setEditId(null);
    } else {
      // ADD
      const res = await fetch("https://notes-app-qlxd.onrender.com/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
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
    await fetch(`https://notes-app-qlxd.onrender.com/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    setNotes(notes.filter((n) => n._id !== id));
  };

  // 🔹 Start edit
  const startEdit = (note) => {
    setTitle(note.title);
    setDes(note.des);
    setEditId(note._id);
  };
  if (!isLoggedIn) {
    return (
      <div>
        <Login setIsLoggedIn={setIsLoggedIn} />
        <Signup />
      </div>
    );
  }
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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      ///note container
      <div className="notes-container">
        {notes.length === 0 && (
          <p style={{ textAlign: "center", color: "gray" }}>
            No notes yet. Start by adding one!
          </p>
        )}
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
