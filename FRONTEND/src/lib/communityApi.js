import api, { getApiErrorMessage } from "../utils/axiosInstance";

export { getApiErrorMessage };

export const getCommunityPosts = () => api.get("/community/posts");

export const getCommunityStats = () => api.get("/community/stats");

export const createCommunityPost = (imageFile, caption) => {
  const form = new FormData();
  form.append("image", imageFile);
  if (caption) form.append("caption", caption);
  return api.post("/community/posts", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const togglePostLike = (postId) => api.post(`/community/posts/${postId}/like`);

export const getPostComments = (postId) => api.get(`/community/posts/${postId}/comments`);

export const addPostComment = (postId, text) =>
  api.post(`/community/posts/${postId}/comments`, { text });

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_API_URL || "https://purebyte.onrender.com";
  return `${base}${imageUrl}`;
};

export default api;
