// components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsValid(true);
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Token verification failed:', error?.response?.data?.message || error.message);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    };

    checkToken();
  }, [navigate]);

  if (isValid === null) {
    return <p>Loading...</p>; // You can replace this with a spinner if needed
  }

  return children;
};

export default ProtectedRoute;
