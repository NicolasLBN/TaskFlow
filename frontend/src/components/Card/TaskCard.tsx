import React from 'react';
import { UserTask } from '../../types/Task';

interface TaskCardProps {
  task: UserTask;
  style?: React.CSSProperties;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, style }) => {
  // Render appropriate emoji based on task.status
  const renderStatusIcon = () => {
    switch (task.status) {
      case 'inProgress':
        return <span className="inline-block mr-1 text-2xl">🪴</span>;
      case 'done':
        return <span className="inline-block mr-1 text-2xl">🌳</span>;
      case 'todo':
      default:
        return <span className="inline-block mr-1 text-2xl">🌱</span>;
    }
  };

  return (
    <div style={style} className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#28242c]">
      {/* Header row: Title on left and creation date on the far right */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{task.title} ({task.project})</h3>
        <span className="text-sm text-gray-500">
          {task.createdDate}
        </span>
      </div>
      {/* Content row with description and status icon */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
        <p className="text-gray-500 flex items-center">
          {renderStatusIcon()}
        </p>
      </div>
      <div className="border-t border-gray-500 mt-4"></div>
    </div>
  );
};

export default TaskCard;