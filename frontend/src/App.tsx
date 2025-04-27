import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import HomePage from './pages/HomePage';
import LoginSignUpPage from './pages/LoginSignUpPage';
import Kanban from './pages/Kanban';
import { Task } from './services/api'; // Adjust the import path as necessary

const App: React.FC = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

  // Wrapper component to pass projectId as a prop to Kanban
  const KanbanWrapper: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>(); // Extract projectId from URL
    return <Kanban projectId={Number(projectId)} />; // Pass projectId as a prop
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