import React from 'react';
import { Task } from '../../services/api';

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
      style={{
        flex: 1,
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        minHeight: '400px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(event) => onDragStart(event, task)}
            onClick={() => onTaskClick(task)} // Trigger the onTaskClick handler when a task is clicked
            style={{
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer', // Change cursor to pointer for better UX
            }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks</p>
      )}
    </div>
  );
};

export default Column;