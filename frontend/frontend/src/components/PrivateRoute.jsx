import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth); // Changed from token to user
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;