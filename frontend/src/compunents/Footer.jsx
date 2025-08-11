import { Link } from "react-router-dom"

export default function Footer() {
  return (
<footer className="bg-gray-950 text-white/100  mt-10">
  <div className="text-center text-sm py-4 border-t border-base-300">
    © {new Date().getFullYear()} vidTwit. All rights reserved.
  </div>
</footer>
  )
}
