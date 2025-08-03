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
            setMessage('Tweet is more then 280 words!');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {

            await createTweet({ content });
            setMessage("Upload successful!");

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            if (error.response?.data?.message === "jwt expired") {
                setMessage("Session expired. Please log in again.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <form
                onSubmit={handleTweetUpload}
                className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Upload Tweet</h2>

                {/* Description Input */}
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="tweet">
                        Tweet
                    </label>
                    <textarea
                        id="tweet"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-50 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your thoughts with the world..."
                        required
                    />
                </div>

                {/* Message */}
                {message && (
                    <p className={`text-center mb-4 ${message.includes("successful") ? "text-green-500 bg-gray-700 p-1" : "bg-gray-700 p-1 text-red-500"}`}>
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
