// logic only, manages the user profle

import { useState, useEffect } from "react";

export const useProfile = () => {
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem("crumblist-profile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "Your Name",
          title: "Task Master",
        };
  });

  const [editingProfile, setEditingProfile] = useState({
    name: false,
    title: false,
  });

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem("crumblist-profile", JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = (field, value) => {
    if (field === "editName") {
      setEditingProfile((prev) => ({ ...prev, name: true }));
    } else if (field === "editTitle") {
      setEditingProfile((prev) => ({ ...prev, title: true }));
    } else {
      setUserProfile((prev) => {
        const updated = { ...prev, [field]: value };
        localStorage.setItem("crumblist-profile", JSON.stringify(updated));
        return updated;
      });
      setEditingProfile((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleProfileKeyDown = (e, field) => {
    if (e.key === "Enter") {
      updateProfile(field, e.target.value);
    }
  };

  return {
    userProfile,
    editingProfile,
    updateProfile,
    handleProfileKeyDown,
  };
};
