import React from "react";
import PropTypes from "prop-types";

const CuteBread = ({ size = "40px", className = "" }) => {
  return (
    <div
      className={`cute-bread ${className}`}
      style={{ width: size, height: size }}
    >
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

export default CuteBread;
