import React, { useState, useEffect } from 'react';
import { getAllTasksByProjectId, Task, updateTask } from '../services/api'; // Add a function to fetch tasks
import Navbar from '../layouts/Navbar';
import Column from '../components/Board/Column';
import Modal from '../components/Board/Modal';

const Kanban: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [columns, setColumns] = useState({
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[],
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for the selected task
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    // Fetch tasks from the backend on mount
    const fetchTasks = async () => {
      try {
        const tasks = await getAllTasksByProjectId(projectId); // Fetch all tasks from the backend
        console.log('Fetched tasks:', tasks); // Debug the fetched tasks
        setColumns({
          todo: tasks.filter((task: Task) => task.status === 'todo'),
          inProgress: tasks.filter((task: Task) => task.status === 'inProgress'),
          done: tasks.filter((task: Task) => task.status === 'done'),
        });
        console.log('Columns state after fetching tasks:', columns); // Debug the columns state
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();


    // Set up WebSocket connection
    const socket = new WebSocket('ws://localhost:8000/ws/kanban');

    socket.onmessage = (event) => {
      const updatedTask = JSON.parse(event.data) as Task;

      // Update columns with the updated task
      setColumns((prevColumns) => {
        const fromColumn = Object.keys(prevColumns).find((key) =>
          prevColumns[key as keyof typeof prevColumns].some((task) => task.id === updatedTask.id)
        );

        if (!fromColumn) return prevColumns;

        const updatedFromColumn = prevColumns[fromColumn as keyof typeof prevColumns].filter(
          (task) => task.id !== updatedTask.id
        );
        const updatedTargetColumn = [
          ...prevColumns[updatedTask.status as keyof typeof prevColumns],
          updatedTask,
        ];

        return {
          ...prevColumns,
          [fromColumn]: updatedFromColumn,
          [updatedTask.status as keyof typeof prevColumns]: updatedTargetColumn,
        };
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleDragStart = (event: React.DragEvent, task: Task, column: 'todo' | 'inProgress' | 'done') => {
    event.dataTransfer.setData('task', JSON.stringify(task));
    event.dataTransfer.setData('fromColumn', column);
  };

  const handleDrop = async (event: React.DragEvent, targetColumn: 'todo' | 'inProgress' | 'done') => {
    const task = JSON.parse(event.dataTransfer.getData('task')) as Task;
    const fromColumn = event.dataTransfer.getData('fromColumn') as 'todo' | 'inProgress' | 'done';
  
    if (fromColumn === targetColumn) return; // Prevent moving within the same column
  
    // Update columns locally
    setColumns((prevColumns) => {
      const updatedFromColumn = prevColumns[fromColumn].filter((t) => t.id !== task.id); // Remove task from original column
      const updatedTargetColumn = [...prevColumns[targetColumn], { ...task, status: targetColumn }]; // Add task to target column
  
      return {
        ...prevColumns,
        [fromColumn]: updatedFromColumn,
        [targetColumn]: updatedTargetColumn,
      };
    });
  
    // Update task in the database
    try {
      await updateTask(task.id, {
        title: task.title, // Ensure title is included
        description: task.description,
        status: targetColumn, // Update the status to the target column
      });
      console.log(`Task ${task.id} updated successfully to ${targetColumn}`);
    } catch (error) {
      console.error(`Error updating task ${task.id}:`, error);
      alert('Failed to update the task. Please try again.');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task); // Set the selected task
    console.log(task)
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedTask(null); // Clear the selected task
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
          onTaskClick={handleTaskClick} // Pass the click handler
        />
        <Column
          title="In Progress"
          tasks={columns.inProgress}
          onDragStart={(event, task) => handleDragStart(event, task, 'inProgress')}
          onDrop={(event) => handleDrop(event, 'inProgress')}
          onDragOver={handleDragOver}
          onTaskClick={handleTaskClick} // Pass the click handler

        />
        <Column
          title="Done"
          tasks={columns.done}
          onDragStart={(event, task) => handleDragStart(event, task, 'done')}
          onDrop={(event) => handleDrop(event, 'done')}
          onDragOver={handleDragOver}
          onTaskClick={handleTaskClick} // Pass the click handler
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={selectedTask}
        onSave={(updatedTask) => {
          // Update the task in the columns state
          setColumns((prevColumns) => {
            const fromColumn = Object.keys(prevColumns).find((key) =>
              prevColumns[key as keyof typeof prevColumns].some((task) => task.id === updatedTask.id)
            );

            if (!fromColumn) return prevColumns;

            const updatedFromColumn = prevColumns[fromColumn as keyof typeof prevColumns].map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            );

            return {
              ...prevColumns,
              [fromColumn]: updatedFromColumn,
            };
          });

          closeModal(); // Close the modal after saving
        }}
      />

    </div>
  );
};

export default Kanban;