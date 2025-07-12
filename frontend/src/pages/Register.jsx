import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
      setError("Please fill in all required fields and upload avatar.")
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
      const res = await axios.post("http://localhost:3000/api/v1/users/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log(res.data)
      alert("Registration successful!")
      navigate("/login")
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="input" />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="input" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />

        <div>
          <label className="block text-sm mb-1">Avatar (required)</label>
          <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} />
        </div>
        <div>
          <label className="block text-sm mb-1">Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  )
}
