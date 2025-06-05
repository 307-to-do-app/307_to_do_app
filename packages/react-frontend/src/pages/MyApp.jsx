import React, { useState, useEffect, useRef } from "react";
import CalendarView from "../components/CalendarView";
import { useSettings } from "../hooks/useSettings";
import { useProfile } from "../hooks/useProfile";
import { getAchievements, breadQuotes } from "../achievements";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryPage from "../components/CategoryPage";
import { useTasks } from "../hooks/useTasks";
import ProfilePage from "../components/ProfilePage";
import SettingsPage from "../components/SettingsPage";
import MainPage from "../components/MainPage";
import Sidebar from "../components/Sidebar";

function MyApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [activePage, setActivePage] = useState("home");

  const { tasks, checkedTasks, progress, toggleChecked, completeCheckedTasks } =
    useTasks();

  // Custom hooks
  const {
    settings,
    updateSetting,
    requestNotificationPermission,
    clearCompletedTasks,
    resetCategoriesToDefault,
  } = useSettings();
  const {
    userProfile,
    editingProfile,
    setEditingProfile,
    updateProfile,
    handleProfileKeyDown,
  } = useProfile();

  // Quote state
  const [quote, setQuote] = useState(() => {
    const randomQuote =
      breadQuotes[Math.floor(Math.random() * breadQuotes.length)];
    return `${randomQuote} – Mr. Crumb`;
  });

  // Categories state
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

  // Task filtering
  const butterTasks = tasks
    .filter((task) => Number(task.ease) < settings.butterThreshold)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const normalTasks = tasks.filter(
    (task) => Number(task.ease) >= settings.butterThreshold,
  );
  const butterTaskIds = butterTasks.map((task) => task._id);
  const selectedButterIds = checkedTasks.filter((id) =>
    butterTaskIds.includes(id),
  );

  const tasksByCategory = {};
  categories.forEach((cat) => {
    tasksByCategory[cat.name] = normalTasks
      .filter((task) => task.category?.toLowerCase() === cat.name.toLowerCase())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  });

  const achievements = getAchievements(
    tasks,
    butterTasks,
    progress,
    checkedTasks,
    categories,
  );

  // Save categories
  useEffect(() => {
    localStorage.setItem("crumblist-categories", JSON.stringify(categories));
  }, [categories]);

  // Apply themes
  useEffect(() => {
    document.body.className = `theme-${settings.colorTheme} ${settings.darkMode ? "dark-mode" : ""}`;
    const pinkBg = document.querySelector(".pink-background");
    if (pinkBg) {
      pinkBg.className = `pink-background theme-${settings.colorTheme} ${settings.darkMode ? "dark-mode" : ""}`;
    }
  }, [settings.darkMode, settings.colorTheme]);

  // Sidebar outside click
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
    localStorage.setItem("crumblist-categories", JSON.stringify(categories));
  }, [categories]);

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

  const updateCategoryName = (index, newName) => {
    const updated = [...categories];
    updated[index].name = newName;
    setCategories(updated);
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

          {/* Sidebar */}
          <Sidebar
            sidebarRef={sidebarRef}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            setActivePage={setActivePage}
          />

          {/* Settings Page */}
          {activePage === "settings" && (
            <SettingsPage
              settings={settings}
              updateSetting={updateSetting}
              requestNotificationPermission={requestNotificationPermission}
              clearCompletedTasks={clearCompletedTasks}
              resetCategoriesToDefault={resetCategoriesToDefault}
              setCategories={setCategories}
            />
          )}

          {/* Calendar Page */}
          {activePage === "calendar" && (
            <div className="calendar-page">
              <CalendarView
                tasks={tasks}
                showButterTasks={settings.showButterInCalendar}
              />
            </div>
          )}

          {/* Profile Page */}
          {activePage === "profile" && (
            <ProfilePage
              userProfile={userProfile}
              editingProfile={editingProfile}
              setEditingProfile={setEditingProfile}
              updateProfile={updateProfile}
              handleProfileKeyDown={handleProfileKeyDown}
              tasks={tasks}
              checkedTasks={checkedTasks}
              butterTasks={butterTasks}
              progress={progress}
              achievements={achievements}
              navigate={navigate}
            />
          )}

          {/* Main Page */}
          {activePage === "home" && (
            <MainPage
              setActivePage={setActivePage}
              categories={categories}
              updateCategoryName={updateCategoryName}
              tasksByCategory={tasksByCategory}
              butterTasks={butterTasks}
              checkedTasks={checkedTasks}
              toggleChecked={toggleChecked}
              completeCheckedTasks={completeCheckedTasks}
              selectedButterIds={selectedButterIds}
              navigate={navigate}
              quote={quote}
              progress={progress}
            />
          )}
        </>
      )}
    </div>
  );
}

export default MyApp;
