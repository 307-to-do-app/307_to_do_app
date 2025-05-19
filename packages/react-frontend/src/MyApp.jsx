import React, { useState, useEffect, useRef } from "react";
import TaskInputForm from "./TaskInputForm";

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState("Loading quote...");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [checkedTasks, setCheckedTasks] = useState([]);

  const sidebarRef = useRef();

  const categories = [
    { name: "School" },
    { name: "Work" },
    { name: "Errands" },
    { name: "Health" },
    { name: "Fitness" },
    { name: "Chores" },
  ];

  const butterTasks = tasks.filter((task) => Number(task.expectedTime) < 60);
  const normalTasks = tasks.filter((task) => Number(task.expectedTime) >= 60);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((json) => setTasks(json["task_list"]))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const fallbackQuotes = [
      "Stay focused and keep toasting.",
      "Small crumbs lead to big loaves.",
      "No task is too crusty to conquer.",
      "You rise by lifting tasks.",
      "The butter always spreads after effort.",
      "Productivity is the yeast of success.",
      "Crumb by crumb, progress is made.",
      "Toasty minds finish tasks.",
      "Break your big goals into little slices.",
      "All good things start with one crumb.",
    ];
    const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(random?.text ? `${random.text} – Mr. Crumb` : `${fallback} – Mr. Crumb`);
      })
      .catch(() => setQuote(`${fallback} – Mr. Crumb`));
  }, []);

  useEffect(() => {
    const total = butterTasks.length + normalTasks.length;
    const completed = checkedTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);

    setProgress(percent);

    if (percent === 100) {
      setMessage("🥳 100% Completed!");
    } else if (percent >= 50) {
      setMessage("🎉 Great job! You're halfway through!");
    } else {
      setMessage("");
    }
  }, [checkedTasks, butterTasks, normalTasks]);

  function addTask(task) {
    setTasks((prev) => [...prev, task]);
  }

  function toggleChecked(taskId) {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  }

  function completeCheckedTasks() {
    const updatedTasks = tasks.filter((task, index) => {
      const taskId = task._id || `${task.title}-${index}`;
      return !checkedTasks.includes(taskId);
    });

    setTasks(updatedTasks);
    setCheckedTasks([]);

    checkedTasks.forEach((id) => {
      if (!id.includes("-")) {
        fetch(`http://localhost:8000/tasks/${id}`, {
          method: "DELETE",
        }).catch((err) => console.error("Delete failed", err));
      }
    });
  }

  return (
    <div className={`pink-background ${darkMode ? "dark-mode" : ""}`}>
      {/* Hamburger Menu */}
      <div className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </div>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
        <ul>
          <li><button className="sidebar-link" onClick={() => setActivePage("home")}>🏠 Home</button></li>
          <li><button className="sidebar-link">📆 Calendar View</button></li>
          <li><button className="sidebar-link">👤 Profile</button></li>
          <li><button className="sidebar-link" onClick={() => setActivePage("settings")}>⚙️ Settings</button></li>
        </ul>
      </div>

      {/* Settings Page */}
      {activePage === "settings" && (
        <div className="settings-page">
          <h2>⚙️ Settings</h2>
          <label>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            Enable Dark Mode
          </label>
          <div className="settings-placeholder">
            <p>🛠 More settings coming soon:</p>
            <ul>
              <li>Font size</li>
              <li>Task sorting preferences</li>
              <li>Show/hide motivational quotes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Home Page */}
      {activePage === "home" && (
        <>
          <div className="title-box">
            <h1>CrumbList 🥖</h1>
          </div>

          {/* Category Grid */}
          <div className="category-grid">
            {categories.map((cat, index) => (
              <div key={index} className="category-box">{cat.name}</div>
            ))}
          </div>

          {/* Butter Tasks */}
          <div className="butter-row">
            <div className="butter-tasks">
              <div className="butter-title">🧈 Butter Tasks</div>
              {butterTasks.length === 0 ? (
                <p className="no-butter">No tasks under 60 minutes yet.</p>
              ) : (
                <div className="butter-task-grid">
                  {butterTasks.map((task, index) => {
                    const taskId = task._id || `${task.title}-${index}`;
                    return (
                      <div key={taskId} className="butter-task-grid-row">
                        <span>{task.title}</span>
                        <input
                          type="checkbox"
                          checked={checkedTasks.includes(taskId)}
                          onChange={() => toggleChecked(taskId)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {checkedTasks.length > 0 && (
                <button className="complete-button" onClick={completeCheckedTasks}>
                  ✅ Complete Selected
                </button>
              )}
            </div>
            <button className="calendar-button">Calendar View</button>
          </div>

          {/* Normal Tasks */}
          {normalTasks.length > 0 && (
            <div className="normal-tasks">
              <h2>📝 Normal Tasks</h2>
              <ul className="normal-task-list">
                {normalTasks.map((task) => (
                  <li key={task._id}>
                    <strong>{task.title}</strong> — {task.expectedTime} min
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Task Input */}
          <TaskInputForm categories={categories} onSubmit={addTask} />

          {/* ✅ Quote Box */}
          <div className="quote-box">
            <blockquote>{quote}</blockquote>
          </div>

          {/* Toast Progress Bar */}
          <div className="toast-section">
            <h2>Toast Your Tasks…</h2>
            <div className="toast-bar-wrapper">
              <div className="emoji-fire" style={{ left: `calc(${progress}% - 12px)` }}>🔥</div>
              <div className="toast-bar">
                <div className="toast-fill" style={{ width: `${progress}%` }}></div>
                <div className="toast-text">
                  {progress === 100 ? "100% Completed!" : `Task Progress (${progress}%)`}
                </div>
              </div>
              <span className="emoji-bread">🍞</span>
            </div>
            <p className="toast-message">{message}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MyApp;
