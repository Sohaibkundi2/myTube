import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import VideoCard from "../compunents/VideoCard"
import {
  getVideoById,
  getAllVideos,
  getComments,
  addComment,
  toggleVideoLike,
  toggleSubscription,
  getSubscribers
} from "../api"


export default function VideoPlayerPage() {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [otherVideos, setOtherVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
        setComments(commentRes.data?.docs || []);
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
      if (video?.owner?._id) {
        try {
          const res = await getSubscribers(video.owner._id);
          setSubscribers(res.data?.data || []);
        } catch (err) {
          console.error("Failed to load subscribers:", err);
        }
      }
    };

    fetchSubscribers();
  }, [video?.owner?._id]);



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
              className={`btn btn-sm ${isSubscribed ? "btn-success" : "btn-outline"}`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
            <p className="text-sm text-gray-500">
              {subscribers.length} subscriber{subscribers.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn btn-primary">
            Post
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="bg-base-200 p-3 rounded">
                <p className="text-sm font-medium">{c.owner?.username}</p>
                <p className="text-sm text-gray-600">{c.content}</p>
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
