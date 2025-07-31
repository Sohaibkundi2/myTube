import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './compunents/Navbar'
import Footer from './compunents/Footer';
import VideoPlayerPage from './pages/videoPlayer'
import VideoDetails from './pages/VideoDetails'
import TweetPage from './pages/TweetPage';
import ProfilePage from './pages/ProfilePage';
import UploadVideo from './pages/UploadVideo';
import UpdateVideo from './pages/UpdateVideo'

function App() {

  return (
        <div className="min-h-screen bg-gray-900">
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/videos" element={<VideoDetails />} />
        <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
        <Route path="/tweet/:tweetId" element={<TweetPage />} />
        <Route path="/tweets" element={<TweetPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/update-video/:videoId" element={<UpdateVideo />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
