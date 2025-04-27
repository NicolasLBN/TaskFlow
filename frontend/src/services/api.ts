import axios from "axios";

// Base URL de ton backend
const API_URL = "http://localhost:8000"; // Change si nécessaire

// Types
export interface User {
  id?: number; // Optional for registration
  username: string;
  password: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  users?: User[]; // Optional for registration
  tasks?: Task[]; // Optional for registration
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status?: string;
  assignedUser: User;
  createdBy: User;
  createdDate: string;
  modifiedDate: string;
}

// API Calls

// Users
export const registerUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/register/`, user);
  return response.data;
};

export const loginUser = async (user: User) => {
  console.log("Login user:", user); // Debug the user object
  const response = await axios.post(`${API_URL}/login/`, user);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users/`);
  return response.data;
};

// Projects
export const createProject = async (project: Project) => {
  const response = await axios.post(`${API_URL}/projects/`, project);
  return response.data;
};


export const getAllProjects = async () => {
  const response = await axios.get(`${API_URL}/projects/`);
  return response.data;
};

export const assignUserToProject = async (projectId: number, userId: number) => {
  console.log("Assigning user to project:", { projectId, userId }); // Debug the IDs
  const response = await axios.post(`${API_URL}/projects/${projectId}/users/${userId}`);
  return response.data;
};

export const removeUserFromProject = async (projectId: number, userId: number) => {
  console.log("Assigning user to project:", { projectId, userId }); // Debug the IDs
  const response = await axios.delete(`${API_URL}/projects/${projectId}/users/${userId}`);
  return response.data;
};

// Tasks
export const createTask = async (task: Task) => {
  const response = await axios.post(`${API_URL}/tasks/`, task);
  return response.data;
};

export const updateTaskStatus = async (taskId: number, status: string) => {
  console.log("Updating task status:", { taskId, status }); // Debug the IDs
  const response = await axios.put(`${API_URL}/tasks/${taskId}`, { status, modifiedDate: new Date().toISOString() });
  return response.data;
};

export const getAllTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks/`);
  return response.data;
};

export const getUserData = async (userId: number) => {
  console.log("User ID:", userId); // Debug the user ID value

  if (!userId) {
    throw new Error("No user ID provided");
  }

  const response = await axios.get(`${API_URL}/user-data/`, {
    params: {
      user_id: userId, // Pass the user ID as a query parameter
    },
  });
  return response.data;
};