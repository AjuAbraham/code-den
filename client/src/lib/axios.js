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
export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};
export const logoutUser = async (user) => {
  const res = await api.post("/auth/logout", user);
  return res.data;
};
export const topContributers = async () => {
  const res = await api.get("/auth/top");
  return res.data;
};

export const createProblem = async (formData) => {
  const res = await api.post("/problems/create", formData);
  return res.data;
};
export const getOneProblem = async (id) => {
  const res = await api.get(`/problems/get/${id}`);
  return res.data;
};

export const getAllProblems = async () => {
  const res = await api.get("/problems/getall");
  return res.data;
};

export const createPlaylist = async (formData) => {
  const res = await api.post("/playlists/create", formData);
  return res.data;
};

export default api;
