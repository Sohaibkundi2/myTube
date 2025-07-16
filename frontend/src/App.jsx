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
      </Routes>
      <Footer />
    </div>
  )
}

export default App
