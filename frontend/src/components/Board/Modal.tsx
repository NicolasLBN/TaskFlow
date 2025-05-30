import React, { useState, useEffect } from 'react';
import { Task } from '../../types/Task';
import { User } from '../../types/User';
import ActionButton from '../../utils/ActionButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  users: User[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave, onDelete, users }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTask, setEditableTask] = useState<Task | null>(task);
  const [isSaving, setIsSaving] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setEditableTask({
        ...task,
        assignedUser: task.assignedUser ?? null,
        createdBy: task.createdBy ?? null,
      });
      setIsEditMode(task.id === 0);
      setEditField(null);
    }
  }, [task]);

  if (!isOpen || !editableTask) return null;

  const isNew = editableTask.id === 0;

  const handleSave = async () => {
    if (editableTask) {
      try {
        setIsSaving(true);
        onSave(editableTask);
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

  // Helper to render a field in view or edit mode
  const renderField = (
    field: string,
    value: any,
    inputType: 'input' | 'textarea' | 'select',
    options?: any[]
  ) => {
    if (isNew || editField === field) {
      if (inputType === 'input') {
        return (
          <input
            type="text"
            className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 mr-2"
            value={value}
            onChange={e =>
              setEditableTask(prev => prev ? { ...prev, [field]: e.target.value } : null)
            }
            onBlur={() => setEditField(null)}
            autoFocus={editField === field}
            required={field === 'title'}
          />
        );
      }
      if (inputType === 'textarea') {
        return (
          <textarea
            className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 min-h-[80px] italic mr-2"
            value={value}
            onChange={e =>
              setEditableTask(prev => prev ? { ...prev, [field]: e.target.value } : null)
            }
            onBlur={() => setEditField(null)}
            autoFocus={editField === field}
          />
        );
      }
      if (inputType === 'select' && options) {
        return (
          <select
            className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 mr-2"
            value={value}
            onChange={e =>
              setEditableTask(prev => prev ? { ...prev, [field]: e.target.value } : null)
            }
            onBlur={() => setEditField(null)}
            autoFocus={editField === field}
          >
            {options.map((opt: any) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        );
      }
    }
    // View mode
    return (
      <div
        className={`cursor-pointer text-gray-300 px-3 py-2 rounded hover:bg-gray-700${field === 'description' ? ' italic text-gray-400' : ''}`}
        onClick={() => setEditField(field)}
      >
        {value || <span className="text-gray-500">Cliquez pour éditer</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#282e33] text-white rounded-md shadow-2xl w-full max-w-2xl p-8 relative border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isNew ? 'Créer un ticket' : editableTask.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
            title="Fermer"
          >
            &times;
          </button>
        </div>

        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {isNew && (
            <div>
              <label className="block text-base font-semibold mb-1">Titre *</label>
              {renderField('title', editableTask.title, 'input')}
              {!editableTask.title && (
                <span className="text-xs text-red-400">Résumé doit être renseigné</span>
              )}
            </div>
          )}

          {!isNew && (
            <div>
              <label className="block text-base font-semibold mb-1">Titre</label>
              {renderField('title', editableTask.title, 'input')}
            </div>
          )}

          <div>
            <label className="block text-base font-semibold mb-1">State</label>
            {renderField(
              'status',
              editableTask.status,
              'select',
              [
                { value: 'todo', label: 'To Do' },
                { value: 'inProgress', label: 'In Progress' },
                { value: 'done', label: 'Done' }
              ]
            )}
          </div>

          <div>
            <label className="block text-base font-semibold mb-1">Description</label>
            {renderField('description', editableTask.description, 'textarea')}
          </div>

          <div>
            <label className="block text-base font-semibold mb-1">Assigned to</label>
            {isNew || editField === 'assignedUser' ? (
              <select
                className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 mr-2"
                value={editableTask.assignedUser?.id ?? ''}
                onChange={e => {
                  const selectedUserId = Number(e.target.value);
                  const selectedUser = users.find((user) => user.id === selectedUserId);
                  if (selectedUser) {
                    setEditableTask(prev =>
                      prev ? { ...prev, assignedUser: selectedUser } : null
                    );
                  }
                }}
                onBlur={() => setEditField(null)}
                autoFocus={editField === 'assignedUser'}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="cursor-pointer text-gray-300 px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setEditField('assignedUser')}
              >
                {editableTask.assignedUser?.username || <span className="text-gray-500">Cliquez pour éditer</span>}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-8">
          <ActionButton
            text="Cancel"
            color="bg-gray-700 hover:bg-gray-600"
            onClick={onClose}
            className="px-6 py-2 rounded-lg"
          />
          <ActionButton
            text={isNew ? 'Create' : 'Save'}
            color="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-semibold"
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;