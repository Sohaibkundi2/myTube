import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom";



export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

const handleLogout = () => {
  logout()
  navigate("/login") 
}

  return (
    <div className="navbar bg-base-100 shadow px-4 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">myTubeX</Link>
      </div>

      {/* Center: Nav Links (hidden on small screens) */}
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/videos">Videos</Link></li>
          <li><Link to="/playlists">Playlists</Link></li>
          <li><Link to="/tweets">Tweets</Link></li>
        </ul>
      </div>

      {/* Right: Auth */}
      <div className="flex-none gap-3 hidden md:flex">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.avatar} alt="user" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-gray-700 rounded-box w-52 ">
              <li><Link to="/profile">Profile</Link></li>
              <li>
              <button onClick={handleLogout} className="text-left">Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
            <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
          </>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="md:hidden flex-none">
        <button className="btn btn-ghost btn-circle" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-base-100 p-4 z-50 md:hidden border-t">
          <ul className="menu menu-vertical space-y-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/videos">Videos</Link></li>
            <li><Link to="/playlists">Playlists</Link></li>
            <li><Link to="/tweets">Tweets</Link></li>
            {user ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-left">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
