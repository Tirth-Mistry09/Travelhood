import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("traveloop_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data)  => API.post("/auth/signup", data),
  login:  (data)  => API.post("/auth/login",  data),
};

export const tripsAPI = {
  create:  (data) => API.post("/trips",      data),
  getAll:  ()     => API.get("/trips"),
  getById: (id)   => API.get(`/trips/${id}`),
  update:  (id, data) => API.put(`/trips/${id}`, data),
  delete:  (id)   => API.delete(`/trips/${id}`),
};

export const stopsAPI = {
  create:     (data)   => API.post("/stops",          data),
  getByTrip:  (tripId) => API.get(`/stops/${tripId}`),
  delete:     (id)     => API.delete(`/stops/${id}`),
};

export const activitiesAPI = {
  create:    (data)   => API.post("/activities",        data),
  getByStop: (stopId) => API.get(`/activities/${stopId}`),
  delete:    (id)     => API.delete(`/activities/${id}`),
};

export const budgetAPI = {
  getByTrip: (tripId) => API.get(`/budget/${tripId}`),
};

export const checklistAPI = {
  add:    (data) => API.post("/checklist",    data),
  getAll: (tripId) => API.get(`/checklist/${tripId}`),
  update: (id, data) => API.put(`/checklist/${id}`, data),
  delete: (id)   => API.delete(`/checklist/${id}`),
};

export const notesAPI = {
  create:    (data)   => API.post("/notes",          data),
  getByTrip: (tripId) => API.get(`/notes/${tripId}`),
  update:    (id, data) => API.put(`/notes/${id}`,   data),
  delete:    (id)     => API.delete(`/notes/${id}`),
};

export const shareAPI = {
  share:     (tripId)    => API.post(`/share/public/${tripId}`),
  getPublic: (shareCode) => API.get(`/share/public/${shareCode}`),
};

export const aiAPI = {
  planTrip: (data) => API.post("/ai/plan-trip", data),
};

export const adminAPI = {
  getStats: () => API.get("/admin/stats"),
};