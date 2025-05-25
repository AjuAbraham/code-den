import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

export const signUpUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

export default api;
