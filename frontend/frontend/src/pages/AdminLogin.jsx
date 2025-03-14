import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogIn } from "../features/auth/authSlice";
import AuthForm from "../components/AuthForm";
import "../styles/admin-login.css";  

const AdminLogin = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const result = await dispatch(adminLogIn(credentials)).unwrap();
      
      console.log("Admin login result:", result);
      
      if (result && result.user && result.user.role === "admin") {
        if (result.token) {
          localStorage.setItem("authToken", result.token);
        }
        navigate("/admin");
      } else {
        setError("Admin privileges required");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError(typeof error === 'string' ? error : "Login failed");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      {error && <p>{error}</p>}
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
};

export default AdminLogin;
