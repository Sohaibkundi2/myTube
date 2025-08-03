import React, { useState } from 'react';
import { updateTweet } from '../api';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const UpdateTweet = () => {
  const { tweetId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!content) {
      setMessage('tweet is missing');
      setLoading(false);
      return;
    }
    if (content.length > 280) {
      setMessage('tweet is more then 280 words');
      setLoading(false);
      return;
    }

    try {

      await updateTweet(tweetId,{ content });
      setMessage('Tweet updated successfully');
      setTimeout(() => navigate('/tweets'), 1500);

    } catch (error) {
        console.log(error)
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
      <h2 className="text-xl font-bold mb-4">Update Tweet</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <textarea
          placeholder="what you want to change...."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 h-50 border rounded"
        ></textarea>
        {/* Message */}
        {message && (
          <p className={`text-center mb-4 ${message.includes("successfully") ? "text-green-500" :  "bg-gray-700 p-1 text-red-500"}}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {loading ? 'Updating...' : 'Update Tweet'}
        </button>
      </form>
    </div>
  );
};

export default UpdateTweet;
