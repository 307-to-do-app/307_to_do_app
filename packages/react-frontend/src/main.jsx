import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyApp from "./MyApp";
import TaskFormPage from "./TaskFormPage";
import Login from "./Login"; // also near your other imports
import Signup from "./Signup";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp />} />
        <Route path="/add-task" element={<TaskFormPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/:categoryName" element={<MyApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
