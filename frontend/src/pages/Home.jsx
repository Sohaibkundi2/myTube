import { useEffect, useState } from "react"
import { getAllVideos, getTweets } from "../api"

export default function Home() {
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videoRes, tweetRes] = await Promise.all([
          getAllVideos(),
          getTweets()
        ])

        const res = await getAllVideos();
        setVideos(res.data?.data?.videos || []);
        setTweets(tweetRes.data?.data || [])
      } catch (error) {
        console.error("Failed to fetch videos or tweets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to myTubeX </h1>

      {loading ? (
        <p className="text-gray-500">Loading content...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Videos Section */}
          <div className="p-6 bg-base-200 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Latest Videos</h2>
            {videos.length === 0 ? (
              <p className="text-gray-500">No videos available.</p>
            ) : (
<ul className="space-y-3">
  {videos.slice(0, 5).map((video) => (
    <li
      key={video._id}
      className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full sm:w-40 h-80 sm:h-24 object-cover rounded"
      />
      <div>
        <p className="font-medium">{video.title}</p>
        <p className="text-sm text-gray-500">{video.owner?.username}</p>
      </div>
    </li>
  ))}
</ul>

            )}
          </div>

          {/* Tweets Section */}
          <div className="p-6 bg-base-200 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Tweets</h2>
            {tweets.length === 0 ? (
              <p className="text-gray-500">No tweets available.</p>
            ) : (
              <ul className="space-y-3">
                {tweets.slice(0, 5).map(tweet => (
                  <li key={tweet._id} className="p-3 bg-base-100 rounded border">
                    <p className="font-medium">{tweet.owner?.username}</p>
                    <p className="text-sm text-gray-600">{tweet.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
