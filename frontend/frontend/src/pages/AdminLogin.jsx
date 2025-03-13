import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLogIn } from "../features/auth/authSlice"; // Import the new adminLogIn thunk
import AuthForm from "../components/AuthForm";

const AdminLogin = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    console.log("Dispatching adminLogIn...");
    const result = await dispatch(adminLogIn(credentials));
    console.log("Login result:", result);

    if (result.payload) {
      if (result.payload.user.role === "admin") {
        const redirectPath = location.state?.from || "/admin";
        navigate(redirectPath, { replace: true });
      } else {
        setError("You are not authorized as an admin.");
      }
    } else {
      setError(result.error ? result.error.message : "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
};

export default AdminLogin;
