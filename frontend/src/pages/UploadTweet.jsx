import { useNavigate } from "react-router-dom";
import { createTweet } from "../api";
import React, { useState } from "react";

const UploadTweet = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleTweetUpload = async (e) => {
        e.preventDefault();

        if (!content) {
            setMessage("Tweet content is required!");
            return;
        }

        if (content.length > 280) {
            setMessage("Tweet is more than 280 characters!");
            return;
        }
        if (content.length < 10) {
            setMessage("Tweet is too short!");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await createTweet({ content });
            setMessage("Upload successful!");

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            setMessage("Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <form
                onSubmit={handleTweetUpload}
                className="p-8 rounded-xl shadow-md w-full max-w-md bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700 relative"
            >

                              {/* Cross button */}
      <div
      className='absolute top-5 right-5 text-2xl text-red-600 hover:text-red-800 font-bold cursor-pointer bg-gray-700 rounded px-2'
      onClick={()=>
        navigate("/")
      }
      >X</div>
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Upload Tweet</h2>

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
                        className={`text-center mb-4 rounded-md p-2 ${message.includes("successful")
                            ? "text-green-500 bg-gray-700"
                            : "text-red-500 bg-gray-700"
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
                    {loading ? "Uploading..." : "Upload Tweet"}
                </button>
            </form>
        </div>
    );
};

export default UploadTweet;
