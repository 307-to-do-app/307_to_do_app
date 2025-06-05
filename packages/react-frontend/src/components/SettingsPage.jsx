import React from "react";
import PropTypes from "prop-types";

const SettingsPage = ({
  settings,
  updateSetting,
  requestNotificationPermission,
  clearCompletedTasks,
  resetCategoriesToDefault,
  setCategories,
}) => {
  return (
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
                onChange={(e) => updateSetting("darkMode", e.target.checked)}
              />
              Enable Dark Mode
            </label>
          </div>
          <div className="setting-item">
            <label>
              Color Theme:
              <select
                value={settings.colorTheme}
                onChange={(e) => updateSetting("colorTheme", e.target.value)}
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
                onChange={(e) =>
                  updateSetting("butterThreshold", Number(e.target.value))
                }
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
                onChange={(e) =>
                  updateSetting("showButterInCalendar", e.target.checked)
                }
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
                  updateSetting("dailyQuotes", e.target.checked);
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
            <button
              className="settings-button danger-btn"
              onClick={clearCompletedTasks}
            >
              🗑️ Clear All Completed Tasks
            </button>
          </div>
          <div className="setting-item">
            <button
              className="settings-button warning-btn"
              onClick={() => resetCategoriesToDefault(setCategories)}
            >
              🔄 Reset Categories to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SettingsPage.propTypes = {
  settings: PropTypes.shape({
    darkMode: PropTypes.bool.isRequired,
    colorTheme: PropTypes.string.isRequired,
    butterThreshold: PropTypes.number.isRequired,
    showButterInCalendar: PropTypes.bool.isRequired,
    dailyQuotes: PropTypes.bool.isRequired,
  }).isRequired,
  updateSetting: PropTypes.func.isRequired,
  requestNotificationPermission: PropTypes.func.isRequired,
  clearCompletedTasks: PropTypes.func.isRequired,
  resetCategoriesToDefault: PropTypes.func.isRequired,
  setCategories: PropTypes.func.isRequired,
};

export default SettingsPage;
