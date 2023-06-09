import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  if (!currentUser) {
    navigate('/');
  }
  return children;
};

export default ProtectedRoute;