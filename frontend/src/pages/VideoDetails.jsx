import React, { useEffect, useState } from "react";
import { getAllVideos } from "../api";
import VideoCard from "../compunents/VideoCard";
import { useNavigate } from "react-router-dom";

const VideoDetails = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getAllVideos();
        setVideos(res.data?.data?.videos || []);
      } catch (err) {
        console.error("Failed to load videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Heading and Button in a Flexbox Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Videos</h1>
        <button
          onClick={() => navigate("/upload-video")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition"
        >
          + Add Video
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-500">No videos available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
