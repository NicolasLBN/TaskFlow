import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getAllProjects, assignUserToProject, removeUserFromProject } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/Card/ProjectCard';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { jwtDecode } from 'jwt-decode';
import { Task, toTask } from '../types/Task';
import TaskList from '../components/List/TaskList';

// Define DecodedToken interface for jwtDecode
interface DecodedToken {
  sub: string;
  username: string;
}

const Projects: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Decode the token to get the current user's information
        const tokenValue = localStorage.getItem('authToken') || '';
        const decoded: DecodedToken = jwtDecode(tokenValue);
        const currentSessionUser: User = {
          id: Number(decoded.sub),
          username: decoded.username,
          password: ''
        };
        setCurrentUser(currentSessionUser);

        // Fetch all projects
        const projectsResponse = await getAllProjects();
        const projects = projectsResponse.projects || [];
        setProjects(projects);

        // Separate projects into userProjects and otherProjects
        const userProjects: Project[] = [];
        const otherProjects: Project[] = [];

        projects.forEach((project: Project) => {
          const isMember = (project.users ?? []).some((user: User) => user.id === currentSessionUser.id);
          if (isMember) {
            userProjects.push(project);
          } else {
            otherProjects.push(project);
          }
        });

        setUserProjects(userProjects);
        setOtherProjects(otherProjects);
        console.log('User Projects:', userProjects);

        const assignedTasks = userProjects
        .flatMap((project) => project.tasks || []) // Get all tasks from userProjects
        .filter((task: any) => 
                  task.assigned_user_id && 
                  task.assigned_user_id.id === currentSessionUser.id); // Filter tasks assigned to the current user

        console.log('Assigned Tasks:', assignedTasks);

        setUserTasks(assignedTasks); // Update the userTasks state with assigned tasks

      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle joining a project
  const handleJoinProject = async (projectId: number) => {
    try {
      if (!currentUser || currentUser.id === undefined) return;
      await assignUserToProject(projectId, currentUser.id);

      // Update userProjects and otherProjects
      const joinedProject = projects.find((project) => project.id === projectId);
      if (joinedProject) {
        setUserProjects((prev) => [...prev, joinedProject]);
        setOtherProjects((prev) => prev.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  // Handle leaving a project
  const handleLeaveProject = async (projectId: number) => {
    try {
      if (!currentUser || currentUser.id === undefined) return;
      await removeUserFromProject(projectId, currentUser.id);

      // Update userProjects and otherProjects
      const leftProject = projects.find((project) => project.id === projectId);
      if (leftProject) {
        setOtherProjects((prev) => [...prev, leftProject]);
        setUserProjects((prev) => prev.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  };

  // Navigate to Kanban board
  const handleGoToBoard = (project: Project) => {
    navigate(`/kanban/${project.id}`, { state: { project } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-bold text-center my-8">Projects</h1>

      {/* User Projects Section */}
      <div className="mx-auto max-w-6xl px-10">
        <h2 className="text-3xl font-semibold text-left mb-4">Your Projects</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={project.users ?? []}
                onLeave={() => handleLeaveProject(project.id)}
                onGoToBoard={() => handleGoToBoard(project)}
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
          {otherProjects.length > 0 ? (
            otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={(project.users ?? [])}
                onJoin={() => handleJoinProject(project.id)}
              />
            ))
          ) : (
            <p>No other projects available.</p>
          )}
        </div>
      </div>

      {/* Task Section */}
      <div className="mx-auto max-w-6xl px-10 mt-12">
        <h2 className="text-3xl font-semibold text-left mb-4">Your Tasks</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 gap-6 mb-8">
          <TaskList tasks={userTasks} />
        </div>
      </div>
    </div>
  );
};

export default Projects;