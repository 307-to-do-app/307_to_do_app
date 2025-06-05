import React from "react";
import CuteBread from "./CuteBread";
import EditableCategory from "./EditableCategory";
import PropTypes from "prop-types";

const MainPage = ({
  setActivePage,
  categories,
  updateCategoryName,
  tasksByCategory,
  butterTasks,
  checkedTasks,
  toggleChecked,
  completeCheckedTasks,
  selectedButterIds,
  navigate,
  quote,
  progress,
}) => {
  return (
    <>
      <div className="title-box">
        <h1>
          CrumbList <CuteBread size="35px" />
        </h1>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <EditableCategory
            key={index}
            name={cat.name}
            index={index}
            onNameChange={updateCategoryName}
            taskCount={tasksByCategory[cat.name]?.length || 0}
            onClick={() => navigate(`/category/${cat.name}`)}
          />
        ))}
      </div>

      <div className="butter-row">
        <div className="butter-tasks">
          <div className="butter-title">
            🧈 Butter Tasks{" "}
            <span className="task-count">({butterTasks.length})</span>
          </div>
          {butterTasks.length === 0 ? (
            <p className="no-butter">No quick tasks under 60 minutes yet.</p>
          ) : (
            <div className="butter-task-grid">
              {butterTasks.map((task) => (
                <div key={task._id} className="butter-task-grid-row">
                  <span>
                    {task.name} ({task.ease} min)
                  </span>
                  <input
                    type="checkbox"
                    checked={checkedTasks.includes(task._id)}
                    onChange={() => toggleChecked(task._id)}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedButterIds.length > 0 && (
            <button
              className="complete-button"
              onClick={() => completeCheckedTasks(selectedButterIds)}
            >
              Remove Selected ({selectedButterIds.length})
            </button>
          )}
        </div>
        <div className="button-col">
          <button
            className="add-task-button"
            onClick={() => navigate("/add-task")}
          >
            Add Task
          </button>
          <button
            className="calendar-view-button"
            onClick={() => setActivePage("calendar")}
          >
            📅 Calendar View
          </button>
        </div>
      </div>

      <div className="quote-box">
        <blockquote>{quote}</blockquote>
      </div>

      <div className="toast-section">
        <h2>Toast Your Tasks…</h2>
        <div className="toast-bar-wrapper">
          <div className="emoji-fire">🔥</div>
          <div className="toast-bar">
            <div className="toast-fill" style={{ width: `${progress}%` }}></div>
            <div className="toast-text">
              {progress === 100
                ? "100% Completed!"
                : `Task Progress (${progress}%)`}
            </div>
          </div>
          <span className="emoji-bread">🍞</span>
        </div>
      </div>
    </>
  );
};

MainPage.propTypes = {
  setActivePage: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired }),
  ).isRequired,
  updateCategoryName: PropTypes.func.isRequired,
  tasksByCategory: PropTypes.object.isRequired,
  butterTasks: PropTypes.array.isRequired,
  checkedTasks: PropTypes.array.isRequired,
  toggleChecked: PropTypes.func.isRequired,
  completeCheckedTasks: PropTypes.func.isRequired,
  selectedButterIds: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  quote: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};

export default MainPage;
