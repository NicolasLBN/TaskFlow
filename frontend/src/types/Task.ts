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
      project_id: task.projectId || 0, // ID de projet par défaut
      created_by: task.createdBy?.id || 1, // Créateur par défaut (ID 1)
      created_date: task.createdDate || new Date().toISOString(), // Date de création par défaut
      modified_date: task.modifiedDate || new Date().toISOString(), // Date de modification par défaut
    };
  };

  export const toTask = (taskDto: Partial<TaskDto>, users: User[] = []): Task => {
    const assignedUser = users.find(user => user.id === taskDto.assigned_user_id) || {
      id: taskDto.assigned_user_id || 0,
      username: "Unknown User",
      password: "",
    };
    const createdBy = users.find(user => user.id === taskDto.created_by) || {
      id: taskDto.created_by || 0,
      username: "Unknown Creator",
      password: "",
    };
  
    return {
      id: taskDto.id || 0,
      projectId: taskDto.project_id || 0,
      title: taskDto.title || "Default Title",
      description: taskDto.description || "Default Description",
      status: taskDto.status || "Todo",
      assignedUser: assignedUser,
      createdBy: createdBy,
      createdDate: taskDto.created_date || new Date().toISOString(),
      modifiedDate: taskDto.modified_date || new Date().toISOString(),
    };
  };