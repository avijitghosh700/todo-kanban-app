import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

console.log(process.env.REACT_APP_BASE_URL);

export const addTask = (payload) => {
  return axios.post("/api/task/add", payload);
};

export const updateTask = (payload) => {
  return axios.put("/api/task/update", payload);
};

export const deleteTask = (id) => {
  return axios.delete(`/api/task/delete?id=${id}`);
};

export const getAllTask = () => {
  return axios.get("/api/task/getAllTasks");
};
