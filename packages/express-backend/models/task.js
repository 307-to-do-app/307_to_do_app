import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    urgency: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 1 || value > 10) {
          throw new Error("Invalid Urgency, must be a number between 1 and 10");
        }
      },
    },
    ease: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 1) {
          throw new Error("Invalid Ease, must be a positive number (minutes)");
        }
      },
    },
  },
  { collection: "task_list" },
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
