import useModalTask, { ModalProps } from "../../hooks/useModalTask";
import ActionButton from "../../utils/ActionButton";

/**
 * Modal component for creating or editing a task.
 * Uses the custom useModalTask hook to manage local state and handlers.
 *
 * @param {ModalProps} props - Modal properties including task, users, and callbacks.
 * @returns {JSX.Element | null} The modal dialog for task editing/creation.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave, onDelete, users }) => {
  // Custom hook to manage modal state and logic
  const {
    editableTask,
    setEditableTask,
    editField,
    setEditField,
    handleSave,
    renderField,
  } = useModalTask(task, onSave, onClose);

  // Do not render modal if not open or no task is selected
  if (!isOpen || !editableTask) return null;

  const isNew = editableTask.id === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#282e33] text-white rounded-md shadow-2xl w-full max-w-2xl p-8 relative border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isNew ? 'Create a ticket' : editableTask.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Task Form */}
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {/* Title field (only for new task) */}
          {isNew && (
            <div>
              <label className="block text-base font-semibold mb-1">Title *</label>
              {renderField('title', editableTask.title, 'input')}
              {!editableTask.title && (
                <span className="text-xs text-red-400">Summary is required</span>
              )}
            </div>
          )}

          {/* Title field (inline edit for update) */}
          {!isNew && (
            <div>
              <label className="block text-base font-semibold mb-1">Title</label>
              {renderField('title', editableTask.title, 'input')}
            </div>
          )}

          {/* Status field */}
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

          {/* Description field */}
          <div>
            <label className="block text-base font-semibold mb-1">Description</label>
            {renderField('description', editableTask.description, 'textarea')}
          </div>

          {/* Assigned user field */}
          <div>
            <label className="block text-base font-semibold mb-1">Assigned to</label>
            {isNew || editField === 'assignedUser' ? (
              <div className="relative">
                <select
                  className="w-full bg-[#23272f] border border-gray-600 rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 mr-2 appearance-none"
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
                {/* Custom chevron absolutely positioned to the right */}
                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>
            ) : (
              <div
                className="cursor-pointer text-gray-300 px-3 py-2 rounded hover:bg-gray-700"
                onClick={() => setEditField('assignedUser')}
              >
                {editableTask.assignedUser?.username || <span className="text-gray-500">Click to edit</span>}
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
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