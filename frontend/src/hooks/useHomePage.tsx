import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProjects, assignUserToProject, removeUserFromProject } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { UserTask } from '../types/Task';

interface DecodedToken {
  sub: string;
  username: string;
}

/**
 * Custom hook to manage the logic and state for the HomePage.
 * Handles user authentication, project membership, colleagues, and task filtering.
 *
 * @param {(path: string, options?: any) => void} navigate - Navigation function (e.g., from useNavigate).
 * @returns {{
 *   currentUser: User | null,
 *   userTasks: UserTask[],
 *   projects: Project[],
 *   userProjects: Project[],
 *   otherProjects: Project[],
 *   loading: boolean,
 *   selectedProject: string[],
 *   setSelectedProject: React.Dispatch<React.SetStateAction<string[]>>,
 *   selectedStatus: string[],
 *   setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>,
 *   peopleYouWorkWith: User[],
 *   handleJoinProject: (projectId: number) => Promise<void>,
 *   handleLeaveProject: (projectId: number) => Promise<void>,
 *   handleGoToBoard: (project: Project) => void,
 *   filteredUserTasks: UserTask[],
 * }}
 */
export function useHomePage(navigate: (path: string, options?: any) => void) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Fetch user and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenValue = localStorage.getItem('authToken') || '';
        const decoded: DecodedToken = jwtDecode(tokenValue);
        const currentSessionUser: User = {
          id: Number(decoded.sub),
          username: decoded.username,
          password: ''
        };
        setCurrentUser(currentSessionUser);

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

        // Build userTasks with project name
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

  /**
   * Compute unique colleagues (excluding current user).
   */
  const peopleYouWorkWith = useMemo(() => {
    if (!currentUser) return [];
    const allUsers: User[] = userProjects.flatMap(project => project.users ?? []);
    const filtered = allUsers.filter(user => user.id !== currentUser.id);
    const uniqueMap = new Map(filtered.map(user => [user.id, user]));
    return Array.from(uniqueMap.values());
  }, [currentUser, userProjects]);

  /**
   * Join a project by ID.
   */
  const handleJoinProject = useCallback(async (projectId: number) => {
    try {
      if (!currentUser || currentUser.id === undefined) return;
      await assignUserToProject(projectId, currentUser.id);

      const joinedProject = projects.find((project) => project.id === projectId);
      if (joinedProject) {
        setUserProjects((prev) => [...prev, joinedProject]);
        setOtherProjects((prev) => prev.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  }, [currentUser, projects]);

  /**
   * Leave a project by ID.
   */
  const handleLeaveProject = useCallback(async (projectId: number) => {
    try {
      if (!currentUser || currentUser.id === undefined) return;
      await removeUserFromProject(projectId, currentUser.id);

      const leftProject = projects.find((project) => project.id === projectId);
      if (leftProject) {
        setOtherProjects((prev) => [...prev, leftProject]);
        setUserProjects((prev) => prev.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  }, [currentUser, projects]);

  /**
   * Navigate to the Kanban board for a project.
   */
  const handleGoToBoard = useCallback((project: Project) => {
    navigate(`/kanban/${project.id}`, { state: { project } });
  }, [navigate]);

  /**
   * Filter user tasks by selected project and status.
   */
  const filteredUserTasks = useMemo(() => {
    return userTasks.filter((task) => {
      const matchesProject =
        selectedProject.length === 0 || selectedProject.includes(task.project);
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(task.status || '');
      return matchesProject && matchesStatus;
    });
  }, [userTasks, selectedProject, selectedStatus]);

  return {
    currentUser,
    userTasks,
    projects,
    userProjects,
    otherProjects,
    loading,
    selectedProject,
    setSelectedProject,
    selectedStatus,
    setSelectedStatus,
    peopleYouWorkWith,
    handleJoinProject,
    handleLeaveProject,
    handleGoToBoard,
    filteredUserTasks,
  };
}