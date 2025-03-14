import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { logIn } from '../features/auth/authSlice';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  
  
  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(logIn(credentials)).unwrap();
      
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  
  return (
    <>
      {status === 'failed' && <div className="text-red-500 mb-4">{error}</div>}
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </>
  );
};

export default Login;