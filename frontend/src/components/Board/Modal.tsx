import React, { useState } from 'react';
import { updateTask } from '../../services/api'; // Import the updateTask API function
import { Task } from '../../types/Task';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null; // Task to display in the modal
  onSave: (updatedTask: Task) => void; // Callback to save the updated task in the state
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode
  const [editableTask, setEditableTask] = useState<Task | null>(task); // State for editable task
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  // Update editable task when the modal opens with a new task
  React.useEffect(() => {
    setEditableTask(task);
  }, [task]);

  if (!isOpen || !editableTask) return null;

  const handleSave = async () => {
    if (editableTask) {
      try {
        setIsSaving(true); // Set saving state
        const updatedTask = await updateTask(editableTask.id, {
          title: editableTask.title,
          description: editableTask.description,
          status: editableTask.status,
        }); // Call the API to update the task
        onSave(updatedTask); // Update the task in the parent state
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <div className="space-y-2">
          {isEditMode ? (
            <>
              <div>
                <label className="block font-semibold">Title:</label>
                <input
                  type="text"
                  value={editableTask.title}
                  onChange={(e) => setEditableTask({ ...editableTask, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-semibold">Description:</label>
                <textarea
                  value={editableTask.description}
                  onChange={(e) => setEditableTask({ ...editableTask, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-semibold">Status:</label>
                <select
                  value={editableTask.status}
                  onChange={(e) => setEditableTask({ ...editableTask, status: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Title:</strong> {editableTask.title}
              </p>
              <p>
                <strong>Description:</strong> {editableTask.description}
              </p>
              <p>
                <strong>Status:</strong> {editableTask.status || 'N/A'}
              </p>
              <p>
                <strong>Assigned User:</strong> {editableTask.assignedUser.username}
              </p>
              <p>
                <strong>Created By:</strong> {editableTask.createdBy.username}
              </p>
              <p>
                <strong>Created Date:</strong> {new Date(editableTask.createdDate).toLocaleString()}
              </p>
              <p>
                <strong>Modified Date:</strong> {new Date(editableTask.modifiedDate).toLocaleString()}
              </p>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`${
                  isSaving ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded transition`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;