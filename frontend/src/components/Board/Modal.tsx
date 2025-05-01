import React, { useState } from 'react';
import { Task } from '../../types/Task';
import { User } from '../../types/User';
import edit from '../../assets/icons/edit.png'; // Edit icon SVG
import closeIcon from '../../assets/icons/remove.png'; // Close icon SVG
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
  const [isDeleting, setIsDeleting] = useState(false); // State to track deleting status

  // Update editable task and set edit mode when the modal opens with a new task
  React.useEffect(() => {
    setEditableTask(task);
    if (task && task.id === 0) {
      setIsEditMode(true); // Automatically enter edit mode for new tasks
    } else {
      setIsEditMode(false); // Default to view mode for existing tasks
    }
  }, [task]);

  if (!isOpen || !editableTask) return null;

  const handleSave = async () => {
    if (editableTask) {
      try {
        setIsSaving(true); // Set saving state
        onSave(editableTask); // Update the task in the parent state
        setIsEditMode(false); // Exit edit mode
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update the task. Please try again.');
      } finally {
        setIsSaving(false); // Reset saving state
      }
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = Number(event.target.value);
    const selectedUser = users.find((user) => user.id === selectedUserId);
    if (selectedUser) {
      setEditableTask({ ...editableTask, assignedUser: selectedUser });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-700 text-white rounded-2xl shadow-xl w-[48rem] max-w-full p-8 relative">
        {/* Top Icons */}
        <div className="absolute top-4 left-4 flex items-center space-x-4 w-8 h-8 invert" >
          <button
            onClick={() => setIsEditMode(true)}
            className="hover:text-blue-400 transition"
            title="Edit Task"
          >
            <img src={edit} alt="Edit" className="w-8 h-8" />
          </button>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="hover:text-gray-400 transition"
            title="Close Modal"
          >
            <img src={closeIcon} alt="Close" className="w-8 h-8" />
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Task Details</h2>

        <div className="space-y-6">
          {isEditMode ? (
            <>
              {/* Title */}
              <div className="relative z-0 w-full group mb-5">
                <input
                  type="text"
                  value={editableTask.title}
                  onChange={(e) => setEditableTask({ ...editableTask, title: e.target.value })}
                  className="block py-3 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="title"
                  className="peer-focus:font-medium absolute text-base text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>

              {/* Description */}
              <div className="relative z-0 w-full group mb-5">
                <textarea
                  value={editableTask.description}
                  onChange={(e) => setEditableTask({ ...editableTask, description: e.target.value })}
                  className="block py-3 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="description"
                  className="peer-focus:font-medium absolute text-base text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Description
                </label>
              </div>

              {/* Status */}
              <div className="relative z-0 w-full group mb-5">
                <select
                  value={editableTask.status}
                  onChange={(e) => setEditableTask({ ...editableTask, status: e.target.value })}
                  className="block py-3 px-0 w-full text-base bg-transparent text-gray-900 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  required
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <label
                  htmlFor="status"
                  className="peer-focus:font-medium absolute text-base text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Status
                </label>
              </div>

              {/* Assigned User */}
              <div className="relative z-0 w-full group mb-5">
                <select
                  value={editableTask.assignedUser?.id || ''}
                  onChange={handleUserChange}
                  className="block py-3 px-0 w-full text-base bg-transparent text-gray-900 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  required
                >
                  <option value="" disabled>
                    Select a user
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="assignedUser"
                  className="peer-focus:font-medium absolute text-base text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Assigned User
                </label>
              </div>
            </>
          ) : (
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-700 dark:border-gray-700">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-200 space-y-4">
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Title</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.title}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Description</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.description}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Status</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.status}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Assigned User</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.assignedUser?.username || 'Unassigned'}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Created By</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{editableTask.createdBy.username}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Created Date</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">{new Date(editableTask.createdDate).toLocaleString()}</p>
                </li>
                <li>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Modified Date</p>
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