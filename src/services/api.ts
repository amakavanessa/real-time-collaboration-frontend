import axios from "axios";

// export const BASE_URL = "http://localhost:8080/";
export const BASE_URL = "https://real-time-collaboration-backend.onrender.com/";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default API;
