import React from 'react';
import jiraLogo from '../assets/icons/jira.svg'; // Import the logo from the assets folder


const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white flex items-center justify-between px-6 py-3" style={{ backgroundColor: '#202424' }}>
      <div className="flex items-center">
        <img src={jiraLogo} alt="Logo" className="h-8 mr-4" />
        <h1 className="text-xl font-bold">TaskFlow</h1>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">New project</button>
    </nav>
  );
};

export default Navbar;