import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MODE,
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
export const isUserPresent = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};
export const userProfile = async (id) => {
  let res;
  if (id) {
    res = await api.get(`/auth/check/${id}`);
  } else {
    res = await api.get("/auth/check");
  }
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
export const updateProblem = async ({ id, formData }) => {
  const res = await api.put(`/problems/update-problem/${id}`, formData);
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
export const addProblemToPlaylsit = async ({ playlistId, problemIds }) => {
  const res = await api.post(`/playlists/${playlistId}/add-problem`, {
    problemIds,
  });
  return res.data;
};
export const executeCode = async (payload) => {
  const res = await api.post("/execute/", payload);
  return res.data;
};
export const submitCode = async (payload) => {
  const res = await api.post("/execute/compile", payload);
  return res.data;
};
export const getOneSubmission = async (id) => {
  const res = await api.get(`/submissions/getone/${id}`);
  return res.data;
};

export const submitSolution = async (payload) => {
  const res = await api.post("/solutions/create", payload);
  return res.data;
};

export const getAllSolutionToProblem = async (id) => {
  const res = await api.get(`/solutions/getall/${id}`);
  return res.data;
};
export const getoneSolution = async (id) => {
  const res = await api.get(`/solutions/getone/${id}`);
  return res.data;
};
export const likeSolution = async (id) => {
  const res = await api.post(`/solutions/like/${id}`);
  return res.data;
};
export const createComment = async (solutionId) => {
  const res = await api.post(`/solutions/create-comment`, solutionId);
  return res.data;
};
export const getAllSheets = async () => {
  const res = await api.get(`/playlists/getall`);
  return res.data;
};
export const generatePlaylist = async (formData) => {
  const res = await api.post(`/suggestion/`, formData);
  return res.data;
};
export const getOnePlaylist = async (playlistId) => {
  const res = await api.get(`playlists/get/${playlistId}`);
  return res.data;
};
export const deleteProblemFromList = async (id) => {
  const res = await api.delete(`problems/delete-problem/${id}`);
  return res.data;
};
export const deleteProblemFromPlaylist = async ({ playlistId, problemIds }) => {
  const res = await api.post(`playlists/${playlistId}/remove-problem`, {
    problemIds: [problemIds],
  });
  return res.data;
};
export const deletePlaylist = async (playlistId) => {
  const res = await api.delete(`playlists/${playlistId}/delete-playlist`);
  return res.data;
};
export default api;
