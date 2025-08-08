import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

//  Attach token to each request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
//  USER APIs
//
export const getUserProfile = () => API.get('/users/me');  //Done
export const registerUser = (formData) => API.post("/users/register", formData); //Done
export const loginUser = (data) => API.post("/users/login", data); //Done
export const logoutUser = () => API.get("/users/logout"); //Done
export const updateUserInfo = (data) => API.patch("/users/profile", data); //Done
export const changePassword = (data) => API.patch("/users/password", data); //Done
export const updateAvatar = (formData) => API.patch("/users/avatar", formData); //Done
export const updateCoverImage = (formData) => API.patch("/users/cover", formData); //Done
export const getWatchHistory = () => API.get("/users/history"); //Done

//
//  TWEET APIs
//
export const createTweet = (data) => API.post("/tweets", data); //Done
export const getTweets = () => API.get("/tweets"); //Done
export const updateTweet = (tweetId, data) => API.put(`/tweets/${tweetId}`, data); //Done
export const deleteTweet = (tweetId) => API.delete(`/tweets/${tweetId}`); //Done

//
//  VIDEO APIs
//
export const createVideo = (formData) => API.post("/videos/publish", formData); //Done
export const getAllVideos = () => API.get("/videos"); //Done
export const getVideoById = (videoId) => API.get(`/videos/${videoId}`); //Done
export const deleteVideo = (videoId) => API.delete(`/videos/${videoId}`); // Done
export const updateVideo = (videoId,formData) => API.put(`/videos/${videoId}`, formData); //Done
export const togglePublishStatus = (videoId) => API.patch(`/videos/${videoId}/toggle`);//Done
//
//  COMMENT APIs
//
export const addComment = (videoId, data) => API.post(`/comments/${videoId}`, data); //Done
export const updateComment = (commentId, data) => API.patch(`/comments/update/${commentId}`, data);
export const deleteComment = (commentId) => API.delete(`/comments/delete/${commentId}`);
export const getComments = (videoId) => API.get(`/comments/${videoId}`); //Done

//
//  LIKE APIs
//
export const toggleVideoLike = (videoId) => API.patch(`/likes/videos/${videoId}/toggle`);
export const toggleCommentLike = (commentId) => API.post(`/likes/comment/${commentId}`);
export const toggleTweetLike = (tweetId) => API.post(`/likes/tweet/${tweetId}`);
export const getLikedVideos = () => API.get("/likes/videos");
export const getVideoLikes = (videoId) => API.get(`/likes/videos/${videoId}/count`);

//
//  DASHBOARD APIs
//
export const getChannelStats = (channelId) => API.get(`/dashboard/stats/${channelId}`);  //Done
export const getChannelVideos = (channelId) => API.get(`/dashboard/videos/${channelId}`); //Done

//
//  SUBSCRIPTION APIs
//
export const toggleSubscription = (channelId) => API.post(`/subscriptions/${channelId}/toggle`);
export const getSubscribers = (channelId) => API.get(`/subscriptions/${channelId}/subscribers`);
export const getSubscribedChannels = (userId) => API.get(`/subscriptions/${userId}/channels`);
