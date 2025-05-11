import axios from "./axiosConfig";

export const registerUser = (userData) =>
  axios.post("/auth/register", userData);
export const loginUser = (credentials) =>
  axios.post("/auth/login", credentials);
