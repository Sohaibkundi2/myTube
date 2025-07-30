import { getTweets } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TweetPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold mb-4">Recent Tweets</h1>

      {loading ? (
        <p className="text-gray-400">Loading tweets...</p>
      ) : (
        <ul className="space-y-3">
          {tweets.length === 0 ? (
            <p className="text-gray-400">No tweets available.</p>
          ) : (
            tweets.map(tweet => (
              <li key={tweet._id} className="p-3 rounded border border-gray-600 bg-gray-900">
                <Link to={`/tweet/${tweet._id}`} className="block hover:bg-gray-800 transition-all">
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