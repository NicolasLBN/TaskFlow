import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import HomePage from './pages/HomePage';
import LoginSignUpPage from './pages/LoginSignUpPage';
import Kanban from './pages/Kanban';
import { useLocation } from 'react-router-dom';


const App: React.FC = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

    // Wrapper component to handle state injection
  const KanbanWrapper: React.FC = () => {
    const location = useLocation();
    const tasks = location.state?.tasks || []; // Retrieve tasks from state
    return <Kanban tasks={tasks} />;
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
          <Route path="/kanban/:projectId" element={<KanbanWrapper />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;