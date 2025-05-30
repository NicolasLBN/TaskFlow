import axios from "axios";
import { User } from "../types/User";
import { Project } from "../types/Project";
import { TaskDto, Task, toTaskDto } from "../types/Task";

// Base URL de ton backend
const API_URL = "http://localhost:8000"; // Change si nécessaire

// API Calls

// Users
export const registerUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/register/`, user);
  return response.data;
};

export const loginUser = async (user: User) => {
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
  const response = await axios.get(`${API_URL}/projects-with-details/`);
  return response.data;
};

export const assignUserToProject = async (projectId: number, userId: number) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/users/${userId}`);
  return response.data;
};

export const removeUserFromProject = async (projectId: number, userId: number) => {
  const response = await axios.delete(`${API_URL}/projects/${projectId}/users/${userId}`);
  return response.data;
};

// Tasks
export const createTask = async (task: TaskDto) => {
  const response = await axios.post(`${API_URL}/tasks/`, task);
  return response.data;
};

export const updateTask = async (taskId: number, updatedTask: Partial<TaskDto>): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask);
  return response.data;
};

export const updateTaskStatus = async (taskId: number, status: string) => {
  const response = await axios.put(`${API_URL}/tasks/${taskId}`, { status, modifiedDate: new Date().toISOString() });
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
  return response.data;
};

export const getAllTasksByProjectId = async (projectId: number) => {
  const response = await axios.get(`${API_URL}/tasks`, {
    params: { project_id: projectId },
  });
  return response.data;
};

export const getUserData = async (userId: number) => {

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