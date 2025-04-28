import { User } from "./User";

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
      title: task.title || "Default Title", // Titre par défaut
      description: task.description || "Default Description", // Description par défaut
      status: task.status || "Todo", // Statut par défaut
      assigned_user_id: task.assignedUser?.id || 1, // Utilisateur assigné ou null
      project_id: task.project_id || 0, // ID de projet par défaut
      created_by: task.createdBy?.id || 1, // Créateur par défaut (ID 1)
      created_date: task.createdDate || new Date().toISOString(), // Date de création par défaut
      modified_date: task.modifiedDate || new Date().toISOString(), // Date de modification par défaut
    };
  };