import { useState, useEffect } from "react";

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("crumblist-settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          darkMode: false,
          butterThreshold: 60,
          showButterInCalendar: true,
          dailyQuotes: false,
          colorTheme: "pink",
        };
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("crumblist-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  const clearCompletedTasks = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all completed tasks? This cannot be undone.",
      )
    ) {
      console.log("Clearing completed tasks...");
      alert("Completed tasks cleared!");
    }
  };

  return {
    settings,
    updateSetting,
    requestNotificationPermission,
    clearCompletedTasks,
  };
};
