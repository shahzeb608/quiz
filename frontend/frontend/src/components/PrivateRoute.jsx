import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading while checking authentication
  if (status === 'loading') {
    return <div className="loading-container">Checking authentication...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check admin role for admin-only routes
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and has admin role if required)
  return <Outlet />;
};

export default PrivateRoute;