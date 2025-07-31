import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../api'
import dayjs from "dayjs"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'


const ProfilePage = () => {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                setProfile(response.data.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [])

    if (loading) return <p className="text-center py-10 text-gray-400">Loading profile...</p>
    if (!profile) return <p className="text-center py-10 text-red-500">Profile not found.</p>

    return (
        <div className="max-w-4xl mx-auto">
            {/* Cover Image */}
            <div className="h-52 sm:h-64 w-full rounded-lg overflow-hidden mb-6">
                <img
                    src={profile.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-4">
                <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white -mt-16 shadow-md"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                    <p className="text-sm text-gray-500">{profile.profilename}</p>
                    <p className="text-sm text-gray-400 mt-1">Email: {profile.email}</p>
                    <p className="text-sm text-gray-400 mt-1">Joined: {dayjs(profile.createdAt).format("MMMM D, YYYY")}</p>

                    {/* Optional: Watch history stats */}
                    <p className="text-sm text-gray-400 mt-1">
                        Watched Videos: {profile.watchHistory?.length || 0}
                    </p>

                    {/* Optional: Buttons */}
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
        </div>
    )
}

export default ProfilePage