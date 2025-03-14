import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/logout.css";  

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      console.log("Dispatching logout...");
      await dispatch(logoutUser()).unwrap();
      console.log("Logout successful, redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login"); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-btn"
      disabled={status === "loading"}
      aria-label="Logout"
    >
      {status === "loading" ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
