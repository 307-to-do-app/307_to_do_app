import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TaskInputForm = ({ onSubmit, categories }) => {
  const [task, setTask] = useState({
    title: "",
    dueDate: "",
    category: "",
    notes: "",
    expectedTime: "",
    urgency: "",
  });

  // Update form when categories change
  useEffect(() => {
    // If current selected category no longer exists, clear it
    if (
      task.category &&
      !categories.some((cat) => cat.name === task.category)
    ) {
      setTask((prev) => ({ ...prev, category: "" }));
    }
  }, [categories, task.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map frontend fields to backend schema
    const backendTask = {
      name: task.title,
      category: task.category,
      description: task.notes,
      due_date: `${task.dueDate}T12:00:00.000Z`, // 👈 Fix here
      urgency: Number(task.urgency),
      ease:
        Number(task.expectedTime.toString().replace(/\D/g, "")) ||
        Number(task.expectedTime),
    };

    console.log("Submitting task:", backendTask);
    onSubmit(backendTask);

    // Clear form
    setTask({
      title: "",
      dueDate: "",
      category: "",
      notes: "",
      expectedTime: "",
      urgency: "",
    });
  };

  // Filter out categories with empty names
  const validCategories = categories.filter(
    (cat) => cat.name && cat.name.trim() !== "",
  );

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={task.title}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={task.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        {validCategories.map((cat, idx) => (
          <option key={idx} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        name="urgency"
        value={task.urgency}
        onChange={handleChange}
        required
      >
        <option value="">Select urgency (1 = low, 10 = high)</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} {i === 0 ? "(Low)" : i === 9 ? "(High)" : ""}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="expectedTime"
        placeholder="Expected time in minutes (e.g. 30)"
        value={task.expectedTime}
        onChange={handleChange}
        min="1"
        required
      />

      <textarea
        name="notes"
        placeholder="Notes (optional)..."
        value={task.notes}
        onChange={handleChange}
        rows="3"
      />

      <button type="submit" className="add-task-button">
        Add Task
      </button>
    </form>
  );
};

TaskInputForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TaskInputForm;
