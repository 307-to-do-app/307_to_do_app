import React, { useState, useEffect } from "react";
import TaskInputForm from "./TaskInputForm";
import { useNavigate } from "react-router-dom";

function TaskFormPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Get categories from localStorage (same as MyApp)
  useEffect(() => {
    const savedCategories = localStorage.getItem("crumblist-categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories (same as MyApp)
      setCategories([
        { name: "School" },
        { name: "Work" },
        { name: "Errands" },
        { name: "Health" },
        { name: "Fitness" },
        { name: "Chores" },
      ]);
    }

    // Listen for storage changes (when categories are updated in MyApp)
    const handleStorageChange = (e) => {
      if (e.key === "crumblist-categories") {
        setCategories(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for focus (when returning from MyApp)
    const handleFocus = () => {
      const updatedCategories = localStorage.getItem("crumblist-categories");
      if (updatedCategories) {
        setCategories(JSON.parse(updatedCategories));
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleFormSubmit = (task) => {
    console.log("Submitting to backend:", task);

    fetch(
      "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      },
    )
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((newTask) => {
        console.log("Task added successfully:", newTask);
        alert("Task added successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to add task:", err);
        alert(`Failed to add task: ${err.message}`);
      });
  };

  return (
    <div className="form-page">
      <h2 className="form-heading">Add a New Task 📝</h2>
      <TaskInputForm categories={categories} onSubmit={handleFormSubmit} />
      <div className="form-buttons">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to CrumbList
        </button>
      </div>
    </div>
  );
}

export default TaskFormPage;
