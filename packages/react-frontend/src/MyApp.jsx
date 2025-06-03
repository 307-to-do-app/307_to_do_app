import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import CategoryPage from "./CategoryPage";


const EditableCategory = ({ name, taskCount, onClick }) => {
  return (
    <div
      className="category-box"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <h3>{name}</h3>
      <p className="task-count">({taskCount} tasks)</p>

// Simple Cute Bread Component (Stationary)
const CuteBread = ({ size = "40px", className = "" }) => {
  return (
    <div className={`cute-bread ${className}`} style={{ width: size, height: size }}>
      <div className="bread-body">
        <div className="bread-eyes">
          <div className="eye left-eye"></div>
          <div className="eye right-eye"></div>
        </div>
        <div className="bread-mouth"></div>
        <div className="bread-cheeks">
          <div className="cheek left-cheek"></div>
          <div className="cheek right-cheek"></div>
        </div>
      </div>
    </div>
  );
};

CuteBread.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
};

// Calendar Component
const CalendarView = ({ tasks, showButterTasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    const dateStr = date.toISOString().split('T')[0];
    let filteredTasks = tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });

    // Filter out butter tasks if setting is disabled
    if (!showButterTasks) {
      filteredTasks = filteredTasks.filter(task => Number(task.ease) >= 60);
    }

    return filteredTasks;
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  };

  const days = getDaysInMonth();
  const today = new Date();

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
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
          <button className="nav-btn" onClick={() => navigateMonth('prev')}>&lt;</button>
          <span className="calendar-month-year">
            {months[currentMonth]} {currentYear}
          </span>
          <button className="nav-btn" onClick={() => navigateMonth('next')}>&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="calendar-day-number">{date.getDate()}</div>
                {dayTasks.length > 0 && (
                  <div className="calendar-tasks">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        className="calendar-task-dot"
                        style={{ backgroundColor: getUrgencyColor(task.urgency) }}
                        title={`${task.name} (Urgency: ${task.urgency})`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="calendar-task-more">+{dayTasks.length - 3}</div>
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
              {getTasksForDate(selectedDate).map(task => (
                <div key={task._id} className="calendar-task-item">
                  <div
                    className="task-urgency-dot"
                    style={{ backgroundColor: getUrgencyColor(task.urgency) }}
                  />
                  <div className="task-details">
                    <strong>{task.name}</strong>
                    <div className="task-meta">
                      {task.category} • {task.ease} min • Urgency: {task.urgency}/10
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
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
            <div className="legend-dot" style={{ backgroundColor: "#28a745" }}></div>
            <span>Low (1-2)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#ffc107" }}></div>
            <span>Medium (3-4)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#fd7e14" }}></div>
            <span>High (5-6)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#dc3545" }}></div>
            <span>Urgent (7-8)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#6f42c1" }}></div>
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

const EditableCategory = ({ name, index, onNameChange, taskCount, onClick }) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleBlur = () => {
    setEditing(false);
    onNameChange(index, tempName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditing(false);
      onNameChange(index, tempName);
    }
  };

  return editing ? (
    <input
      type="text"
      value={tempName}
      autoFocus
      onChange={(e) => setTempName(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="category-input"
    />
  ) : (
    <div className="category-box" style={{ cursor: "pointer" }}>
      <h3 
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        style={{ cursor: "text" }}
      >
        {name || <em>Click to name me</em>}
      </h3>
      {name && (
        <p 
          className="task-count"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{ cursor: "pointer" }}
        >
          ({taskCount} tasks)
        </p>
      )}
    </div>
  );
};

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  // Settings state
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('crumblist-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: false,
      butterThreshold: 60,
      showButterInCalendar: true,
      dailyQuotes: false,
      colorTheme: 'pink'
    };
  });

  // User profile state
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('crumblist-profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Your Name',
      title: 'Task Master'
    };
  });

  const [editingProfile, setEditingProfile] = useState({ name: false, title: false });

  // Bread-themed quotes
  const breadQuotes = [
    "Stay focused and keep toasting.",
    "Small crumbs lead to big loaves.",
    "No task is too crusty to conquer.",
    "Rise to the occasion like good dough.",
    "Every great achievement starts with a single grain.",
    "Knead your goals until they're perfect.",
    "Life is what you bake it.",
    "Don't loaf around - get things done!",
    "You're the yeast that makes things rise.",
    "Success is a recipe worth following.",
    "Proof that hard work pays off.",
    "Butter believe in yourself!",
    "Time to roll up your sleeves and get baking.",
    "Fresh starts are like warm bread - always better.",
    "Slice through challenges one task at a time."
  ];

  // Random quote that changes on each render/refresh
  const [quote] = useState(() => {
    const randomQuote = breadQuotes[Math.floor(Math.random() * breadQuotes.length)];
    return `${randomQuote} – Mr. Crumb`;
  });

  // Initialize categories from localStorage or use defaults
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("crumblist-categories");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "School" },
          { name: "Work" },
          { name: "Errands" },
          { name: "Health" },
          { name: "Fitness" },
          { name: "Chores" },
        ];
  });


  const butterTasks = tasks
    .filter((task) => Number(task.ease) < 60)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const normalTasks = tasks.filter((task) => Number(task.ease) >= settings.butterThreshold);

  const butterTaskIds = butterTasks.map((task) => task._id);
  const selectedButterIds = checkedTasks.filter((id) => butterTaskIds.includes(id));


  const tasksByCategory = {};
  categories.forEach((cat) => {
    tasksByCategory[cat.name] = normalTasks
      .filter((task) => task.category?.toLowerCase() === cat.name.toLowerCase())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  });

  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${settings.colorTheme} ${settings.darkMode ? 'dark-mode' : ''}`;
    
    // Apply theme to pink-background class
    const pinkBg = document.querySelector('.pink-background');
    if (pinkBg) {
      pinkBg.className = `pink-background theme-${settings.colorTheme} ${settings.darkMode ? 'dark-mode' : ''}`;
    }
  }, [settings.darkMode, settings.colorTheme]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('crumblist-settings', JSON.stringify(settings));
  }, [settings]);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('crumblist-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Daily quote notification
  useEffect(() => {
    if (settings.dailyQuotes) {
      const lastQuoteDate = localStorage.getItem('last-quote-date');
      const today = new Date().toDateString();
      
      if (lastQuoteDate !== today) {
        const randomQuote = breadQuotes[Math.floor(Math.random() * breadQuotes.length)];
        if (Notification.permission === 'granted') {
          new Notification('Daily Motivation from Mr. Crumb', {
            body: randomQuote,
            icon: '🍞'
          });
        }
        localStorage.setItem('last-quote-date', today);
      }
    }
  }, [settings.dailyQuotes]);

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Settings update functions
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearCompletedTasks = () => {
    if (window.confirm('Are you sure you want to clear all completed tasks? This cannot be undone.')) {
      console.log('Clearing completed tasks...');
      alert('Completed tasks cleared!');
    }
  };

  const updateProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    setEditingProfile(prev => ({ ...prev, [field]: false }));
  };

  const handleProfileKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      updateProfile(field, e.target.value);
    }
  };

  // Calculate achievements
  const getAchievements = () => {
    const achievements = [];
    
    if (tasks.length >= 10) {
      achievements.push({ icon: '🥖', text: 'Bread Collector', desc: 'Created 10+ tasks' });
    }
    
    if (butterTasks.length >= 5) {
      achievements.push({ icon: '🧈', text: 'Butter Master', desc: '5+ butter tasks' });
    }
    
    if (progress === 100 && tasks.length > 0) {
      achievements.push({ icon: '🔥', text: 'Perfectionist', desc: '100% completion' });
    }
    
    if (checkedTasks.length >= 5) {
      achievements.push({ icon: '⚡', text: 'Speed Demon', desc: '5+ tasks completed today' });
    }

    if (tasks.length >= 50) {
      achievements.push({ icon: '🏆', text: 'Task Champion', desc: '50+ total tasks' });
    }

    if (categories.length > 6) {
      achievements.push({ icon: '📚', text: 'Organizer', desc: 'Created custom categories' });
    }

    return achievements;
  };

  const resetCategoriesToDefault = () => {
    if (window.confirm('Reset categories to default? This will remove any custom categories you\'ve created.')) {
      const defaultCategories = [
        { name: "School" },
        { name: "Work" },
        { name: "Errands" },
        { name: "Health" },
        { name: "Fitness" },
        { name: "Chores" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('crumblist-categories', JSON.stringify(defaultCategories));
      alert('Categories reset to default!');
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
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
    fetch(
      "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks",
    )
      .then((res) => res.json())
      .then((json) => setTasks(json.task_list || []))
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("crumblist-categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const total = tasks.length;
    const completed = checkedTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
    setProgress(percent);
  }, [checkedTasks, tasks]);

  useEffect(() => {
    const fallbackQuotes = [
      "Stay focused and keep toasting.",
      "Small crumbs lead to big loaves.",
      "No task is too crusty to conquer.",
    ];
    const fallback =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(
          random?.text
            ? `${random.text} – Mr. Crumb`
            : `${fallback} – Mr. Crumb`,
        );
      })
      .catch(() => setQuote(`${fallback} – Mr. Crumb`));
  }, []);


  const toggleChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const completeCheckedTasks = (idsToDelete = checkedTasks) => {
    const updatedTasks = tasks.filter(
      (task) => !idsToDelete.includes(task._id),
    );
    setTasks(updatedTasks);
    setCheckedTasks((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    idsToDelete.forEach((id) => {
      fetch(
        `https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/tasks/${id}`,
        {
          method: "DELETE",
        },
      ).catch((err) => console.error("Delete failed", err));
    });
  };

  const updateCategoryName = (index, newName) => {
    const updated = [...categories];
    updated[index].name = newName;
    setCategories(updated);
  };

  const openCategoryModal = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="pink-background">
      {location.pathname.startsWith("/category/") ? (
        <CategoryPage
          tasks={tasks}
          checkedTasks={checkedTasks}
          toggleChecked={toggleChecked}
          completeCheckedTasks={completeCheckedTasks}
        />
      ) : (
        <>
          {/* Hamburger Menu */}
          <div
            className="hamburger-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </div>

    <div className={`pink-background theme-${settings.colorTheme} ${settings.darkMode ? 'dark-mode' : ''}`}>
      {/* Hamburger Menu */}
      <div
        className="hamburger-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`sidebar ${sidebarOpen ? "open" : ""}`}
          >
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
            <ul>
              <li>
                <button className="sidebar-link" onClick={() => navigate("/")}>
                  🏠 Home
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  📆 Calendar View
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  👤 Profile
                </button>
              </li>
              <li>
                <button
                  className="sidebar-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  ⚙️ Settings
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Settings Page */}
      {activePage === "settings" && (
        <div className="settings-page">
          <h2>⚙️ Settings</h2>
          <div className="settings-content">
            
            {/* Theme Settings */}
            <div className="settings-section">
              <h3>🎨 Theme & Appearance</h3>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.darkMode}
                    onChange={(e) => updateSetting('darkMode', e.target.checked)}
                  /> 
                  Enable Dark Mode
                </label>
              </div>
              <div className="setting-item">
                <label>
                  Color Theme:
                  <select 
                    value={settings.colorTheme} 
                    onChange={(e) => updateSetting('colorTheme', e.target.value)}
                  >
                    <option value="pink">Pink (Default)</option>
                    <option value="blue">Blue Pastel</option>
                    <option value="green">Green Pastel</option>
                    <option value="purple">Purple Pastel</option>
                    <option value="orange">Orange Pastel</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Task Settings */}
            <div className="settings-section">
              <h3>🧈 Butter Task Settings</h3>
              <div className="setting-item">
                <label>
                  Butter task threshold (tasks under this duration):
                  <select 
                    value={settings.butterThreshold} 
                    onChange={(e) => updateSetting('butterThreshold', Number(e.target.value))}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.showButterInCalendar}
                    onChange={(e) => updateSetting('showButterInCalendar', e.target.checked)}
                  /> 
                  Show butter tasks in calendar view
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-section">
              <h3>🔔 Notifications</h3>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.dailyQuotes}
                    onChange={(e) => {
                      updateSetting('dailyQuotes', e.target.checked);
                      if (e.target.checked) {
                        requestNotificationPermission();
                      }
                    }}
                  /> 
                  Daily motivation quote notifications
                </label>
              </div>
            </div>

            {/* Data Settings */}
            <div className="settings-section">
              <h3>💾 Data Management</h3>
              <div className="setting-item">
                <button className="settings-button danger-btn" onClick={clearCompletedTasks}>
                  🗑️ Clear All Completed Tasks
                </button>
              </div>
              <div className="setting-item">
                <button className="settings-button warning-btn" onClick={resetCategoriesToDefault}>
                  🔄 Reset Categories to Default
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Calendar Page */}
      {activePage === "calendar" && (
        <div className="calendar-page">
          <CalendarView tasks={tasks} showButterTasks={settings.showButterInCalendar} />
        </div>
      )}

      {/* Profile Page */}
      {activePage === "profile" && (
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <svg className="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
                  <path d="M12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7Z"/>
                  <path d="M12 8.5C13.93 8.5 15.5 10.07 15.5 12S13.93 15.5 12 15.5S8.5 13.93 8.5 12S10.07 8.5 12 8.5Z"/>
                </svg>
              </div>
            </div>
            <div className="profile-info">
              {editingProfile.title ? (
                <input
                  type="text"
                  defaultValue={userProfile.title}
                  autoFocus
                  onBlur={(e) => updateProfile('title', e.target.value)}
                  onKeyDown={(e) => handleProfileKeyDown(e, 'title')}
                  className="profile-edit-input title-input"
                />
              ) : (
                <h1 
                  className="profile-title"
                  onClick={() => setEditingProfile(prev => ({ ...prev, title: true }))}
                >
                  {userProfile.title}
                </h1>
              )}
              
              {editingProfile.name ? (
                <input
                  type="text"
                  defaultValue={userProfile.name}
                  autoFocus
                  onBlur={(e) => updateProfile('name', e.target.value)}
                  onKeyDown={(e) => handleProfileKeyDown(e, 'name')}
                  className="profile-edit-input name-input"
                />
              ) : (
                <p 
                  className="profile-name"
                  onClick={() => setEditingProfile(prev => ({ ...prev, name: true }))}
                >
                  {userProfile.name}
                </p>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{checkedTasks.length}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{butterTasks.length}</div>
              <div className="stat-label">Butter Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="signout-btn" onClick={() => navigate("/login")}>
              🚪 Sign Out
            </button>
          </div>

          <div className="profile-achievements">
            <h3>🏆 Achievements</h3>
            <div className="achievement-grid">
              {getAchievements().map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="badge-icon">{achievement.icon}</div>
                  <div className="badge-content">
                    <div className="badge-text">{achievement.text}</div>
                    <div className="badge-desc">{achievement.desc}</div>
                  </div>
                </div>
              ))}
              {getAchievements().length === 0 && (
                <div className="no-achievements">
                  <p>Complete tasks to unlock achievements! 🎯</p>
                </div>
              )}
            </div>
          </div>

          {/* Home Page Content */}
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
                onClick={() => openCategoryModal(cat.name)}
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
                <p className="no-butter">
                  No quick tasks under 60 minutes yet.
                </p>
                <p className="no-butter">No quick tasks under {settings.butterThreshold} minutes yet.</p>
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
                <div
                  className="toast-fill"
                  style={{ width: `${progress}%` }}
                ></div>
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
      )}
    </div>
  );
}

EditableCategory.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onNameChange: PropTypes.func.isRequired,
  taskCount: PropTypes.number,
  onClick: PropTypes.func,
};

export default MyApp;
