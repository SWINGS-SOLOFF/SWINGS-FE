import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-center items-center space-x-4">
      <Link to="/">SWINGS</Link>
      <Link to="/login">LOGIN</Link>
      <Link to="/signup" className="bg-pink-500 text-white px-4 py-2 rounded">
        SIGNUP
      </Link>
    </nav>
  );
}
