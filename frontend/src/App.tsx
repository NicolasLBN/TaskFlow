import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import HomePage from './pages/HomePage';
import LoginSignUpPage from './pages/LoginSignUpPage';

const App: React.FC = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar />} {/* Show Navbar only if authenticated */}
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginSignUpPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;