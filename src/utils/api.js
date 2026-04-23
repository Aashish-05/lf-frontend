import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// 🔐 token auto attach
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ✅ ITEMS
export const getAllItems = () => API.get("/items");
export const searchItems = (name) => API.get(`/items/search?name=${name}`);
export const addItem = (data) => API.post("/items", data);
export const deleteItem = (id) => API.delete(`/items/${id}`);

export default API;