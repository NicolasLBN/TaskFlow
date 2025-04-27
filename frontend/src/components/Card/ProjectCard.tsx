import React from 'react';
import { Project, User } from '../../services/api';

interface ProjectCardProps {
  project: Project;
  members: User[];
  onJoin?: (projectId: number) => void; // Callback pour le bouton "Join"
  onLeave?: (projectId: number) => void; // Callback pour le bouton "Leave"
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, members, onJoin, onLeave }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px', borderRadius: '8px' }}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <h4>Team Members:</h4>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>
      {onJoin && (
        <button
          onClick={() => onJoin(project.id)}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Join
        </button>
      )}
      {onLeave && (
        <button
          onClick={() => onLeave(project.id)}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default ProjectCard;