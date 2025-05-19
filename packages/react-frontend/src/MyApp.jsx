import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyApp() {
  const [tasks, setTasks] = useState([]); 
  const navigate = useNavigate();

  const categories = [
    { name: "School" },
    { name: "Work" },
    { name: "Errands" },
    { name: "Health" },
    { name: "Fitness" },
    { name: "Chores" },
  ];

  function removeTask(id) {
    fetch(`http://localhost:8000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          setTasks(tasks.filter((task) => task._id !== id));
        } else {
          console.error("Delete failed");
        }
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  }

  useEffect(() => {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((json) => setTasks(json["task_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addTask(task) {
    setTasks((prevTasks) => [...prevTasks, task]);
  }

  return (
    <div className="pink-background">
      <div className="title-box">
        <h1>CrumbList 🥖</h1>
      </div>

      <div className="category-grid">
        {categories.map((cat, i) => (
          <div key={i} className="category-box">
            {cat.name}
          </div>
        ))}
      </div>

      <div className="butter-row">
        <div className="butter-tasks">
          <div className="butter-title">🧈 Butter Tasks</div>
          <textarea
            className="butter-input"
            placeholder="Write a quick task..."
          ></textarea>
        </div>

        <div className="button-col">
          <button className="add-task-home-button" onClick={() => navigate('/add-task')}>
            Add Task
          </button>
          <button className="calendar-button">Calendar View</button>
        </div>
      </div>

      {/* <div className="task-preview">
        <h2>Task Preview</h2>
        <ul>
          {tasks.map((task, idx) => (
            <li key={idx}>
              <strong>{task.title}</strong> | {task.category} | {task.dueDate} | {task.expectedTime} mins  
              <br />
              Notes: {task.notes}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default MyApp;
