import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./MyApp";
import "./main.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskFormPage from './TaskFormPage.jsx'; // create this next

const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyApp />} />
          <Route path="/add-task" element={<TaskFormPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
