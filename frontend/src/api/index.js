import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// 🔐 Attach token to each request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// 🧑 USER APIs
//
export const registerUser = (formData) => API.post("/users/register", formData);
export const loginUser = (data) => API.post("/users/login", data);
export const getCurrentUser = () => API.get("/users/current-user");
export const logoutUser = () => API.get("/users/logout");
export const updateUserInfo = (data) => API.patch("/users/update-account", data);
export const changePassword = (data) => API.patch("/users/change-password", data);
export const updateAvatar = (formData) => API.patch("/users/avatar", formData);
export const updateCoverImage = (formData) => API.patch("/users/cover-image", formData);
export const getWatchHistory = () => API.get("/users/history");

//
// 🐦 TWEET APIs
//
export const createTweet = (data) => API.post("/tweets", data);
export const getTweets = () => API.get("/tweets");
export const updateTweet = (tweetId, data) => API.patch(`/tweets/${tweetId}`, data);
export const deleteTweet = (tweetId) => API.delete(`/tweets/${tweetId}`);

//
// 🎥 VIDEO APIs
//
export const createVideo = (formData) => API.post("/videos", formData);
export const getAllVideos = () => API.get("/videos");
export const getVideoById = (videoId) => API.get(`/videos/${videoId}`);
export const togglePublish = (videoId) => API.patch(`/videos/publish/${videoId}`);

//
// 💬 COMMENT APIs
//
export const addComment = (videoId, data) => API.post(`/comments/${videoId}`, data);
export const updateComment = (commentId, data) => API.patch(`/comments/${commentId}`, data);
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);
export const getComments = (videoId) => API.get(`/comments/${videoId}`);

//
// ❤️ LIKE APIs
//
export const toggleVideoLike = (videoId) => API.post(`/likes/video/${videoId}`);
export const toggleCommentLike = (commentId) => API.post(`/likes/comment/${commentId}`);
export const toggleTweetLike = (tweetId) => API.post(`/likes/tweet/${tweetId}`);
export const getLikedVideos = () => API.get("/likes/videos");

//
// 📊 DASHBOARD APIs
//
export const getChannelStats = (channelId) => API.get(`/dashboard/stats/${channelId}`);
export const getChannelVideos = (channelId) => API.get(`/dashboard/videos/${channelId}`);

//
// 📬 SUBSCRIPTION APIs
//
export const toggleSubscription = (channelId) => API.post(`/subscriptions/${channelId}`);
export const getSubscribers = (channelId) => API.get(`/subscriptions/${channelId}/subscribers`);
export const getSubscribedChannels = (userId) => API.get(`/subscriptions/${userId}/channels`);
