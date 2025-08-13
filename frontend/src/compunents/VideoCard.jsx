import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  const thumbnail = video?.thumbnail;
  const videoUrl = video?.videoFile;
  const videoId = video?._id;
  const title = video?.title;
  const channel = video?.owner?.username;
  const views = video?.views || 0;
  const duration = video?.duration;

  const isDesktop = () => window.innerWidth >= 1024;

  // Convert seconds to "mm:ss" format
const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};


  return (
    <Link
      to={`/watch/${videoId}`}
      className="block bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition relative"
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
            e.target.currentTime = 0;
          }}
        ></video>
      ) : (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-60 object-cover"
        />
      )}

      {/* Duration Overlay */}
      {duration && (
        <span className="absolute top-50 right-3 bg-gray-900 bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
           {formatDuration(video?.duration)}
        </span>
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
