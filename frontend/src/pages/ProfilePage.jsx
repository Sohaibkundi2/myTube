import React, { useEffect, useState } from 'react'
import { getUserProfile, getChannelStats, getChannelVideos, deleteVideo } from '../api'
import dayjs from "dayjs"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handleDelete = async (videoId) => {
        const confirm = window.confirm("Are you sure you want to delete this video?");
        if (!confirm) return;

        try {
            await deleteVideo(videoId);
            setVideos(prev => prev.filter(v => v._id !== videoId));
        } catch (error) {
            console.error("Error deleting video:", error);
            alert("Failed to delete video.");
        }
    }

    const handleEdit = (videoId) => {
        navigate(`/edit-video/${videoId}`);
    }

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
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Logout
                        </button>
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
                            <div key={video._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow relative">
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
                                <div className="flex mt-3 gap-2">
                                    <button
                                        onClick={() => handleEdit(video._id)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage
