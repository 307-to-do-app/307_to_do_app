import React, { useState } from "react";

function Form({ handleSubmit }) {
  const [form, setForm] = useState({
    name: "",
    job: "",
    dueDate: "",
    completed: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(form);
    setForm({ name: "", job: "", dueDate: "", completed: false });
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Task name" required />
      <input name="job" value={form.job} onChange={handleChange} placeholder="Category/Job" required />
      <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
      <label>
        Completed:
        <input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} />
      </label>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default Form;

