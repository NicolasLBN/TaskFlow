import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getAllProjects, getUserData, assignUserToProject, removeUserFromProject, Project, User, Task } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import ProjectCard from '../components/Card/ProjectCard'; // Import the ProjectCard component
import { useNavigate } from 'react-router-dom'; // Import useNavigate


export interface DecodedToken {
  sub: string; // User's ID
  username: string; // Username
  exp: number; // Token expiration time
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
        password: '', // Password is not required here
      } as User;
      setcurrentUser(currentSessionUser);

      try {
        const [projectsResponse, currentUserDataResponse] = await Promise.all([
          getAllProjects(),
          getUserData(Number(decoded.sub)),
        ]);

        setProjects(projectsResponse.projects);
        console.log("All Projects:", projectsResponse.projects); // Debug the user projects

        // Determine the projects that the user is part of
        const userProjects = projectsResponse.projects.filter((project: Project) =>
          project.users?.some((user) => user.id === currentSessionUser.id)
        );

        console.log("User Projects:", userProjects); // Debug the user projects

        // Determine the projects the user is not part of
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

  // Handle joining a project
  const handleJoinProject = async (projectId: number) => {
    try {
      await assignUserToProject(projectId, currentUser.id!); // Assign user to project
      console.log(`User ${currentUser.id} joined project ${projectId}`);
  
      // Find the newly joined project
      const joinedProject = projects.find((p) => p.id === projectId);
      if (!joinedProject) {
        console.error(`Project with ID ${projectId} not found`);
        return;
      }
  
      // Add the project to userProjects
      const updatedUserProjects = [...userProjects, joinedProject];
      setUserProjects(updatedUserProjects);
  
      // Remove the project from otherProjects
      const updatedOtherProjects = otherProjects.filter((project) => project.id !== projectId);
      setOtherProjects(updatedOtherProjects);
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  // Handle leaving a project
  const handleLeaveProject = async (projectId: number) => {
    try {
      await removeUserFromProject(projectId, currentUser.id!); // Remove user from project
      console.log(`User ${currentUser.id} left project ${projectId}`);
  
      // Remove the project from userProjects
      const updatedUserProjects = userProjects.filter((project) => project.id !== projectId);
      setUserProjects(updatedUserProjects);
  
      // Add the project to otherProjects
      const leftProject = projects.find((p) => p.id === projectId);
      if (leftProject) {
        const updatedOtherProjects = [...otherProjects, leftProject];
        setOtherProjects(updatedOtherProjects);
      }
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  };

  // Navigate to Kanban board
  const handleGoToBoard = (projectId: number, tasks: Task[], currentUser: User) => {
    navigate(`/kanban/${projectId}`, { state: { tasks, currentUser } }); // Pass tasks as state
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-bold text-center my-8">Welcome to TaskFlow</h1>

      {currentUser && <p className="text-center mb-8 text-xl">Welcome, {currentUser.username}!</p>}

      {/* Your Projects Section */}
      <div className="mx-auto max-w-6xl px-10">
        <h2 className="text-3xl font-semibold text-left mb-4">Your Projects</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userProjects && userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={project.users || []}
                onLeave={handleLeaveProject}
                onGoToBoard={() => handleGoToBoard(project.id, project.tasks || [], currentUser)} 
              />
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      </div>

      {/* Other Projects Section */}
      <div className="mx-auto max-w-6xl px-10 mt-12">
        <h2 className="text-3xl font-semibold text-left mb-4">Other Projects</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {otherProjects && otherProjects.length > 0 ? (
            otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={(project.users || []).filter(user => user.id !== currentUser.id)} 
                onJoin={handleJoinProject}
              />
            ))
          ) : (
            <p>No other projects available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
