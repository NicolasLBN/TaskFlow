import React, { useState } from 'react';
import { loginUser, registerUser, User} from '../services/api'; // Import des services API

const LoginSignUpPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle entre login et sign-up
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>('');
  const [success, setSuccess] = useState<string | null>('');

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
        // Appel de l'API pour le login
        const user: User = { username, password };
        const response = await loginUser(user);
        console.log('API Response:', response); // Debug the response
        setSuccess(response.message || 'Login successful'); // Ensure message is a string
      } else {
        // Appel de l'API pour l'inscription
        const response = await registerUser({ username, password });
        console.log('API Response:', response); // Debug the response
        setSuccess(response.message || 'Registration successful'); // Ensure message is a string
      }
    } catch (err: any) {
      console.error('Error:', err.response?.data);
  
      // Handle the `detail` array in the error response
      const errorDetails = err.response?.data?.detail;
      if (Array.isArray(errorDetails)) {
        const errorMessages = errorDetails.map((detail: any) => detail.msg).join(', ');
        setError(errorMessages); // Combine all error messages into a single string
      } else {
        const errorMessage =
          err.response?.data?.detail || 'An error occurred. Please try again.';
        setError(errorMessage); // Ensure error is a string
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignUpPage;