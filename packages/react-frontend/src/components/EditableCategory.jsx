import React, { useState } from "react";
import PropTypes from "prop-types";

const EditableCategory = ({
  name,
  index,
  taskCount,
  onNameChange,
  onClick,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleBlur = () => {
    if (tempName.trim() && tempName !== name) {
      onNameChange(index, tempName.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setTempName(name);
      setEditing(false);
    }
  };

  return (
    <div
      className="category-box"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {editing ? (
        <input
          type="text"
          value={tempName}
          autoFocus
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="category-edit-input"
        />
      ) : (
        <h3
          className="category-name"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click
            setEditing(true);
          }}
        >
          {name}
        </h3>
      )}
      <p className="task-count">({taskCount} tasks)</p>
    </div>
  );
};

EditableCategory.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  taskCount: PropTypes.number,
  onNameChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default EditableCategory;
