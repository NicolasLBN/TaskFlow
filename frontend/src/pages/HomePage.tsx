import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getAllProjects, getAllUsers, getUserData, Project, User } from '../services/api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  sub: string; // ID de l'utilisateur
  username: string; // Nom d'utilisateur
  exp: number; // Expiration du token
}


const HomePage: React.FC = () => {
  const [currentUserName, setCurrentUsername] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]); // State to store fetched projects
  const [userProjects, setUserProjects] = useState<Project[]>([]); // State to store fetched projects
  const [currentUserTeamMembers, setcurrentUserTeamMembers] = useState<User[]>([]); // State to store fetched projects


  const [loading, setLoading] = useState<boolean>(true); // State to manage loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users, projects, and current user in parallel
        const [projectsResponse, currentUserDataResponse] = await Promise.all([
          getAllProjects(),
          getUserData()
        ]);

        const projectsData = projectsResponse.projects; // Adjust based on your API response structure
        const currentUserData = currentUserDataResponse; // Adjust based on your API response structure

        // Update states
        setProjects(projectsData);
        setcurrentUserTeamMembers(currentUserData.teamMembers); // Assuming teamMembers is part of the current user data
        setUserProjects(currentUserData.projects); // Assuming projects is part of the current user data

        const tokenValue = localStorage.getItem('authToken') || '';
        console.log('Token:', tokenValue); // Display the token value
        const decoded: DecodedToken = jwtDecode(tokenValue); // Décoder le token
        setCurrentUsername(decoded.username); // Set the username from the decoded token

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
      <Navbar /> {/* Insert the Navbar component here */}
      <h1>Welcome to TaskFlow</h1>
      {currentUserName && <p>Welcome, {currentUserName}!</p>}

      <h2>Your Projects</h2>
      <ul>
        {userProjects.map((project, index) => (
          <li key={index}>
            <strong>{project.name}</strong>: {project.description}
          </li>
        ))}
      </ul>

      <h2>Your Team Members</h2>
      <ul>
        {currentUserTeamMembers.map((member) => (
          <li key={member.username}>{member.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;