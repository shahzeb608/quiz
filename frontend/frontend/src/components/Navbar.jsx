import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice"; // ✅ Fixed import

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="text-xl font-bold">Quiz App</div>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/leaderboard" className="hover:underline">Leaderboard</Link></li>
        {!user ? (
          <>
            <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
