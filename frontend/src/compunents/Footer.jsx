import { Link } from "react-router-dom"

export default function Footer() {
  return (
<footer className="bg-gray-950 text-base-content mt-10">
  <div className="text-center text-sm py-4 border-t border-base-300">
    © {new Date().getFullYear()} myTubeX. All rights reserved.
  </div>
</footer>
  )
}
