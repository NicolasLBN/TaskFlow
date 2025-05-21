import React, { useState, useEffect } from 'react';
import { createTask, getAllTasksByProjectId, updateTask, deleteTask } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import Column from '../components/Board/Column';
import Modal from '../components/Board/Modal';
import { User } from '../types/User';
import { Task, toTaskDto } from '../types/Task';
import { Project } from '../types/Project';

interface DecodedToken {
  sub: string;
  username: string;
}

const Kanban: React.FC<{ project: Project }> = ({ project }) => {
  // State for the current user
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  // State for columns (tasks grouped by status)
  const [columns, setColumns] = useState({
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[],
  });
  // State for the currently selected task (for modal)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Decode JWT token to get current session user
  const tokenValue = localStorage.getItem('authToken') || '';
  const decoded: DecodedToken = jwtDecode(tokenValue);
  const currentSessionUser: User = {
    id: Number(decoded.sub),
    username: decoded.username,
    password: '', // Password is not needed here
  } as User;

  // Fetch tasks when the component mounts or project changes
  useEffect(() => {
    const fetchTasks = async () => {
      setCurrentUser(currentSessionUser);

      try {
        // Fetch all tasks for the current project
        const tasks = await getAllTasksByProjectId(project.id);
        // Group tasks by status into columns
        setColumns({
          todo: tasks.filter((task: Task) => task.status === 'todo'),
          inProgress: tasks.filter((task: Task) => task.status === 'inProgress'),
          done: tasks.filter((task: Task) => task.status === 'done'),
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
    // Set up periodic fetch every 30 seconds
    const interval = setInterval(fetchTasks, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [project.id]);

  // Handle drag start event for a task
  const handleDragStart = (
    event: React.DragEvent,
    task: Task,
    column: 'todo' | 'inProgress' | 'done'
  ) => {
    event.dataTransfer.setData('task', JSON.stringify(task));
    event.dataTransfer.setData('fromColumn', column);
  };

  // Handle drop event to move a task between columns
  const handleDrop = async (
    event: React.DragEvent,
    targetColumn: 'todo' | 'inProgress' | 'done'
  ) => {
    const task = JSON.parse(event.dataTransfer.getData('task')) as Task;
    const fromColumn = event.dataTransfer.getData('fromColumn') as
      | 'todo'
      | 'inProgress'
      | 'done';

    if (fromColumn === targetColumn) return;

    // Update columns locally
    setColumns((prevColumns) => {
      const updatedFromColumn = prevColumns[fromColumn].filter((t) => t.id !== task.id);
      const updatedTargetColumn = [
        ...prevColumns[targetColumn],
        { ...task, status: targetColumn },
      ];

      return {
        ...prevColumns,
        [fromColumn]: updatedFromColumn,
        [targetColumn]: updatedTargetColumn,
      };
    });

    // Update task status in backend
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: targetColumn,
      });
    } catch (error) {
      console.error(`Error updating task ${task.id}:`, error);
      alert('Failed to update the task. Please try again.');
    }
  };

  // Allow dropping by preventing default
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Open modal in edit mode for a selected task
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close the modal and reset selected task
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Handle saving (creating or updating) a task
  const handleSaveTask = async (task: Task) => {
    try {
      if (task.id === 0) {
        // Create new task
        const taskDto = toTaskDto(task);
        const newTask = await createTask(taskDto);

        // Add the new task locally to the correct column
        setColumns((prevColumns) => ({
          ...prevColumns,
          [task.status as keyof typeof prevColumns]: [
            ...prevColumns[task.status as keyof typeof prevColumns],
            { ...task, ...newTask },
          ],
        }));
      } else {
        // Update existing task
        const updatedTask = await updateTask(task.id, task);

        // Update the task locally in the correct column
        setColumns((prevColumns) => {
          const fromColumn = Object.keys(prevColumns).find((key) =>
            prevColumns[key as keyof typeof prevColumns].some((t) => t.id === updatedTask.id)
          );
  
          if (!fromColumn) return prevColumns;
  
          const updatedFromColumn = prevColumns[fromColumn as keyof typeof prevColumns].map((t) =>
            t.id === updatedTask.id ? updatedTask : t
          );
  
          return {
            ...prevColumns,
            [fromColumn]: updatedFromColumn,
          };
        });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save the task. Please try again.');
    } finally {
      closeModal();
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      // Remove the task from all columns locally
      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key as keyof typeof prevColumns] = updatedColumns[
            key as keyof typeof prevColumns
          ].filter((task) => task.id !== taskId);
        });
        return updatedColumns;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete the task. Please try again.');
    } finally {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-[#3E3C3F]">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Kanban Board</h1>
        <div className="flex gap-4">
          {/* Render each column with its tasks and handlers */}
          <Column
            title="To Do"
            tasks={columns.todo}
            onDragStart={(event, task) => handleDragStart(event, task, 'todo')}
            onDrop={(event) => handleDrop(event, 'todo')}
            onDragOver={handleDragOver}
            onTaskClick={handleTaskClick}
          />
          <Column
            title="In Progress"
            tasks={columns.inProgress}
            onDragStart={(event, task) => handleDragStart(event, task, 'inProgress')}
            onDrop={(event) => handleDrop(event, 'inProgress')}
            onDragOver={handleDragOver}
            onTaskClick={handleTaskClick}
          />
          <Column
            title="Done"
            tasks={columns.done}
            onDragStart={(event, task) => handleDragStart(event, task, 'done')}
            onDrop={(event) => handleDrop(event, 'done')}
            onDragOver={handleDragOver}
            onTaskClick={handleTaskClick}
          />
        </div>
        <div className="text-center mt-8">
          {/* Button to open modal for creating a new task */}
          <button
            onClick={() => {
              setSelectedTask({
                id: 0, // Temporary ID, will be replaced by backend
                projectId: project.id,
                title: '',
                description: '',
                status: 'todo', // Default to "To Do" column
                assignedUser: { id: 0, username: '', password: '' },
                createdBy: { id: currentUser.id, username: currentUser.username, password: '' },
                createdDate: "",
                modifiedDate: "",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Add Task
          </button>
        </div>
      </div>
      {/* Modal for creating/editing/deleting a task */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        users={project.users ?? []}
      />
    </div>
  );
};

export default Kanban;