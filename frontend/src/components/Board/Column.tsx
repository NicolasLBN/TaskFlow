import React from 'react';
import { Task } from '../../types/Task';

interface ColumnProps {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent, task: Task) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onTaskClick: (task: Task) => void; // New prop for handling task clicks
}

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDrop, onDragOver, onTaskClick }) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="flex-1 p-4 border border-gray-300 rounded-lg bg-[#28242c] min-h-[400px]"
    >
      <h2 className="text-center mb-4 text-xl font-semibold">{title}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(event) => onDragStart(event, task)}
            onClick={() => onTaskClick(task)} // Trigger the onTaskClick handler when a task is clicked
            className="p-2 mb-2 border border-gray-300 rounded-md bg-[#3E3C3F] cursor-pointer"
          >
            <h4 className="text-lg font-medium">{task.title}</h4>
            <p className="text-sm">{task.description}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No tasks</p>
      )}
    </div>
  );
};

export default Column;
