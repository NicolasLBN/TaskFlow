import React from 'react';
import Navbar from '../layouts/Navbar';

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to TaskFlow</h1>
        <p className="text-gray-600 text-lg">
          Organize your tasks and projects efficiently with our Kanban board.
        </p>
      </main>
    </div>
  );
};

export default HomePage;