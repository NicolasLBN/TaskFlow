import React from 'react';
import { Link } from 'react-router-dom';
import Column from '../components/Board/Column';
import Modal from '../components/Board/Modal';
import { Project } from '../types/Project';
import { KanbanContext } from '../context/KanbanContext';
import ActionButton from '../utils/ActionButton';
import { useKanbanBoard } from '../hooks/useKanbanBoard';

const Kanban: React.FC<{ project: Project }> = ({ project }) => {
  const {
    currentUser,
    columns,
    setColumns,
    selectedTask,
    setSelectedTask,
    isModalOpen,
    setIsModalOpen,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleTaskClick,
    closeModal,
    handleSaveTask,
    handleDeleteTask,
  } = useKanbanBoard(project);

  return (
    <KanbanContext.Provider value={{
      currentUser,
      columns,
      setColumns,
      project,
      selectedTask,
      setSelectedTask,
      isModalOpen,
      setIsModalOpen,
    }}>
      <div className="min-h-screen bg-[#3E3C3F]">
        <div className="container mx-auto py-8">
          <div className="relative mb-8">
            <Link to="/home" className="absolute left-0 text-5xl font-bold hover:text-blue-400 transition">
              ←
            </Link>
            <h1 className="text-3xl font-bold text-center">{project.name}</h1>
          </div>
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
            <ActionButton
              text="+ Add Task"
              color="bg-blue-500"
              onClick={() => {
                setSelectedTask({
                  id: 0,
                  projectId: project.id,
                  title: '',
                  description: '',
                  status: 'todo',
                  assignedUser: { id: 0, username: '', password: '' },
                  createdBy: { id: currentUser.id, username: currentUser.username, password: '' },
                  createdDate: "",
                  modifiedDate: "",
                });
                setIsModalOpen(true);
              }}
              className="hover:bg-blue-600 transition"
            />
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          users={project.users ?? []}
        />
      </div>
    </KanbanContext.Provider>
  );
};

export default Kanban;