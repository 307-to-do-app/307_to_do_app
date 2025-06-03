import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskFunction from "./task-functions.js";
import User from "./models/user.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Database connection - using MONGO_URI from your .env file
const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/crumblist";

console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Crumblist API is running!",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Success!
    return res
      .status(200)
      .json({ message: "Login successful.", user: username });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login." });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken." });
    }

    // Create and save new user
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error during signup." });
  }
});

app.get("/tasks/:id", (req, res) => {
  taskFunction
    .findTaskById(req.params.id)
    .then((task) => {
      if (!task) return res.status(404).send("task not found");
      res.send(task);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error fetching task");
    });
});

app.get("/tasks", (req, res) => {
  const { due_date, urgency, ease } = req.query;
  taskFunction
    .getTasks(due_date, urgency, ease)
    .then((tasks) => res.send({ task_list: tasks }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("error fetching tasks");
    });
});

app.post("/tasks", (req, res) => {
  console.log("Received task data:", req.body);

  // Validate required fields
  if (!req.body.name || !req.body.category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  taskFunction
    .addTask(req.body)
    .then((newTask) => {
      console.log("Task added successfully:", newTask);
      res.status(201).json(newTask);
    })
    .catch((err) => {
      console.error("Error adding task:", err);
      res
        .status(400)
        .json({ error: "Error adding task", details: err.message });
    });
});

app.delete("/tasks/:id", (req, res) => {
  taskFunction
    .deleteTaskById(req.params.id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("task not found");
      res.status(204).send(); // no content, success
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error deleting task");
    });
});

app.listen(port, () => {
  console.log(`Crumblist API server running on port ${port}`);
  console.log(
    `Database connection: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}`,
  );
});
