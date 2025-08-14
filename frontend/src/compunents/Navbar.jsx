import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom";



export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState()

  const navigate = useNavigate()


  //logout
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

  return (
    <div className="navbar bg-gray-950 text-white/100 shadow px-4 sticky top-0 z-50">

      {/* Left: Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">vidTwit</Link>
      </div>

      {/* Center: Nav Links (hidden on small screens) */}
      <div className="hidden md:flex md:flex-1 md:justify-center ">
        <ul className="menu menu-horizontal px-1 ">
          <li  className="hover:bg-gray-800 rounded-md"><Link to="/">Home</Link></li>
          <li  className="hover:bg-gray-800 rounded-md"><Link to="/videos">Videos</Link></li>
          {/* <li  className="hover:bg-gray-800 rounded-md"><Link to="/playlists">Playlists</Link></li> */}
          <li  className="hover:bg-gray-800 rounded-md"><Link to="/tweets">Tweets</Link></li>
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
                <button
                  onClick={handleLogoutClick}
                  className="bg-red-500 text-white  rounded hover:bg-red-700 cursor-pointer"
                >Logout
                </button>

                {showConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-xl">
                      <p className=" mb-4">Are you sure you want to logout?</p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={cancelLogout}
                          className="bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmLogout}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Yes, Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-600 text-white/100  p-4 z-50 md:hidden border-t">
          <ul className="menu menu-vertical w-full  space-y-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/videos">Videos</Link></li>
            {/* <li><Link to="/playlists">Playlists</Link></li> */}
            <li><Link to="/tweets">Tweets</Link></li>
            {user ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/update-profile">Change Profile</Link></li>
                <li>
                  <button
                    onClick={handleLogoutClick}
                    className="bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                  >Logout
                  </button>

                  {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl">
                        <p className="text-lg font-semibold mb-4">Are you sure you want to logout?</p>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={cancelLogout}
                            className="bg-gray-700 px-4 py-2 rounded"
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
