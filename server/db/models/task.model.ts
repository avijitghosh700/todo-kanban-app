import mongoose from "mongoose";

const Tasks = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Tasks", Tasks);

export default Task;
