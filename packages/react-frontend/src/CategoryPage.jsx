import React from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";

const CategoryPage = ({
  tasks,
  checkedTasks,
  toggleChecked,
  completeCheckedTasks,
}) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const filteredTasks = tasks
    .filter(
      (task) => task.category?.toLowerCase() === categoryName.toLowerCase(),
    )
    .sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);

      // compare due dates first
      if (dateA - dateB !== 0) {
        return dateA - dateB;
      }

      // if dates are equal, sort by urgency (descending)
      return Number(b.urgency) - Number(a.urgency);
    });

  return (
    <div className="category-page">
      <button className="back-button yellow" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>{categoryName} Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p>No tasks in this category yet.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <input
                type="checkbox"
                checked={checkedTasks.includes(task._id)}
                onChange={() => toggleChecked(task._id)}
                style={{ marginRight: "10px", transform: "scale(1.2)" }}
              />
              <div>
                <h3 style={{ marginBottom: "0.5rem" }}>{task.name}</h3>
                <div>
                  ⏰ {task.ease} min | ⚠️ Urgency: {task.urgency}
                </div>
                <div>
                  📅 Due:{" "}
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No date set"}
                </div>
                {task.description && (
                  <p style={{ marginTop: "0.5rem" }}>{task.description}</p>
                )}
              </div>
            </div>
          ))}

          {filteredTasks.some((task) => checkedTasks.includes(task._id)) && (
            <button
              className="full-width-button remove"
              onClick={() => {
                const idsToDelete = filteredTasks
                  .map((task) => task._id)
                  .filter((id) => checkedTasks.includes(id));
                if (idsToDelete.length > 0) completeCheckedTasks(idsToDelete);
              }}
            >
              Remove Selected (
              {
                filteredTasks.filter((task) => checkedTasks.includes(task._id))
                  .length
              }
              )
            </button>
          )}
          <button
            className="full-width-button add"
            onClick={() => navigate("/add-task")}
          >
            + Add Task
          </button>
        </div>
      )}
    </div>
  );
};

CategoryPage.propTypes = {
  tasks: PropTypes.array.isRequired,
  checkedTasks: PropTypes.array.isRequired,
  toggleChecked: PropTypes.func.isRequired,
  completeCheckedTasks: PropTypes.func.isRequired,
};

export default CategoryPage;
