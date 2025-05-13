import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  const [quote, setQuote] = useState("Loading quote...");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => console.log(error));
  }, []);

  // ✅ Dynamic motivational quote with fallback
  useEffect(() => {
    const quotes = [
      "Stay focused and keep toasting.",
      "Small crumbs lead to big loaves.",
      "No task is too crusty to conquer.",
      "You rise by lifting tasks.",
      "The butter always spreads after effort.",
      "Productivity is the yeast of success.",
      "Crumb by crumb, progress is made.",
      "Toasty minds finish tasks.",
      "Break your big goals into little slices.",
      "All good things start with one crumb."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        if (random?.text) {
          setQuote(`${random.text} – Mr. Crumb`);
        } else {
          setQuote(`${randomQuote} – Mr. Crumb`);
        }
      })
      .catch(() => {
        setQuote(`${randomQuote} – Mr. Crumb`);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const weeklyTasks = characters.filter((task) => {
      const due = new Date(task.dueDate);
      return due >= now && due <= nextWeek;
    });

    const completed = weeklyTasks.filter((task) => task.completed).length;
    const total = weeklyTasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    setProgress(percent);

    if (percent >= 50 && percent < 100) {
      setMessage("🎉 Great job! You're halfway through!");
    } else if (percent === 100 && total > 0) {
      setMessage("🥳 All done! Your toast is golden brown!");
    } else {
      setMessage("");
    }
  }, [characters]);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) return res.json();
        else throw new Error("Failed to create user");
      })
      .then((newUser) => setCharacters([...characters, newUser]))
      .catch((error) => console.log(error));
  }

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((user) => user._id !== id);
          setCharacters(updated);
        } else {
          console.error("Delete failed");
        }
      })
      .catch((error) => console.error("Delete failed:", error));
  }

  return (
    <div className="pink-background">
      <div className="title-box">
        <h1>CrumbList 🥖</h1>
      </div>

      {/* Quote at the top */}
      <div className="quote-box">
        <blockquote>{quote}</blockquote>
      </div>

      <div className="category-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="category-box">
            Category {i + 1}
          </div>
        ))}
      </div>

      <div className="butter-row">
        <div className="butter-tasks">
          <div className="butter-title">🧈 Butter Tasks</div>
          <textarea className="butter-input" placeholder="Write a quick task..." />
        </div>
        <button className="calendar-button">Calendar View</button>
      </div>

      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />

      {/* Toast Your Tasks Progress Bar */}
      <div className="toast-section">
        <h2>Toast Your Tasks…</h2>

        <div className="toast-bar-wrapper">
          <div className="emoji-fire" style={{ left: `calc(${progress}% - 12px)` }}>🔥</div>

          <div className="toast-bar">
            <div className="toast-fill" style={{ width: `${progress}%` }}></div>
            <div className="toast-text">Task Progress ({progress}%)</div>
          </div>

          <span className="emoji-bread">{progress === 100 ? "🍞" : "🍞"}</span>
        </div>

        <p className="toast-message">{message}</p>
        <p className="crumb-saying">{quote}</p>
      </div>
    </div>
  );
}

export default MyApp;

