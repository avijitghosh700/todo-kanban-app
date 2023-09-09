import Task from "../db/models/task.model";

import http_code from "http-status-codes";

const taskStageSetter = (status: string) => {
  switch (status) {
    case "TODO":
      return {
        isDone: false,
        isProgress: false,
        isTodo: true,
      };
    case "PROGRESS":
      return {
        isDone: false,
        isProgress: true,
        isTodo: false,
      };
    case "DONE":
      return {
        isDone: true,
        isProgress: false,
        isTodo: false,
      };

    default:
      return {
        isDone: false,
        isProgress: false,
        isTodo: true,
      };
  }
};

let taskService = {
  async add(data: any) {
    try {
      let response = await Task.create({
        status: data.status.toUpperCase(),
        ...data,
      });

      return {
        status: http_code.OK,
        data: {
          status: true,
          message: "Task added successfully",
          data: {
            id: response._id,
            title: response.title,
            description: response.description,
            ...taskStageSetter(response.status),
          },
        },
      };
    } catch (error: any) {
      return {
        status: http_code.INTERNAL_SERVER_ERROR,
        data: {
          status: false,
          message: error.message,
        },
      };
    }
  },

  async update(data: any) {
    try {
      let response = await Task.updateOne(
        { _id: data.id },
        {
          $set: {
            title: data.title,
            description: data.description,
            status: data.status,
          },
          $currentDate: {
            lastModified: true,
          },
        }
      );

      console.log(response);

      return {
        status: http_code.OK,
        data: {
          message: "Task updated successfully.",
        },
      };
    } catch (error: any) {
      return {
        status: http_code.INTERNAL_SERVER_ERROR,
        data: {
          status: false,
          message: error.message,
        },
      };
    }
  },

  async delete(id: string) {
    try {
      let response = await Task.deleteOne({ _id: id });

      return {
        status: http_code.OK,
        data: {
          message: "Task deleted successfully.",
          success: response.acknowledged,
        },
      };
    } catch (error: any) {
      return {
        status: http_code.INTERNAL_SERVER_ERROR,
        data: {
          status: false,
          message: error.message,
        },
      };
    }
  },

  async getAllTasks() {
    try {
      const TODOS = await Task.find({ status: "TODO" });
      const PROGRESS = await Task.find({ status: "PROGRESS" });
      const DONE = await Task.find({ status: "DONE" });

      return {
        status: http_code.OK,
        data: {
          success: true,
          TODOS: TODOS.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            ...taskStageSetter(task.status),
          })),
          PROGRESS: PROGRESS.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            ...taskStageSetter(task.status),
          })),
          DONE: DONE.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            ...taskStageSetter(task.status),
          })),
        },
      };
    } catch (error: any) {
      return {
        status: http_code.INTERNAL_SERVER_ERROR,
        data: {
          status: false,
          message: error.message,
        },
      };
    }
  },
};

export default taskService;
