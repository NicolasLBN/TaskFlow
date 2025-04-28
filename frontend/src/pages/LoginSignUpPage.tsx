import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser, registerUser } from '../services/api'; // Import des services API
import { useAuth } from '../context/AuthProvider';
import { User } from '../types/User';

const LoginSignUpPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle entre login et sign-up
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>('');
  const [success, setSuccess] = useState<string | null>('');
  const { setToken } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const user: User = { username, password };
        const response = await loginUser(user);
        console.log('API Response:', response);

        // Save the token in context and localStorage
        setToken(response.token);
        localStorage.setItem('authToken', response.token);

        setSuccess('Login successful');
        navigate('/home');

      } else {
        const response = await registerUser({ username, password });
        console.log('API Response:', response);
        setSuccess('Registration successful');
      }
    } catch (err: any) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(32,36,36)] text-[#b6c2c4]">
      <div className="bg-[#3E3C3F] p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#b6c2c4] mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[#b6c2c4] font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#b6c2c4] font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
        <p className="text-center text-[#b6c2c4] mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleForm}
            className="text-[#b6c2c4] hover:underline focus:outline-none font-bold"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignUpPage;