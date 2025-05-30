import React, { useState } from 'react';
import { Task } from '../../types/Task';
import { User } from '../../types/User';
import edit from '../../assets/icons/edit.png'; // Edit icon SVG
import save from '../../assets/icons/save.png'; // Save icon SVG

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null; // Task to display in the modal
  onSave: (updatedTask: Task) => void; // Callback to save the updated task in the state
  onDelete: (taskId: number) => void; // Callback to delete the task in the parent state
  users: User[]; // List of users to assign the task
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave, onDelete, users }) => {
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode
  const [editableTask, setEditableTask] = useState<Task | null>(task); // State for editable task
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  // Update editable task and set edit mode when the modal opens with a new task
  React.useEffect(() => {
    if (task) {
      setEditableTask({
        ...task,
        assignedUser: task.assignedUser ?? null,
        createdBy: task.createdBy ?? null,
        // ...ajoute d'autres propriétés par défaut si besoin
      });
      setIsEditMode(task.id === 0);
    }
  }, [task]);

  if (!isOpen || !editableTask) return null;

  const handleSave = async () => {
    if (editableTask) {
      try {
        setIsSaving(true);
        // Transform assignedUser to assigned_user_id
        const taskToSave = {
          ...editableTask,
        };
        onSave(taskToSave);
        setIsEditMode(false);
        onClose();
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update the task. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = Number(event.target.value);
    const selectedUser = users.find((user) => user.id === selectedUserId);
    if (selectedUser) {
      setEditableTask(prev =>
        prev ? { ...prev, assignedUser: selectedUser } : null
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-700 text-white rounded-2xl shadow-xl w-[48rem] h-[44rem] max-w-full p-8 relative">
        {/* Top Icons */}
        {!isEditMode && <div className="absolute top-4 left-4 flex items-center space-x-4 w-8 h-8 invert" >
          <button
            onClick={() => setIsEditMode(true)}
            className="hover:text-blue-400 transition"
            title="Edit Task"
          >
            <img src={edit} alt="Edit" className="w-8 h-8" />
          </button>
        </div>}
        <div className="absolute top-4 right-4 flex items-center space-x-4 w-8 h-8">
          <button
            onClick={onClose}
            className="hover:text-gray-400 transition text-white text-5xl font-bold"
            title="Close Modal"
          >
            &times; {/* This represents the "X" symbol */}
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-center">Task Details</h2>

        <div className="space-y-6">
          {isEditMode ? (
            <>
              {/* Title */}
              <div className="relative z-0 w-full group mb-5">
                <input
                  type="text"
                  value={editableTask.title}
                  onChange={(e) => setEditableTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="block py-3 px-0 w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="title"
                  className="peer-focus:font-medium absolute text-lg text-gray-900 dark:text-white duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>

              {/* Description */}
              <div className="relative z-0 w-full group mb-5">
                <textarea
                  value={editableTask.description}
                  onChange={(e) => setEditableTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="block py-3 px-0 w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="description"
                  className="peer-focus:font-medium absolute text-lg text-gray-900 dark:text-white duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:peer-focus:-translate-y-6"
                >
                  Description
                </label>
              </div>

              {/* Status */}
              <div className="relative z-0 w-full group mb-5">
                <select
                  value={editableTask.status}
                  onChange={(e) => setEditableTask(prev => prev ? { ...prev, status: e.target.value } : null)}
                  className="block py-3 px-0 w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  required
                >
                  <option className="bg-gray-700 text-white" value="todo">To Do</option>
                  <option className="bg-gray-700 text-white" value="inProgress">In Progress</option>
                  <option className="bg-gray-700 text-white" value="done">Done</option>
                </select>
                <label
                  htmlFor="status"
                  className="peer-focus:font-medium absolute text-lg text-gray-900 dark:text-white duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus: peer-focus:-translate-y-6"
                >
                  Status
                </label>
              </div>

              {/* Assigned User */}
              <div className="relative z-0 w-full group mb-5">
                <select
                  value={editableTask.assignedUser?.id || ''}
                  onChange={handleUserChange}
                  className="block py-3 px-0 w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  required
                >
                  {users.map((user) => (
                    <option className="bg-gray-700 text-white" key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="assignedUser"
                  className="peer-focus:font-medium absolute text-lg text-gray-900 dark:text-white duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus: peer-focus:-translate-y-6"
                >
                  Assigned User
                </label>
              </div>
            </>
          ) : (
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-700 dark:border-gray-700">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-200 space-y-4">
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Title</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.title}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Description</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.description}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Status</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.status}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Assigned User</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.assignedUser?.username}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Created By</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.createdBy?.username}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Created Date</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{new Date(editableTask.createdDate).toLocaleString()}</p>
                </li>
                <li>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">Modified Date</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{new Date(editableTask.modifiedDate).toLocaleString()}</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          {isEditMode && (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-base transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-base transition flex items-center'
              >
                <img src={save} alt="Close" className="w-8 h-8 invert" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>

  );
};

export default Modal;