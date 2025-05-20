import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import HomePage from './pages/HomePage';
import LoginSignUpPage from './pages/LoginSignUpPage';
import Kanban from './pages/Kanban';
import { Project } from './types/Project';

const App: React.FC = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

  // Wrapper component to pass the project object to Kanban
  const KanbanWrapper: React.FC = () => {
    const location = useLocation();
    const project = location.state?.project as Project; // Retrieve the project object from state
    return <Kanban project={project} />; // Pass the project id as a prop
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar />} {/* Show Navbar only if authenticated */}
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginSignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/kanban/:projectId" element={<KanbanWrapper />} /> {/* Use wrapper */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;