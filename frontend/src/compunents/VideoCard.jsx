import React, { use } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";


const VideoCard = ({ video, currentUserId }) => {
  if (!video) return null;

  const {
    _id,
    title,
    thumbnail,
    owner,
    views = 0,
    createdAt,
  } = video;

  const navigate = useNavigate();
  const { user } = useAuth();
  const isUploader = owner?._id === user?._id;
   const handleCardClick = () => {
    navigate(`/watch/${_id}`);
  };

  return (
    <div
      className="relative group flex flex-col gap-4 w-full bg-base-100 p-3 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-60 object-cover rounded-md"
      />

      {/* Info */}
      <div className="flex flex-col justify-start gap-2">
        <h3 className="text-md font-semibold line-clamp-2">{title}</h3>

        <div className="flex items-center gap-2">
          <img
            src={owner?.avatar || "/default-avatar.png"}
            alt={owner?.username || "Uploader"}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-400">
            {owner?.username || "Unknown"}
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {views} views • {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Buttons */}
      {isUploader && (
        <div className="flex justify-end gap-2 mt-2 px-3 z-10" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/update-video/${_id}`}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <Link
            to={`/delete-video/${_id}`}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </Link>
        </div>
      )}
    </div>
  );
};

export default VideoCard;