import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import "../styles/navbar.css";  

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="navbar">
      <div className="text-xl font-bold">Quiz App</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        {user?.role === "admin" && <li><Link to="/admin">Admin Panel</Link></li>}
        {!user ? (
          <>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <li><Logout /></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
