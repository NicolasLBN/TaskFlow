import React from 'react';
import { UserTask } from '../../types/Task';

interface TaskCardProps {
  task: UserTask & {
    difficulty?: string;
    assignedUser?: { username: string };
  };
  style?: React.CSSProperties;
}

/**
 * TaskCard component displaying ticket id, title, status, difficulty, and assigned user.
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, style }) => {

  const ticketId =
        (task.project?.slice(0, 2).toUpperCase() || 'XX') + '-' + task.id;

  // Render appropriate emoji based on task.status
  const renderStatus = () => {
    switch (task.status) {
      case 'inProgress':
        return <span className="inline-block text-yellow-500 font-semibold">In Progress</span>;
      case 'done':
        return <span className="inline-block text-green-500 font-semibold">Done</span>;
      case 'todo':
      default:
        return <span className="inline-block text-gray-400 font-semibold">To Do</span>;
    }
  };

  return (
    <div
      style={style}
      className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#28242c] rounded"
    >
      <div className="flex items-center justify-between">
        {/* Left: Ticket ID and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-green-700 text-xs text-white px-2 py-0.5 rounded">
              {ticketId}
            </span>
          </div>
          <span className="text-lg font-semibold">{task.title}</span>
        </div>
        {/* Right: Status, Difficulty, Assigned User */}
        <div className="flex items-center gap-4">
          <span>{renderStatus()}</span>
          {task.difficulty && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
              {task.difficulty}
            </span>
          )}
          {task.assignedUser && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded">
              {task.assignedUser.username}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;