import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
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
import DeleteVideo from './pages/DeleteVideo'
import UploadTweet from './pages/UploadTweet'
import UpdateTweet from './pages/UpdateTweet'
import DeleteTweet from './pages/DeleteTweet'

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
        <Route path="/delete-video/:videoId" element={<DeleteVideo />}/>
        <Route path="/upload-tweet" element={<UploadTweet />} />
        <Route path="/update-tweet/:tweetId" element={<UpdateTweet />} />
        <Route path="/delete-tweet/:tweetId" element={<DeleteTweet />}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
