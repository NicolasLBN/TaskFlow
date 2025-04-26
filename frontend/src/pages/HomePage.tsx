import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getAllProjects, getAllUsers, Project, User } from '../services/api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface CurrentUser {
  username: string;
  email: string;
}

interface DecodedToken {
  sub: string; // ID de l'utilisateur
  username: string; // Nom d'utilisateur
  exp: number; // Expiration du token
}


const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store fetched users
  const [projects, setProjects] = useState<Project[]>([]); // State to store fetched projects
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users, projects, and current user in parallel
        const [usersResponse, projectsResponse] = await Promise.all([
          getAllUsers(),
          getAllProjects()
        ]);

        const usersData = usersResponse.users; // Adjust based on your API response structure
        const projectsData = projectsResponse.projects; // Adjust based on your API response structure

        // Update states
        setUsers(usersData);
        setProjects(projectsData);

        const tokenValue = localStorage.getItem('authToken') || '';
        console.log('Token:', tokenValue); // Display the token value
        const decoded: DecodedToken = jwtDecode(tokenValue); // Décoder le token

        console.log(decoded); // Display username from the token

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Set loading to false after all calls are complete
        setLoading(false);
      }
    };

    fetchData(); // Call the combined fetch function
  }, []); // Empty dependency array ensures this runs only once
  

  if (loading) {
    return <p>Loading...</p>;
  }

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