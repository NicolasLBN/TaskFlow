import React, { useContext } from 'react';
import { Task } from '../../types/Task';
import TicketCard from '../Card/TicketCard'; // <-- Ajoute cet import
import { KanbanContext } from '../../context/KanbanContext'; // <-- Import du contexte


interface ColumnProps {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent, task: Task) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onTaskClick: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = React.memo(({ title, tasks, onDragStart, onDrop, onDragOver, onTaskClick }) => {
  const kanban = useContext(KanbanContext); // <-- Utilisation du contexte

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="flex-1 p-4 border border-gray-300 rounded-lg bg-[#28242c] min-h-[400px]"
    >
      <h2 className="text-center mb-4 text-xl font-semibold">{title}</h2>
      
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TicketCard
            key={task.id}
            task={{ ...task, project: kanban?.project.name ?? '' }} // <-- Utilisation du nom du projet depuis le contexte
            onDragStart={onDragStart}
            onTaskClick={onTaskClick}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No tasks</p>
      )}
    </div>
  );
});

export default Column;