import React, { createContext, useContext } from 'react';
import { User } from '../types/User';
import { Task } from '../types/Task';
import { Project } from '../types/Project';

interface KanbanContextProps {
  currentUser: User;
  columns: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
  setColumns: React.Dispatch<React.SetStateAction<{
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  }>>;
  project: Project;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const useKanbanContext = () => {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error('useKanbanContext must be used within KanbanProvider');
  return ctx;
};