import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

console.log(process.env.REACT_APP_BASE_URL);

export const addTask = (payload) => {
  return axios.post("/task/add", payload);
};

export const updateTask = (payload) => {
  return axios.put("/task/update", payload);
};

export const deleteTask = (id) => {
  return axios.delete(`/task/delete?id=${id}`);
};

export const getAllTask = () => {
  return axios.get("/task/getAllTasks");
};
