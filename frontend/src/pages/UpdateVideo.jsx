import React, { useState } from 'react';
import { updateVideo } from '../api';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


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

      const response = await updateVideo(videoId, formData);
      setMessage('Video updated successfully');
      setTimeout(() => navigate('/videos'), 1500);

    } catch (error) {
      if (error.response?.data?.message === "jwt expired") {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Update Video</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full"
        />
        {/* Message */}
        {message && (
          <p className={`text-center mb-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {loading ? 'Updating...' : 'Update Video'}
        </button>
      </form>
    </div>
  );
};

export default UpdateVideo;
