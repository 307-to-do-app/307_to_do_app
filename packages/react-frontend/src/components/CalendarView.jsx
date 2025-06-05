import React, { useState } from "react";
import PropTypes from "prop-types";

const CalendarView = ({ tasks, showButterTasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    if (urgency <= 2) return "#28a745"; // Green (low)
    if (urgency <= 4) return "#ffc107"; // Yellow
    if (urgency <= 6) return "#fd7e14"; // Orange
    if (urgency <= 8) return "#dc3545"; // Red
    return "#6f42c1"; // Purple (highest)
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    let filteredTasks = tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date).toISOString().split("T")[0];
      return taskDate === dateStr;
    });

    // Filter out butter tasks if setting is disabled
    if (!showButterTasks) {
      filteredTasks = filteredTasks.filter((task) => Number(task.ease) >= 60);
    }

    return filteredTasks;
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (
      let date = new Date(startDate);
      date < endDate;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }
    return days;
  };

  const days = getDaysInMonth();
  const today = new Date();

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📆 Calendar View</h2>
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={() => navigateMonth("prev")}>
            &lt;
          </button>
          <span className="calendar-month-year">
            {months[currentMonth]} {currentYear}
          </span>
          <button className="nav-btn" onClick={() => navigateMonth("next")}>
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="calendar-day-number">{date.getDate()}</div>
                {dayTasks.length > 0 && (
                  <div className="calendar-tasks">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        className="calendar-task-dot"
                        style={{
                          backgroundColor: getUrgencyColor(task.urgency || 5),
                        }}
                        title={`${task.name} (Urgency: ${task.urgency || 5})`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="calendar-task-more">
                        +{dayTasks.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="calendar-selected-date">
          <h3>Tasks for {selectedDate.toLocaleDateString()}</h3>
          {getTasksForDate(selectedDate).length === 0 ? (
            <p>No tasks scheduled for this date.</p>
          ) : (
            <div className="calendar-task-list">
              {getTasksForDate(selectedDate).map((task) => (
                <div key={task._id} className="calendar-task-item">
                  <div
                    className="task-urgency-dot"
                    style={{
                      backgroundColor: getUrgencyColor(task.urgency || 5),
                    }}
                  />
                  <div className="task-details">
                    <strong>{task.name}</strong>
                    <div className="task-meta">
                      {task.category} • {task.ease} min • Urgency:{" "}
                      {task.urgency || 5}/10
                    </div>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend">
        <h4>Urgency Scale:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#28a745" }}
            ></div>
            <span>Low (1-2)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#ffc107" }}
            ></div>
            <span>Medium (3-4)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#fd7e14" }}
            ></div>
            <span>High (5-6)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#dc3545" }}
            ></div>
            <span>Urgent (7-8)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#6f42c1" }}
            ></div>
            <span>Critical (9-10)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CalendarView.propTypes = {
  tasks: PropTypes.array.isRequired,
  showButterTasks: PropTypes.bool,
};

export default CalendarView;
