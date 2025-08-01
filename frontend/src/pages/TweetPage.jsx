import { getTweets } from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TweetPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await getTweets();
        setTweets(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header + Button wrapper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-3xl font-bold">Recent Tweets</h1>
        <button
          onClick={() => navigate("/upload-tweet")}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Tweet
        </button>
      </div>

      {/* Tweet list */}
      {loading ? (
        <p className="text-gray-400">Loading tweets...</p>
      ) : (
        <ul className="space-y-3">
          {tweets.length === 0 ? (
            <p className="text-gray-400">No tweets available.</p>
          ) : (
            tweets.map((tweet) => (
              <li
                key={tweet._id}
                className="p-3 rounded border border-gray-600 bg-gray-900"
              >
                <Link
                  to={`/tweet/${tweet._id}`}
                  className="block hover:bg-gray-800 transition-all"
                >
                  <p className="font-medium">{tweet.owner?.username}</p>
                  <p className="text-sm text-gray-400">{tweet.content}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
