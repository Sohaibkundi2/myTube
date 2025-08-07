import React, { useState } from 'react';
import { updateVideo } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!title && !description && !thumbnail) {
      setMessage('At least one field is required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      await updateVideo(videoId, formData);
      setMessage('Video updated successfully');

      setTimeout(() => navigate('/videos'), 1500);
    } catch (error) {
      if (error.response?.data?.message === "jwt expired") {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-8 rounded-xl shadow-md w-full max-w-md relative"
      >
        {/* Cross button */}
        <div
          className='absolute top-5 right-5 text-2xl text-red-600 hover:text-red-800 font-bold cursor-pointer bg-gray-700 rounded px-2'
          onClick={() =>
            navigate("/")
          }
        >X</div>
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Update Video</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new title"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Update description"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors" htmlFor="thumbnail">Thumbnail Image</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full text-white"
          />
        </div>

        {/* Message */}
        {message && (
          <p className={`text-center mb-4 p-2 rounded ${message.includes("successfully") ? "text-green-500 bg-gray-700" : "text-red-500 bg-gray-700"
            }`}>
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Updating...' : 'Update Video'}
        </button>
      </form>
    </div>
  );
};

export default UpdateVideo;
