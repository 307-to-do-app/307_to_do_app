import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyApp from "./pages/MyApp";
import TaskFormPage from "./components/TaskFormPage.jsx";
import Login from "./pages/Login";
import Signup from "./components/Signup";

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
