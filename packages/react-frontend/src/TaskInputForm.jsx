import React, { useState } from 'react';

const TaskInputForm = ({ onSubmit, categories }) => {
  const [task, setTask] = useState({
    title: '',
    dueDate: '',
    category: '',
    notes: '',
    expectedTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task); // Pass task up
    setTask({
      title: '',
      dueDate: '',
      category: '',
      notes: '',
      expectedTime: ''
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={task.title}
        onChange={handleChange}
      />

      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
      />

      <select name="category" value={task.category} onChange={handleChange}>
        <option value="">Select category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        name="notes"
        placeholder="Notes..."
        value={task.notes}
        onChange={handleChange}
      />

      <input
        type="text"
        name="expectedTime"
        placeholder="Expected time (e.g. 30 mins)"
        value={task.expectedTime}
        onChange={handleChange}
      />

        <button type="submit" className="add-task-button"> Add Task</button>

    </form>

  );
};

export default TaskInputForm;
