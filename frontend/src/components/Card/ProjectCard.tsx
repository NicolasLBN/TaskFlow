import React, { useState } from 'react';
import { Project } from '../../types/Project';
import { User } from '../../types/User';

interface ProjectCardProps {
  project: Project;
  members: User[];
  onJoin?: (projectId: number) => void;
  onLeave?: (projectId: number) => void;
  onGoToBoard?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, members, onJoin, onLeave, onGoToBoard }) => {
    const [showMembers, setShowMembers] = useState(false);

    // Compter les tickets selon le status
    const tickets = project.tasks ?? [];
    const openTickets = tickets.filter(
      (t: any) => t.status === 'todo' || t.status === 'inProgress'
    ).length;
    const doneTickets = tickets.filter((t: any) => t.status === 'done').length;

    return (
      <div className="relative flex bg-[#23272f] border border-gray-700 rounded-lg shadow-md overflow-hidden min-h-[180px]">
        {/* Bandeau coloré à gauche */}
        <div className="w-2 bg-blue-800 absolute left-0 top-0 bottom-0" />
        {/* Contenu principal */}
        <div className="flex-1 pl-6 pr-4 py-4 flex flex-col justify-between">
          {/* Header avec logo et titre */}
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded bg-blue-900 flex items-center justify-center text-2xl text-white mr-3">
              🐨
            </div>
            <div>
              <div className="text-lg font-semibold text-[#b6c2c4]">{project.name}</div>
              <div className="text-sm text-[#b6c2c4]">{project.description}</div>
            </div>
          </div>
          {/* Liens rapides */}
          <div className="mb-2">
            <div className="text-sm text-gray-400 mb-1">Liens rapides</div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 transition">
                Mes tickets ouverts
                <span className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-full text-xs">
                  {openTickets}
                </span>
              </button>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 transition">
                Tickets terminés
                <span className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-full text-xs">
                  {doneTickets}
                </span>
              </button>
            </div>
          </div>
          {/* Collaborateurs */}
          <div className="border-t border-gray-700 pt-2 mt-2 flex items-center justify-between">
            {onJoin && (
              <button
                onClick={() => onJoin(project.id)}
                className="px-2 py-0.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs ml-2"
              >
                Join
              </button>
            )}
            {onLeave && (
              <button
                onClick={() => onLeave(project.id)}
                className="px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs ml-2"
              >
                Leave
              </button>
            )}
            {onGoToBoard && (
              <button
                onClick={() => onGoToBoard()}
                className="px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs ml-2"
              >
                Board
              </button>
            )}
          </div>
        </div>
        {/* Liste des membres */}
        {showMembers && (
          <div className="mt-2 bg-[#23272f] rounded p-2 border border-gray-700">
            <ul className="text-sm text-gray-300">
              {members.map((member) => (
                <li key={member.id} className="py-0.5">{member.username}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

export default ProjectCard;