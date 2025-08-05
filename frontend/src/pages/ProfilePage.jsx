import React, { useEffect, useState } from 'react'
import { getUserProfile, getChannelStats, getChannelVideos, getWatchHistory } from '../api'
import dayjs from "dayjs"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false);

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleUpdateProfile = () => {
    navigate('/update-profile')
  }

  const handleCardClick = (_id) => {
    navigate(`/watch/${_id}`);
  };

  const handleLogoutClick = () => {
    setShowConfirm(true); // show modal/confirmation
  };

  const confirmLogout = () => {
    logout();             // call from context
    setShowConfirm(false);
    navigate("/login")
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data.data);

        const [statsRes, videosRes] = await Promise.all([
          getChannelStats(res.data.data._id),
          getChannelVideos(res.data.data._id)
        ]);

        setStats(statsRes.data.data);
        setVideos(videosRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getWatchHistory();
        setHistory(res.data.data);
      } catch (error) {
        console.error("Error fetching watch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-400">Loading profile...</p>
  if (!profile) return <p className="text-center py-10 text-red-500">Profile not found.</p>

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Cover Image */}
      <div className="h-52 sm:h-64 w-full rounded-lg overflow-hidden mb-6">
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-white -mt-16 shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-sm text-gray-500">{profile.profilename}</p>
          <p className="text-sm text-gray-400 mt-1">Email: {profile.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Joined: {dayjs(profile.createdAt).format("MMMM D, YYYY")}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Watched Videos: {profile.watchHistory?.length || 0}
          </p>

          <div className="mt-4 space-x-3">
            <button
              onClick={() => handleUpdateProfile()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
              Edit Profile
            </button>
            <button
              onClick={handleLogoutClick}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            >Logout</button>

            {showConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl">
                  <p className="text-lg font-semibold mb-4">Are you sure you want to logout?</p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={cancelLogout}
                      className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Yes, Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channel Stats */}
      {stats && (
        <div className="mt-10 bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Channel Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm sm:text-base">
            <div>
              <p className="font-bold text-lg">{stats.totalVideos}</p>
              <p>Total Videos</p>
            </div>
            <div>
              <p className="font-bold text-lg">{stats.totalViews}</p>
              <p>Total Views</p>
            </div>
            <div>
              <p className="font-bold text-lg">{stats.totalLikes}</p>
              <p>Total Likes</p>
            </div>
            <div>
              <p className="font-bold text-lg">{stats.totalSubscribers}</p>
              <p>Subscribers</p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Videos */}
      {videos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Your Uploaded Videos</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {videos.map(video => (
              <div key={video._id} onClick={() => handleCardClick(video._id)} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow relative cursor-pointer">
                <img
                  src={video.thumbnail || "/placeholder.jpg"}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {dayjs(video.createdAt).format("MMM D, YYYY")}
                </p>
                <p className="text-sm text-gray-500">
                  Views: {video.views || 0}
                </p>

                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-2 px-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/update-video/${video._id}`}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/delete-video/${video._id}`}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Watch History</h2>
        {history.length === 0 ? (
          <p>No watch history yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage