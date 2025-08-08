import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import VideoCard from "../compunents/VideoCard"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import {
  getVideoById,
  getAllVideos,
  getComments,
  addComment,
  toggleVideoLike,
  toggleSubscription,
  getSubscribers,
  deleteComment,
  updateComment
} from "../api"


export default function VideoPlayerPage() {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [otherVideos, setOtherVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const [subscribers, setSubscribers] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [singleRes, allRes, commentRes] = await Promise.all([
          getVideoById(videoId),
          getAllVideos(),
          getComments(videoId),
        ]);

        const videoData = singleRes.data?.data || null;
        setVideo(videoData);

        setOtherVideos(
          allRes.data?.data?.videos?.filter((v) => v._id !== videoId) || []
        );
        setComments(commentRes?.data.data?.docs || []);
      } catch (err) {
        console.error("Failed to load video, comments, or suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (video?.owner?._id && user?._id) {
        try {
          const res = await getSubscribers(video.owner._id);
          const subs = res.data?.data || [];

          setSubscribers(subs);
          const isUserSubscribed = subs.some(sub => sub.subscriber._id === user._id);
          setIsSubscribed(isUserSubscribed);

          console.log("Subscribers:", subs);
          console.log("Is subscribed:", isUserSubscribed);
        } catch (err) {
          console.error("Failed to load subscribers:", err);
        }
      }
    };

    fetchSubscribers();
  }, [video?.owner?._id, user?._id]);




  // like
  const handleLike = async () => {
    try {
      await toggleVideoLike(videoId);
      // Optional: update UI
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSubscribe = async () => {

    if (!user) {
      alert("Please login to subscribe.");
      navigate('/login')
    }
    try {
      await toggleSubscription(video.owner._id);
      setIsSubscribed((prev) => !prev);
      const res = await getSubscribers(video.owner._id);
      setSubscribers(res.data?.data || []);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong while subscribing.";
      alert(msg);
      console.error("Subscribe failed", err);
    }
  };


  // comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await addComment(videoId, { content: newComment });
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  // edit comment 
  const startEditing = (id, content) => {
    setEditingCommentId(id);
    setEditedContent(content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };


  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    try {
      const res = await updateComment(commentId, { content: editedContent });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.data : c))
      );
      cancelEditing();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };







  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!video) return <div className="p-6 text-center">Video not found.</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto px-4 py-6">
      {/* Main Video Player and Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold">{video.title}</h2>

        {/* Views + Date */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Uploader + Subscribe Section */}
        <div className="flex items-center gap-4 mt-2">
          <img
            src={video.owner?.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt={video.owner?.username}
          />
          <div>
            <p className="font-semibold">{video.owner?.username}</p>
            <p className="text-xs text-gray-500">Uploader</p>
          </div>

          {/* Subscribe + Like */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 ml-auto">
            <button onClick={handleLike} className="btn btn-sm btn-outline">
              ❤️ Like
            </button>
            <button
              onClick={handleSubscribe}
              disabled={!user}
              className={`btn btn-sm ${isSubscribed ? "btn-success" : "btn-outline"} ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {!user ? "Login to Subscribe" : isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
            <p className="text-sm text-gray-500">
              {subscribers.length} subscriber{subscribers.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2 mt-4">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Add Commnet
          </button>
        </form>

        {/* Comment Form */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="bg-base-200 p-4 rounded flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={c.owner?.avatar || "/default-avatar.png"}
                    alt={c.owner?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <div>
                      <p className="font-semibold text-blue-500 text-sm">{c.owner?.fullName}</p>
                      <p className="text-xs text-gray-500">@{c.owner?.username}</p>
                    </div>
                    <span className="text-xs text-gray-500">{dayjs(c.createdAt).fromNow()}</span>
                  </div>

                  {editingCommentId === c._id ? (
                    <form
                      onSubmit={(e) => handleUpdateComment(e, c._id)}
                      className="flex flex-col sm:flex-row gap-2 mt-2 w-full"
                    >
                      <input
                        type="text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="input input-sm w-full focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-transparent sm:flex-1"
                      />
                      <div className="flex flex-col gap-2">
                        <button type="submit" className="btn btn-sm btn-success w-full sm:w-auto">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="btn btn-sm btn-ghost w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-300 break-words">{c.content}</p>
                  )}
                </div>

                {c.owner._id === user._id && (
                  <div className="flex flex-col gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => startEditing(c._id, c.content)}
                      className="btn btn-xs btn-outline border border-gray-400 w-full sm:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="btn btn-xs btn-error w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Sidebar with Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Up next</h3>
        {otherVideos.length === 0 ? (
          <p className="text-gray-500">No other videos found.</p>
        ) : (
          otherVideos.slice(0, 6).map((v) => (
            <VideoCard key={v._id} video={v} />
          ))
        )}
      </div>
    </div>
  );

}
