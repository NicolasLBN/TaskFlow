import { Task } from "./Task";
import { User } from "./User";

export interface Project {
    id: number;
    name: string;
    description: string;
    tasks?: Task[]; // Optional for registration
    users?: User[]; // Optional for registration
  }