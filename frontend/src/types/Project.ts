import { Task } from "./Task";
import { User } from "./User";

export interface Project {
    id: number;
    name: string;
    description: string;
    users?: User[]; // Optional for registration
    tasks?: Task[]; // Optional for registration
  }