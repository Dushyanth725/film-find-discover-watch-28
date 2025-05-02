
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Login from './Login';

const Index = () => {
  useEffect(() => {
    document.title = "KNOW YOUR FILMS | Discover & Track Movies";
  }, []);

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

export default Index;
