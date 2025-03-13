import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn } from '../features/auth/authSlice'; // ✅ Correct import
import AuthForm from '../components/AuthForm';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    console.log("Dispatching logIn...");
    const result = await dispatch(logIn(credentials));
    console.log("Result of logIn dispatch:", result);
  
    if (result.payload) {
      console.log("Login success! Redirecting...");
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    } else {
      console.error("Login failed:", result.error);
    }
  };
  
  
  return <AuthForm isSignup={false} onSubmit={handleLogin} />;
};

export default Login;
