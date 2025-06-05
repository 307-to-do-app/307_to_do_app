import React from "react";
import PropTypes from "prop-types";

const Sidebar = ({
  sidebarRef,
  sidebarOpen,
  setSidebarOpen,
  setActivePage,
}) => {
  const handleNavigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
        ×
      </button>
      <ul>
        <li>
          <button
            className="sidebar-link"
            onClick={() => handleNavigate("home")}
          >
            🏠 Home
          </button>
        </li>
        <li>
          <button
            className="sidebar-link"
            onClick={() => handleNavigate("calendar")}
          >
            📆 Calendar View
          </button>
        </li>
        <li>
          <button
            className="sidebar-link"
            onClick={() => handleNavigate("profile")}
          >
            👤 Profile
          </button>
        </li>
        <li>
          <button
            className="sidebar-link"
            onClick={() => handleNavigate("settings")}
          >
            ⚙️ Settings
          </button>
        </li>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarRef: PropTypes.object.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  setActivePage: PropTypes.func.isRequired,
};

export default Sidebar;
