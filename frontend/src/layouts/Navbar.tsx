import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white flex items-center justify-between px-6 py-3">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 mr-4" />
        <h1 className="text-xl font-bold">TaskFlow</h1>
      </div>
      <ul className="flex space-x-6">
        <li className="relative group">
          <button className="hover:text-blue-400">Votre travail</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/tasks" className="block px-4 py-2 hover:bg-gray-600">Mes tâches</a>
            <a href="/recent" className="block px-4 py-2 hover:bg-gray-600">Récents</a>
          </div>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-400">Projets</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/projects" className="block px-4 py-2 hover:bg-gray-600">Tous les projets</a>
            <a href="/favorites" className="block px-4 py-2 hover:bg-gray-600">Favoris</a>
          </div>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-400">Filtres</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/filters" className="block px-4 py-2 hover:bg-gray-600">Créer un filtre</a>
            <a href="/saved-filters" className="block px-4 py-2 hover:bg-gray-600">Filtres enregistrés</a>
          </div>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-400">Tableaux de bord</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/dashboards" className="block px-4 py-2 hover:bg-gray-600">Tous les tableaux</a>
            <a href="/create-dashboard" className="block px-4 py-2 hover:bg-gray-600">Créer un tableau</a>
          </div>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-400">Équipes</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/teams" className="block px-4 py-2 hover:bg-gray-600">Mes équipes</a>
            <a href="/create-team" className="block px-4 py-2 hover:bg-gray-600">Créer une équipe</a>
          </div>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-400">Appli</button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
            <a href="/apps" className="block px-4 py-2 hover:bg-gray-600">Toutes les applications</a>
            <a href="/install-app" className="block px-4 py-2 hover:bg-gray-600">Installer une application</a>
          </div>
        </li>
      </ul>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Créer</button>
    </nav>
  );
};

export default Navbar;