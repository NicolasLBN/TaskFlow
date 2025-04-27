import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getAllProjects, getUserData, assignUserToProject, removeUserFromProject, Project, User, Task } from '../services/api';
import {jwtDecode} from 'jwt-decode';
import ProjectCard from '../components/Card/ProjectCard'; // Import the ProjectCard component
import { useNavigate } from 'react-router-dom'; // Import useNavigate


export interface DecodedToken {
  sub: string; // ID de l'utilisateur
  username: string; // Nom d'utilisateur
  exp: number; // Expiration du token
}

const HomePage: React.FC = () => {
  const [currentUser, setcurrentUser] = useState<User>({} as User);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchData = async () => {
      const tokenValue = localStorage.getItem('authToken') || '';
      const decoded: DecodedToken = jwtDecode(tokenValue);
      const currentSessionUser: User = {
        id: Number(decoded.sub),
        username: decoded.username,
        password: '', // Le mot de passe n'est pas nécessaire ici
      } as User;
      setcurrentUser(currentSessionUser);

      try {
        const [projectsResponse, currentUserDataResponse] = await Promise.all([
          getAllProjects(),
          getUserData(Number(decoded.sub)),
        ]);

        setProjects(projectsResponse.projects);
        console.log("All Projects:", projectsResponse.projects); // Debug the user projects

              // Déterminer les projets auxquels l'utilisateur participe
      const userProjects = projectsResponse.projects.filter((project: Project) =>
        project.users?.some((user) => user.id === currentSessionUser.id)
      );

      console.log("User Projects:", userProjects); // Debug the user projects

      // Déterminer les projets auxquels l'utilisateur ne participe pas
      const otherProjects = projectsResponse.projects.filter((project: Project) =>
        !project.users?.some((user) => user.id === currentSessionUser.id)
      );
      console.log("Other Projects:", otherProjects); // Debug the user projects

      setUserProjects(userProjects);
      setOtherProjects(otherProjects);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinProject = async (projectId: number) => {
    try {
      // Appeler l'API pour rejoindre le projet
      await assignUserToProject(projectId, currentUser.id!);
      console.log(`User ${currentUser.id} joined project ${projectId}`);
  
      // Trouver le projet ajouté
      const joinedProject = projects.find((p) => p.id === projectId);
      if (!joinedProject) {
        console.error(`Project with ID ${projectId} not found`);
        return;
      }
  
      // Ajouter le projet à userProjects
      const updatedUserProjects = [...userProjects, joinedProject];
      setUserProjects(updatedUserProjects);
  
      // Retirer le projet de otherProjects
      const updatedOtherProjects = otherProjects.filter((project) => project.id !== projectId);
      setOtherProjects(updatedOtherProjects);
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  const handleLeaveProject = async (projectId: number) => {
    try {
      // Appeler l'API pour quitter le projet
      await removeUserFromProject(projectId, currentUser.id!);
      console.log(`User ${currentUser.id} left project ${projectId}`);
  
      // Retirer le projet de userProjects
      const updatedUserProjects = userProjects.filter((project) => project.id !== projectId);
      setUserProjects(updatedUserProjects);
  
      // Ajouter le projet à otherProjects
      const leftProject = projects.find((p) => p.id === projectId);
      if (leftProject) {
        const updatedOtherProjects = [...otherProjects, leftProject];
        setOtherProjects(updatedOtherProjects);
      }
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  };


  const handleGoToBoard = (projectId: number, tasks: Task[], currentUser: User) => {
    navigate(`/kanban/${projectId}`, { state: { tasks, currentUser } }); // Pass tasks as state
  };

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <div>
      <Navbar />
      <h1>Welcome to TaskFlow</h1>
      {currentUser && <p>Welcome, {currentUser.username}!</p>}

      <h2>Your Projects</h2>
      <div>
        {userProjects && userProjects.length > 0 ? (
          userProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={project.users || []} // Pas besoin de membres pour les projets auxquels l'utilisateur participe
              onLeave={handleLeaveProject}
              onGoToBoard={ () => handleGoToBoard(project.id, project.tasks || [], currentUser)} // Passer la fonction "Go to Board"
            />
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>

      <h2>Other Projects</h2>
      <div>
        {otherProjects && otherProjects.length > 0 ? (
          otherProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={(project.users || []).filter(user => user.id !== currentUser.id)} // Pas besoin de membres pour les projets auxquels l'utilisateur participe
              onJoin={handleJoinProject} // Passer la fonction "Join"
            />
          ))
        ) : (
          <p>No other projects available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;