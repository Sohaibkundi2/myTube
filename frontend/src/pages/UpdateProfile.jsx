import { useState } from 'react'
import { useAuth } from '../context/authContext'
import {
  updateUserInfo,
  changePassword,
  updateAvatar,
  updateCoverImage,
} from '../api'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = ({ user }) => {
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  })

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [isUpdatingCover, setIsUpdatingCover] = useState(false)
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const showMessage = (success, error = '') => {
    setSuccessMessage(success)
    setErrorMessage(error)
    setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 3000)
  }

  const handleInfoUpdate = async () => {
    if (!fullName?.trim() || !email?.trim()) {
      showMessage('', 'Full name or email cannot be empty.')
      return
    }

    if (fullName.trim().length < 4) {
      showMessage('', 'Name is too short. Minimum 4 characters required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      showMessage('', 'Invalid email format.')
      return
    }

    setIsUpdatingInfo(true)
    try {
      await updateUserInfo({ fullName, email })
      showMessage('Profile updated successfully!')

      setUser(prev => ({ ...prev, fullName, email }))
      localStorage.setItem('user', JSON.stringify({ ...user, fullName, email }))
    } catch (err) {
            if (err.response && err.response.status === 401) {
      // Auto redirect 
      showMessage("Session expired. Please login again.");
      navigate("/login");
    }
      console.error(err)
      showMessage('', 'Failed to update profile.')
       return Promise.reject(err);
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword } = passwordData
    if (!oldPassword.trim() || !newPassword.trim()) {
      showMessage('', 'Both old and new passwords are required.')
      return
    }

    if (newPassword.trim().length < 6) {
      showMessage('', 'New password must be at least 6 characters.')
      return
    }

    if (oldPassword === newPassword) {
      showMessage('', 'New password must be different from the old password.')
      return
    }
    setIsChangingPassword(true)
    try {
      await changePassword(passwordData)
      showMessage('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '' })
    } catch (err) {
      console.error(err)
      showMessage('', 'Password update failed.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleAvatarUpdate = async () => {
    if (!avatar) return
    setIsUpdatingAvatar(true)
    const formData = new FormData()
    formData.append('avatar', avatar)

    try {
      const updated = await updateAvatar(formData)
      const avatarUrl = updated?.data?.data?.avatar

      setUser(prev => ({ ...prev, avatar: avatarUrl }))
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, avatar: avatarUrl }),
      )
      showMessage('Avatar updated successfully!')
    } catch (err) {
      console.error(err)
      showMessage('', 'Avatar update failed.')
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  const handleCoverUpdate = async () => {
    if (!coverImage) return
    setIsUpdatingCover(true)
    const formData = new FormData()
    formData.append('coverImage', coverImage)

    try {
      const updated = await updateCoverImage(formData)
      const coverImageUrl = updated?.data?.data?.coverImage

      setUser(prev => ({ ...prev, coverImage: coverImageUrl }))
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, coverImage: coverImageUrl }),
      )
      showMessage('Cover image updated successfully!')
    } catch (err) {
      console.error(err)
      showMessage('', 'Cover image update failed.')
    } finally {
      setIsUpdatingCover(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-white bg-gradient-to-br from-gray-800 via-slate-900 to-black rounded-lg shadow-lg mt-5 relative">
      <h2 className="text-3xl font-bold">Update Profile</h2>

      {/* Cross button */}
      <div
      className='absolute top-5 right-5 text-2xl text-red-700 hover:text-red-800 font-bold cursor-pointer bg-gray-950 px-2'
      onClick={()=>
        navigate("/")
      }
      >X</div>

      {/* Feedback Messages */}
      {successMessage && <p className="text-green-400">{successMessage}</p>}
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}

      {/* Update Info */}
      <div className="space-y-2">
        <input
          className="w-full border border-gray-600 bg-black text-white p-2 rounded"
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          className="w-full border border-gray-600 bg-black text-white p-2 rounded"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button
          onClick={handleInfoUpdate}
          disabled={isUpdatingInfo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdatingInfo ? 'Updating Info...' : 'Update Info'}
        </button>
      </div>

      {/* Change Password */}
      <div className="space-y-2">
        <input
          className="w-full border border-gray-600 bg-black text-white p-2 rounded"
          type="password"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={e =>
            setPasswordData({ ...passwordData, oldPassword: e.target.value })
          }
        />
        <input
          className="w-full border border-gray-600 bg-black text-white p-2 rounded"
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={e =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
        />
        <button
          onClick={handlePasswordChange}
          disabled={isChangingPassword}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isChangingPassword ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      {/* Avatar Upload */}
      <div className="space-y-2">
        <input
          type="file"
          onChange={e => setAvatar(e.target.files[0])}
          className="text-white"
        />
        <button
          onClick={handleAvatarUpdate}
          disabled={isUpdatingAvatar}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdatingAvatar ? 'Updating Profile...' : 'Upload Profile'}
        </button>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <input
          type="file"
          onChange={e => setCoverImage(e.target.files[0])}
          className="text-white"
        />
        <button
          onClick={handleCoverUpdate}
          disabled={isUpdatingCover}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdatingCover ? 'Updating Cover...' : 'Upload Cover'}
        </button>
      </div>
    </div>
  )
}

export default UpdateProfile
