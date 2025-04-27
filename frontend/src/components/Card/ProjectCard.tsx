import React from 'react';
import { Project, User } from '../../services/api';

interface ProjectCardProps {
  project: Project;
  members: User[];
  onJoin?: (projectId: number) => void; // Callback for the "Join" button
  onLeave?: (projectId: number) => void; // Callback for the "Leave" button
  onGoToBoard?: () => void; // Callback for the "Go to Board" button
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, members, onJoin, onLeave, onGoToBoard }) => {
  return (
    <div className="bg-[#28242c] border border-gray-300 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-[#b6c2c4]">{project.name}</h3>
      <p className="text-sm text-[#b6c2c4]">{project.description}</p>
      
      <h4 className="mt-4 text-lg font-medium text-[#b6c2c4]">Team Members:</h4>
      <ul className="list-disc pl-5 text-sm text-[#b6c2c4]">
        {members.map((member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>

      {/* Conditional rendering of buttons */}
      {onJoin && (
        <button
          onClick={() => onJoin(project.id)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Join
        </button>
      )}
      {onLeave && (
        <button
          onClick={() => onLeave(project.id)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Leave
        </button>
      )}
      {onGoToBoard && (
        <button
          onClick={() => onGoToBoard()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Go to Board
        </button>
      )}
    </div>
  );
};

export default ProjectCard;
