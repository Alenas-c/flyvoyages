import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // Rediriger vers la page de connexion en conservant l'URL de destination
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 