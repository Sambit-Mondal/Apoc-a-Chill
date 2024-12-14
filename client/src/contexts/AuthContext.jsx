import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContextFile';

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the user's details

  // Simulate fetching user data from localStorage or an API
  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUser({ email: storedUserEmail });
    }
  }, []);

  // Login function
  const login = (email) => {
    setUser({ email });
    localStorage.setItem('userEmail', email);
    localStorage.setItem('')
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};