import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../utils/Navbar';
import { getAllProjects, assignUserToProject, removeUserFromProject } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/Card/ProjectCard';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { jwtDecode } from 'jwt-decode';
import { Task, UserTask } from '../types/Task';
import TaskList from '../components/List/TaskList';
import Dropdown from '../utils/Dropdown';
import UserCard from '../components/Card/UserCard';

interface DecodedToken {
  sub: string;
  username: string;
}

const Projects: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
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

        // Création d'un tableau de tâches avec le nom du projet attaché
        const assignedTasks: UserTask[] = userProjects.flatMap((project) =>
          (project.tasks ?? [])
            .filter((task: any) => task.assigned_user_id && task.assigned_user_id.id === currentSessionUser.id)
            .map((task: any) => ({ ...task, project: project.name }))
        );
        setUserTasks(assignedTasks);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute unique people you work with (exclude yourself)
  const peopleYouWorkWith = useMemo(() => {
    if (!currentUser) return [];
    // Flatten all users from userProjects and filter out current user
    const allUsers: User[] = userProjects.flatMap(project => project.users ?? []);
    const filtered = allUsers.filter(user => user.id !== currentUser.id);
    // Create a map to remove duplicates (assuming user id uniqueness)
    const uniqueMap = new Map(filtered.map(user => [user.id, user]));
    return Array.from(uniqueMap.values());
  }, [currentUser, userProjects]);

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

  // Filtrage des userTasks en fonction des dropdowns
  const filteredUserTasks = userTasks.filter((task) => {
    const matchesProject =
      selectedProject.length === 0 || selectedProject.includes(task.project);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(task.status || '');
    return matchesProject && matchesStatus;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-bold text-center my-8">
        {currentUser?.username.toUpperCase()} Dashboard
      </h1>

      {/* People you work with Section */}
      <div className="mx-auto max-w-6xl px-10 mb-12">
        <h2 className="text-3xl font-semibold text-left mb-4">People you work with</h2>
        <div className="flex flex-wrap gap-4">
          {peopleYouWorkWith.length > 0 ? (
            peopleYouWorkWith.map(person => (
              <UserCard
                key={person.id}
                username={person.username}
              // Vous pouvez ajouter subtitle ou time si besoin
              />
            ))
          ) : (
            <p>No colleagues found.</p>
          )}
        </div>
      </div>

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
                members={project.users ?? []}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-left">Your Tasks</h2>
          <div className="flex space-x-4">
            <Dropdown
              label="Sort by Project"
              options={[...userProjects.map((project) => project.name)]}
              selected={selectedProject}
              onChange={setSelectedProject}
            />
            <Dropdown
              label="Sort by Status"
              options={['todo', 'inProgress', 'done']}
              selected={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 gap-6 mb-8">
          <TaskList userTasks={filteredUserTasks} />
        </div>
      </div>
    </div>
  );
};

export default Projects;