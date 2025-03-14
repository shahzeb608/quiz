import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, status } = useSelector((state) => state.auth);
  
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  
  if (adminOnly && user.role !== "admin") {
    console.log("User role:", user.role); // Debugging
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;