import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post("http://localhost:3000/api/v1/users/login", {
        email,
        password,
      })

      const { accessToken, user } = res.data?.data
      localStorage.setItem("token", accessToken)
      localStorage.setItem("user", JSON.stringify(user))

      navigate("/") // Redirect after login
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-slate-900 to-black">
      <div className="max-w-md w-full  p-6 rounded-lg bg-gradient-to-br from-gray-700 via-gray-500 to-gray-600 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-100">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
