
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (username) {
      setUser(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  return (
    <nav className="bg-card shadow-md py-4 border-b">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to={user ? '/dashboard' : '/'}>
          <h1 className="text-3xl md:text-4xl">
            <span className="text-foreground">KNOW YOUR</span>{' '}
            <span className="text-secondary">FILMS</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Welcome, {user}</span>
              <button 
                onClick={handleLogout}
                className="btn-cinema-outline text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/" className="btn-cinema-outline text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
