// /services/discussionApi.js
import api from "./api";

// Discussions
export const getAllDiscussions = () => api.get("/discussions");
export const createDiscussion = (data) => api.post("/discussions", data);
export const getDiscussionById = (id) => api.get(`/discussions/${id}`);
export const addReplyToDiscussion = (id, data) =>
  api.post(`/discussions/${id}/comment`, data); // ✅ match backend