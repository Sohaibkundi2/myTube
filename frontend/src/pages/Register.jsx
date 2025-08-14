import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  })

  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.fullName || !formData.username || !formData.email || !formData.password || !avatar) {
      setError("Please fill in all required fields")
      return
    }

    if(formData.password.length < 6){
      setError("Password must be at least 6 characters")
      return
    }

    const form = new FormData()
    form.append("fullName", formData.fullName)
    form.append("username", formData.username)
    form.append("email", formData.email)
    form.append("password", formData.password)
    form.append("avatar", avatar)
    if (coverImage) form.append("coverImage", coverImage)

    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      navigate("/login")
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto mt-10 p-6  rounded-xl shadow-md bg-gradient-to-br from-gray-950 via-slate-600 to-black">
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">Register</h2>

        {error && (
          <div className="alert alert-error text-sm mb-4">
            <span className="text-white text-center">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <div>
            <label className="label">
              <span className="label-text text-white">Avatar (required)</span>
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={e => setAvatar(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-white">Cover Image (optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              name="coverImage"
              onChange={e => setCoverImage(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-100">
              Already have account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
  )

}
