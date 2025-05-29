import React from 'react';
import jiraLogo from '../assets/icons/jira.svg'; // Import the logo
import deconnexionIcon from '../assets/icons/deconnexion.png'; // Import the deconnexion icon

const Navbar: React.FC = () => {
  const handleDisconnect = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <nav
      className="bg-gray-800 text-white flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: '#202424' }}
    >
      <div className="flex items-center">
        <img src={jiraLogo} alt="Logo" className="h-8 mr-4" />
        <h1 className="text-xl font-bold">TaskFlow</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          New project
        </button>
        <button
          onClick={handleDisconnect}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <img
            src={deconnexionIcon}
            alt="Disconnect"
            className="h-5 w-5 filter grayscale"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;