import React from 'react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  assignedPerson: string;
  createdDate: string;
  modifiedDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  assignedPerson,
  createdDate,
  modifiedDate,
}) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ marginBottom: '8px' }}>{title}</h3>
      <p style={{ marginBottom: '8px', color: '#555' }}>{description}</p>
      <p style={{ marginBottom: '8px' }}>
        <strong>Assigned to:</strong> {assignedPerson}
      </p>
      <p style={{ marginBottom: '8px' }}>
        <strong>Created:</strong> {new Date(createdDate).toLocaleDateString()}
      </p>
      <p style={{ marginBottom: '8px' }}>
        <strong>Last Modified:</strong> {new Date(modifiedDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskCard;