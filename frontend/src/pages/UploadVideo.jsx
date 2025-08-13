import { useNavigate } from "react-router-dom";
import { createVideo } from "../api";
import React, { useState } from "react";

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (!video || !title || !description || !thumbnail) {
      setMessage("All fields are required.");
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; 
    if (video.size > MAX_FILE_SIZE) {
      setMessage("File size exceeds 10MB limit.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("videoFile", video);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnail);

      await createVideo(formData);
      setMessage("Upload successful!");

      setVideo(null);
      setTitle("");
      setDescription("");
      setThumbnail(null);

      navigate("/");
    } catch (error) {
      console.error("Error uploading video:", error);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleVideoUpload}
        className="p-8 rounded-xl shadow-md w-full max-w-md bg-gradient-to-br from-gray-700 via-gray-500 to-gray-600 relative"
      >
        {/* Cross button */}
        <div
          className='absolute top-5 right-5 text-2xl text-red-600 hover:text-red-800 font-bold cursor-pointer bg-gray-700 rounded px-2'
          onClick={() =>
            navigate("/")
          }
        >X</div>
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Upload Video</h2>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter video title"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter video description"
            required
          />
        </div>

        {/* Video File Upload */}
        <div className="mb-4">
          <label className="block text-white mb-2">Video File</label>
          <label
            htmlFor="video"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {video ? video.name : "Choose Video File"}
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="hidden"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label className="block text-white mb-2">Thumbnail Image</label>
          <label
            htmlFor="thumbnail"
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors"
          >
            {thumbnail ? thumbnail.name : "Choose Thumbnail Image"}
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="hidden"
            required
          />
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mb-4 ${message.includes("successful") ? "text-green-500" : "text-red-500"
              }`}
          >
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
