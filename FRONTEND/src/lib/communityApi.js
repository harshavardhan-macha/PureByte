import api, { getApiErrorMessage } from "../utils/axiosInstance";

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const cloudinaryApiKey = import.meta.env.VITE_CLOUDINARY_API_KEY?.trim();

export { getApiErrorMessage };

export const getCommunityPosts = () => api.get("/community/posts");

export const getCommunityStats = () => api.get("/community/stats");

export const uploadImageToCloudinary = async (imageFile) => {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  const form = new FormData();
  form.append("file", imageFile);
  form.append("upload_preset", cloudinaryUploadPreset);
  if (cloudinaryApiKey) {
    form.append("api_key", cloudinaryApiKey);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: form,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  return data.secure_url;
};

export const createCommunityPost = (imageInput, caption) => {
  const form = new FormData();

  if (typeof imageInput === "string") {
    form.append("imageUrl", imageInput);
  } else {
    form.append("image", imageInput);
  }

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
  if (imageUrl.startsWith("/uploads")) return imageUrl;
  const base = import.meta.env.VITE_API_URL?.trim();
  if (!base) return imageUrl;
  return `${base.replace(/\/$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

export default api;
