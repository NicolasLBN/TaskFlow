import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/Task';
import { User } from '../types/User';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  users: User[];
}

/**
 * Custom hook to manage the state and handlers for the Modal component.
 *
 * @param {Task | null} task - The task to edit or create.
 * @returns {{
 *   editableTask: Task | null,
 *   setEditableTask: React.Dispatch<React.SetStateAction<Task | null>>,
 *   isEditMode: boolean,
 *   setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>,
 *   isSaving: boolean,
 *   setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
 *   editField: string | null,
 *   setEditField: React.Dispatch<React.SetStateAction<string | null>>,
 *   handleSave: () => Promise<void>,
 *   renderField: (
 *     field: string,
 *     value: any,
 *     inputType: 'input' | 'textarea' | 'select',
 *     options?: any[]
 *   ) => React.ReactNode
 * }}
 */
function useModalTask(task: Task | null, onSave: (updatedTask: Task) => void, onClose: () => void) {
  // State for the editable task (local copy)
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTask, setEditableTask] = useState<Task | null>(task);
  const [isSaving, setIsSaving] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);

  // Sync local editableTask state with the incoming task prop
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

  // Determine if the modal is in "create" mode
  const isNew = editableTask?.id === 0;

  /**
   * Handler to save the task (calls onSave and closes the modal).
   */
  const handleSave = useCallback(async () => {
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
  }, [editableTask, onSave, onClose]);

  /**
   * Renders a field as input, textarea, or select, or as a clickable div for inline editing.
   */
  const renderField = useCallback(
    (
      field: string,
      value: any,
      inputType: 'input' | 'textarea' | 'select',
      options?: any[]
    ) => {
      // Edit mode: show input, textarea, or select
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
            <div className="relative">
              <select
                className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 mr-2 appearance-none"
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
              {/* Custom chevron absolutely positioned to the right */}
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
              </span>
            </div>
          );
        }
      }
      // View mode: show value as clickable div for inline editing
      return (
        <div
          className={`cursor-pointer text-gray-300 px-3 py-2 rounded hover:bg-gray-700${field === 'description' ? ' italic text-gray-400' : ''}`}
          onClick={() => setEditField(field)}
        >
          {value || <span className="text-gray-500">Cliquez pour éditer</span>}
        </div>
      );
    },
    [isNew, editField]
  );

  return {
    editableTask,
    setEditableTask,
    isEditMode,
    setIsEditMode,
    isSaving,
    setIsSaving,
    editField,
    setEditField,
    handleSave,
    renderField,
  };
}

export default useModalTask;