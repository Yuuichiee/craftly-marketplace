import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

// Response interceptor — surfaces error messages cleanly
newRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default newRequest;
