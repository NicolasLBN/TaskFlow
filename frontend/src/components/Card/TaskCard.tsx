import React from 'react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  assignedPerson: string;
  createdDate: string;
  modifiedDate: string;
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({
  id,
  title,
  description,
  assignedPerson,
  createdDate,
  modifiedDate,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-md">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-2 text-gray-600">{description}</p>
      <p className="mb-2">
        <strong>Assigned to:</strong> {assignedPerson}
      </p>
      <p className="mb-2">
        <strong>Created:</strong> {new Date(createdDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Last Modified:</strong> {new Date(modifiedDate).toLocaleDateString()}
      </p>
    </div>
  );
});

export default TaskCard;