import { User } from "./User";

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status?: string;
  assignedUser: User;
  createdBy: User;
  createdDate: string;
  modifiedDate: string;
}

export interface UserTask extends Task{
  project: string;
}

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_user_id: number | null; // ID de l'utilisateur assigné (peut être null)
  project_id: number;
  created_by: number;
  created_date: string;
  modified_date: string;
}

export const toTaskDto = (task: Partial<Task>): TaskDto => {
  return {
    id: 0,
    title: task.title ?? "Default Title", // Use nullish coalescing for safer default
    description: task.description ?? "Default Description", // Use nullish coalescing
    status: task.status ?? "Todo", // Use nullish coalescing
    assigned_user_id: task.assignedUser?.id ?? 1,
    project_id: task.projectId ?? 0,
    created_by: task.createdBy?.id ?? 1,
    created_date: task.createdDate ?? new Date().toISOString(),
    modified_date: task.modifiedDate ?? new Date().toISOString(),
  };
};