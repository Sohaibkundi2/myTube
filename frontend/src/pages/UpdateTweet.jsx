import React, { useState } from 'react';
import { updateTweet } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

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
      setMessage('Tweet is missing');
      setLoading(false);
      return;
    }

    if (content.length < 10) {
      setMessage('Tweet is too short (min 10 characters)');
      setLoading(false);
      return;
    }

    if (content.length > 280) {
      setMessage('Tweet is more than 280 characters');
      setLoading(false);
      return;
    }

    try {
      await updateTweet(tweetId, { content });
      setMessage('Tweet updated successfully');

      setTimeout(() => navigate('/tweets'), 1500);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === 'jwt expired') {
        setMessage('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md relative"
      >

        {/* Cross button */}
        <div
          className='absolute top-5 right-5 text-2xl text-red-600 hover:text-red-800 font-bold cursor-pointer bg-gray-700 rounded px-2'
          onClick={() =>
            navigate("/")
          }
        >X</div>


        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Update Tweet
        </h2>

        {/* Textarea */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-white mb-2">
            Tweet
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What do you want to change?"
            maxLength={280}
            required
          />
          <div className="text-sm text-gray-400 text-right mt-1">
            {280 - content.length} characters left
          </div>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mb-4 rounded p-2 ${message.includes('successfully')
                ? 'text-green-500 bg-gray-700'
                : 'text-red-500 bg-gray-700'
              }`}
          >
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Updating...' : 'Update Tweet'}
        </button>
      </form>
    </div>
  );
};

export default UpdateTweet;
