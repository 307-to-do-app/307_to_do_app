import React from "react";
import { useProfile } from "../hooks/useProfile";
import PropTypes from "prop-types";

const ProfilePage = ({
  tasks,
  checkedTasks,
  butterTasks,
  progress,
  achievements,
  navigate,
}) => {
  const {
    userProfile,
    editingProfile,
    setEditingProfile,
    updateProfile,
    handleProfileKeyDown,
  } = useProfile();

  return (
    <div className="profile-page">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <svg
                className="avatar-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9Z" />
                <path d="M12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7Z" />
                <path d="M12 8.5C13.93 8.5 15.5 10.07 15.5 12S13.93 15.5 12 15.5S8.5 13.93 8.5 12S10.07 8.5 12 8.5Z" />
              </svg>
            </div>
          </div>
          <div className="profile-info">
            {editingProfile.title ? (
              <input
                type="text"
                defaultValue={userProfile.title}
                autoFocus
                onBlur={(e) => updateProfile("title", e.target.value)}
                onKeyDown={(e) => handleProfileKeyDown(e, "title")}
                className="profile-edit-input title-input"
              />
            ) : (
              <h1
                className="profile-title"
                onClick={() =>
                  setEditingProfile((prev) => ({ ...prev, title: true }))
                }
              >
                {userProfile.title}
              </h1>
            )}

            {editingProfile.name ? (
              <input
                type="text"
                defaultValue={userProfile.name}
                autoFocus
                onBlur={(e) => updateProfile("name", e.target.value)}
                onKeyDown={(e) => handleProfileKeyDown(e, "name")}
                className="profile-edit-input name-input"
              />
            ) : (
              <p
                className="profile-name"
                onClick={() =>
                  setEditingProfile((prev) => ({ ...prev, name: true }))
                }
              >
                {userProfile.name}
              </p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">
              {Array.isArray(tasks) ? tasks.length : 0}
            </div>
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
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-badge">
                <div className="badge-icon">{achievement.icon}</div>
                <div className="badge-content">
                  <div className="badge-text">{achievement.text}</div>
                  <div className="badge-desc">{achievement.desc}</div>
                </div>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="no-achievements">
                <p>Complete tasks to unlock achievements! 🎯</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  tasks: PropTypes.array.isRequired,
  checkedTasks: PropTypes.array.isRequired,
  butterTasks: PropTypes.array.isRequired,
  progress: PropTypes.number.isRequired,
  achievements: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ProfilePage;
