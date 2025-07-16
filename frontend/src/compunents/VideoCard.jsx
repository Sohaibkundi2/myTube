import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  if (!video) return null;

  const {
    _id,
    title,
    thumbnail,
    owner,
    views = 0,
    createdAt,
  } = video;

  return (
<Link
  to={`/watch/${_id}`}
  className="flex flex-col gap-4 w-full bg-base-100 p-3 rounded-xl shadow hover:shadow-lg transition-shadow"
>
  {/* Thumbnail */}
  <img
    src={thumbnail}
    alt={title}
    className="w-full h-60 object-cover rounded-md"
  />

  {/* Video Info */}
  <div className="flex flex-col justify-start gap-2">
    <h3 className="text-md font-semibold line-clamp-2">{title}</h3>

    <div className="flex items-center gap-2">
      <img
        src={owner?.avatar || "/default-avatar.png"}
        alt={owner?.username || "Uploader"}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-sm text-gray-600">{owner?.username || "Unknown"}</span>
    </div>

    <div className="text-xs text-gray-400">
      {views} views • {new Date(createdAt).toLocaleDateString()}
    </div>
  </div>
</Link>

  );
};

export default VideoCard;
