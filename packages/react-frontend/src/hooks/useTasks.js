import { useState, useEffect } from "react";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetch tasks from backend
  const fetchTasks = () => {
    fetch(
      "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks",
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("Fetched tasks:", json.task_list);
        setTasks(json.task_list || []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate progress
  useEffect(() => {
    const total = tasks.length;
    const completed = checkedTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
    setProgress(percent);
  }, [checkedTasks, tasks]);

  const toggleChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const completeCheckedTasks = () => {
    const updatedTasks = tasks.filter((task) => {
      return !checkedTasks.includes(task._id);
    });

    setTasks(updatedTasks);
    setCheckedTasks([]);

    // Delete from backend
    checkedTasks.forEach((id) => {
      fetch(
        `https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks/${id}`,
        {
          method: "DELETE",
        },
      ).catch((err) => console.error("Delete failed", err));
    });
  };

  return {
    tasks,
    checkedTasks,
    progress,
    toggleChecked,
    completeCheckedTasks,
    fetchTasks,
  };
};
