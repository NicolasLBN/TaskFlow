import React, { useState } from 'react';
import { updateTaskStatus, Task } from '../services/api';
import Navbar from '../layouts/Navbar';
import Column from '../components/Board/Column';

interface KanbanProps {
  tasks: Task[];
}

const Kanban: React.FC<KanbanProps> = ({ tasks }) => {
  const [columns, setColumns] = useState({
    todo: tasks.filter((task) => task.status === 'To Do'),
    inProgress: tasks.filter((task) => task.status === 'In Progress'),
    done: tasks.filter((task) => task.status === 'Done'),
  });

  const handleDragStart = (event: React.DragEvent, task: Task, column: 'todo' | 'inProgress' | 'done') => {
    event.dataTransfer.setData('task', JSON.stringify(task));
    event.dataTransfer.setData('fromColumn', column);
  };

  const handleDrop = (event: React.DragEvent, targetColumn: 'todo' | 'inProgress' | 'done') => {
    const task = JSON.parse(event.dataTransfer.getData('task')) as Task;
    const fromColumn = event.dataTransfer.getData('fromColumn') as 'todo' | 'inProgress' | 'done';

    if (fromColumn === targetColumn) return;

    // Update columns
    setColumns((prevColumns) => {
      const updatedFromColumn = prevColumns[fromColumn].filter((t) => t.id !== task.id);
      const updatedTargetColumn = [...prevColumns[targetColumn], { ...task, status: targetColumn }];

      return {
        ...prevColumns,
        [fromColumn]: updatedFromColumn,
        [targetColumn]: updatedTargetColumn,
      };
    });
    updateTaskStatus(task.id, targetColumn);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <h1>Kanban Board</h1>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Column
          title="To Do"
          tasks={columns.todo}
          onDragStart={(event, task) => handleDragStart(event, task, 'todo')}
          onDrop={(event) => handleDrop(event, 'todo')}
          onDragOver={handleDragOver}
        />
        <Column
          title="In Progress"
          tasks={columns.inProgress}
          onDragStart={(event, task) => handleDragStart(event, task, 'inProgress')}
          onDrop={(event) => handleDrop(event, 'inProgress')}
          onDragOver={handleDragOver}
        />
        <Column
          title="Done"
          tasks={columns.done}
          onDragStart={(event, task) => handleDragStart(event, task, 'done')}
          onDrop={(event) => handleDrop(event, 'done')}
          onDragOver={handleDragOver}
        />
      </div>
    </div>
  );
};

export default Kanban;