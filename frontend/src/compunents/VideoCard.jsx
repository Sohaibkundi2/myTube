import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  const thumbnail = video?.thumbnail;
  const videoUrl = video?.videoFile;
  const videoId = video?._id;
  const title = video?.title;
  const channel = video?.owner?.username;
  const views = video?.views || 0;

  // Helper to check if desktop
  const isDesktop = () => window.innerWidth >= 1024;

  return (
    <Link
      to={`/video/${videoId}`}
      className="block bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      {/* Video or Thumbnail */}
      {isDesktop() ? (
        <video
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-60 object-cover"
          preload="metadata"
          muted
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause();
            e.target.currentTime = 0; // reset to start
          }}
        ></video>
      ) : (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-60 object-cover"
        />
      )}

      {/* Info Section */}
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{title}</h3>
        <p className="text-gray-400 text-sm">{channel}</p>
        <p className="text-gray-500 text-xs">{views} views</p>
      </div>
    </Link>
  );
}
