import { useEffect, useState } from "react"
import { getAllVideos, getTweets } from "../api"
import { Link } from "react-router-dom"
import { useAuth } from '../context/authContext'
import dayjs from "dayjs"

export default function Home() {
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

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
      <h1 className="text-3xl font-bold mb-4">Welcome to vidTwit</h1>

      {loading ? (
        <p className="text-gray-400">Loading content...</p>
      ) : (
        <div className="grid bg grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Videos Section */}
          <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Latest Videos</h2>
            {videos.length === 0 ? (
              <p className="text-gray-400">No videos available.</p>
            ) : (
              <>
                <ul className="space-y-4">
                  {videos.slice(0, 5).map((video) => (
                    <li key={video._id} className="flex flex-col sm:flex-row  bg-gray-900 gap-3">
                      <Link to={`/watch/${video._id}`} className="flex flex-col sm:flex-row gap-3 w-full hover:bg-gray-800 transition-all">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full sm:w-48 h-48 sm:h-28 object-cover rounded"
                        />
                        <div className="flex flex-col justify-between p-3">
                          <p className="font-medium text-base line-clamp-2">{video.title}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {video.description.length > 50
                              ? video.description.substring(0, 50) + '...'
                              : video.description}
                          </p>
                          <p className="text-sm text-blue-500 mt-1 ">{video.owner?.username}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {videos.length > 5 && (
                  <Link to="/videos" className="mt-4 inline-block text-blue-500 hover:underline">
                    View more videos →
                  </Link>
                )}
              </>
            )}
          </div>


          {/* Tweets Section */}
          <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Tweets</h2>
            {tweets.length === 0 ? (
              <p className="text-gray-400">No tweets available.</p>
            ) : (
              <>
                <ul className="space-y-3">
                  {tweets.slice(0, 5).map(tweet => (
                    <li key={tweet._id}>
                      <Link to={`/tweet/${tweet._id}`} className="block p-3 rounded border border-gray-600 bg-gray-900 hover:bg-gray-800 transition-all">
                        <p className=" font-medium text-blue-500">{tweet.owner?.username}</p>
                        <p className=" text-sm text-gray-400">{
                        tweet.content.length > 180 
                          ? tweet.content.substring(0, 180) + '...'
                          : tweet.content
                        }</p>
                      </Link>
                    </li>

                  ))}
                </ul>
                {tweets.length > 5 && (
                  <Link to="/tweets" className="mt-4 inline-block text-blue-500 hover:underline">
                    View more tweets →
                  </Link>
                )}
              </>
            )}
          </div>


          {/* Upload Section */}
          <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-4">Upload a New Video</h2>
            <p className="text-gray-400 mb-4">Share your creativity with the world!</p>
            <Link to="/upload-video" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-max">
              Go to Upload
            </Link>
          </div>

          <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-4">Post a Tweet</h2>
            <p className="text-gray-400 mb-4">Got something to say? Share your thoughts.</p>
            <Link to="/upload-tweet" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-max">
              Upload Tweet
            </Link>
          </div>


          {/* Profile Section */}
          {user ? (
            // Profile Section (shown only if user is logged in)
            <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-300">
                <p className="text-sm text-muted-foreground">
                  Member Since:
                  <span className="ml-1 font-medium text-black dark:text-white">
                    {dayjs(user.createdAt).format("DD MMMM YYYY")}
                  </span>
                </p>
              </div>

              <Link
                to="/profile"
                className="inline-block mt-4 text-blue-500 hover:underline"
              >
                View Profile
              </Link>
            </div>
          ) : (
            <div className="p-6 bg-gray-950 text-white/90 rounded-xl shadow text-center">
              <p className="text-gray-500">Please log in to view your profile.</p>
              <Link
                to="/login"
                className="inline-block mt-4  text-blue-500 hover:underline"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      )}
    </div>

  )
}
