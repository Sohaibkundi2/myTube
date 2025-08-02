import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const TweetCard = ({ tweet, currentUserId }) => {
  if (!tweet) return null;

  const { _id, content, owner } = tweet;
  const { user } = useAuth();
  const navigate = useNavigate();

  const isUploader = owner?._id === user?._id;

  const handleCardClick = () => {
    navigate(`/tweet/${_id}`);
  };

  return (
    <div
      className="relative group w-full bg-base-100 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Tweet Content */}
      <div className="space-y-2">
        <p className="text-sm text-gray-300 break-all"> {owner?.username}</p>
        <p className="text-base text-white">{content}</p>
      </div>

      {/* Edit/Delete Buttons */}
      {isUploader && (
        <div
          className="flex justify-end gap-2 mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={`/update-tweet/${_id}`}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <Link
            to={`/delete-tweet/${_id}`}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </Link>
        </div>
      )}
    </div>
  );
};

export default TweetCard;
