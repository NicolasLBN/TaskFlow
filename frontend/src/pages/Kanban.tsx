import React, { useState, useEffect } from 'react';
import { createTask, getAllTasksByProjectId, updateTask } from '../services/api';
import {jwtDecode} from 'jwt-decode';
import Column from '../components/Board/Column';
import Modal from '../components/Board/Modal';
import { User } from '../types/User';
import { Task, toTaskDto } from '../types/Task';

interface DecodedToken {
  sub: string;
  username: string;
}

const Kanban: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [currentUser, setcurrentUser] = useState<User>({} as User);
  const [columns, setColumns] = useState({
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[],
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tokenValue = localStorage.getItem('authToken') || '';
  const decoded: DecodedToken = jwtDecode(tokenValue);
  const currentSessionUser: User = {
    id: Number(decoded.sub),
    username: decoded.username,
    password: '', // Le mot de passe n'est pas nécessaire ici
  } as User;

  useEffect(() => {
    const fetchTasks = async () => {

      setcurrentUser(currentSessionUser);

      try {
        const tasks = await getAllTasksByProjectId(projectId);
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
        // Set up periodic fetch
    const interval = setInterval(fetchTasks, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [projectId]);

  const handleDragStart = (event: React.DragEvent, task: Task, column: 'todo' | 'inProgress' | 'done') => {
    event.dataTransfer.setData('task', JSON.stringify(task));
    event.dataTransfer.setData('fromColumn', column);
  };

  const handleDrop = async (event: React.DragEvent, targetColumn: 'todo' | 'inProgress' | 'done') => {
    const task = JSON.parse(event.dataTransfer.getData('task')) as Task;
    const fromColumn = event.dataTransfer.getData('fromColumn') as 'todo' | 'inProgress' | 'done';

    if (fromColumn === targetColumn) return;

    setColumns((prevColumns) => {
      const updatedFromColumn = prevColumns[fromColumn].filter((t) => t.id !== task.id);
      const updatedTargetColumn = [...prevColumns[targetColumn], { ...task, status: targetColumn }];

      return {
        ...prevColumns,
        [fromColumn]: updatedFromColumn,
        [targetColumn]: updatedTargetColumn,
      };
    });

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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (task.id === 0) {
        const taskDto = toTaskDto(task);
        const newTask = await createTask(taskDto);
  
        // Ajouter la tâche localement
        setColumns({...columns, [task.status as keyof typeof columns]: [...columns[task.status as keyof typeof columns], task] })
        
      } else {
        const updatedTask = await updateTask(task.id, task);
  
        // Mettre à jour la tâche localement
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

  return (
    <div className="min-h-screen bg-[#3E3C3F]">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Kanban Board</h1>
        <div className="flex gap-4">
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
          <button
            onClick={() => {
              setSelectedTask({
                id: 0, // ID temporaire, sera remplacé par l'ID généré par le backend
                projectId: projectId,
                title: '',
                description: '',
                status: 'todo', // Par défaut, la tâche est dans la colonne "To Do"
                assignedUser: { id: 0, username: '', password: '' }, // Utilisateur par défaut
                createdBy: { id: currentUser.id, username: currentUser.username, password: '' }, // Utilisateur actuel
                createdDate: "",
                modifiedDate:"",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Add Task
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={selectedTask}
        onSave={handleSaveTask} // Pass handleSaveTask to the modal
      />
    </div>
  );
};

export default Kanban;