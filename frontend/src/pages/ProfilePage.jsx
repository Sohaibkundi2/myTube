import React, { useEffect, useState } from 'react'
import { getUserProfile, getChannelStats, getChannelVideos, getWatchHistory, togglePublishStatus, getSubscribedChannels, getSubscribers } from '../api'
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
  const [errorMsg, setErrorMsg] = useState("")

  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [mySubscribers, setMySubscribers] = useState([]);


  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleUpdateProfile = () => {
    navigate('/update-profile')
  }

  const handleCardClick = (_id) => {
    navigate(`/watch/${_id}`);
  };

  // logout
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
        if (error.response && error.response.status === 401) {
          setErrorMsg("Session expired. Please login again.");
          navigate("/login");
        }
        if (error.response?.data?.message === "jwt expired") {
          setErrorMsg("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        }
        console.error("Error fetching data:", error);
        return Promise.reject(error);
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
        setErrorMsg(error)
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublishStatus(videoId);

      // Update local state
      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId
            ? { ...video, isPublished: !video.isPublished }
            : video
        )
      );
    } catch (err) {
      setErrorMsg(err)
    }
  };

  // Fetch channels the user has subscribed to
  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const res = await getSubscribedChannels(user._id);
        const flattened = res.data?.data.map(item => item.channel);
        setSubscribedChannels(flattened || []);
      } catch (error) {
        console.error("Error fetching subscribed channels:", error);
      }
    };

    if (user?._id) fetchSubscribedChannels();
  }, [user?._id]);

  // Fetch users who subscribed to this user (channel)
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await getSubscribers(user._id);
        setMySubscribers(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    if (user?._id) fetchSubscribers();
  }, [user?._id]);


  if (loading) return <p className="text-center py-10 text-gray-400">Loading profile...</p>

  if (!profile) {
    if (errorMsg) {
      return <p className="text-center py-10 text-red-500">{errorMsg}</p>
    }
    return <p className="text-center py-10 text-red-500">Profile not found.</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Cover Image */}
      <div className="h-52 sm:h-64 w-full rounded-lg overflow-hidden mb-6">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover Image"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#9faaa6] to-[#29292c]" />
        )}
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
            {/* Cross button */}
            <button
              className='bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 cursor-pointer'
              onClick={() =>
                navigate("/")
              }
            >Home</button>
            <button
              onClick={() => handleUpdateProfile()}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer">
              Edit Profile
            </button>
            <button
              onClick={handleLogoutClick}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 cursor-pointer"
            >Logout
            </button>

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
        <div className="mt-10 bg-gradient-to-br from-gray-800 via-slate-900 to-black text-white/85 p-6 rounded-lg">
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
        <div className="mt-10 ">
          <h2 className="text-xl font-semibold mb-4 text-white/90">Your Uploaded Videos</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-white/90">
            {videos.map(video => (
              <div key={video._id} onClick={() => handleCardClick(video._id)} className=" bg-gray-800 p-4 rounded-lg shadow relative cursor-pointer">
                <img
                  src={video.thumbnail || "/placeholder.jpg"}
                  alt={video.title}
                  className="w-full h-45 object-cover rounded mb-2"
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
                  <button
                    onClick={() => handleTogglePublish(video._id)}
                    className={`text-sm px-3 py-1 rounded ${video.isPublished
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                      } text-white`}
                  >
                    {video.isPublished ? "Unpublish" : "Publish"}
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 py-6  text-white">
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

      {/* Subscribed Channels */}
      <div className="px-4 py-6 text-white bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Channels You Subscribed To</h2>
        {subscribedChannels.length === 0 ? (
          <p className="text-gray-500">You haven’t subscribed to any channels yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscribedChannels.map((channel) => (
              <div key={channel._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={channel.avatar} alt={channel.username} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold">{channel.fullName}</h3>
                    <p className="text-sm text-gray-500">@{channel.username}</p>
                  </div>
                </div>
                <Link
                  to={`/channel/${channel._id}`}
                  className="mt-3 inline-block text-blue-500 hover:underline text-sm"
                >
                  View Channel
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Subscribers */}
      <div className="px-4 py-6 text-white bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Your Subscribers</h2>
        {mySubscribers.length === 0 ? (
          <p className="text-gray-500">No one has subscribed to you yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySubscribers.map((sub) => (
              <div key={sub._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow flex items-center gap-4">
                <img
                  src={sub.subscriber.avatar}
                  alt={sub.subscriber.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-blue-400">{sub.subscriber.fullName}</p>
                  <p className="text-sm text-gray-500">@{sub.subscriber.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default ProfilePage