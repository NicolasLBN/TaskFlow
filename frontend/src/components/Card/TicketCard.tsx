import React from 'react';
import userIcon from '../../assets/icons/user.svg';
import { UserTask } from '../../types/Task';

interface TicketCardProps {
    task: UserTask & { service?: string; assignees?: any[] };
    onDragStart: (event: React.DragEvent, task: any) => void;
    onTaskClick: (task: any) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
    task,
    onDragStart,
    onTaskClick,
}) => {
    const ticketId =
        (task.project?.slice(0, 2).toUpperCase() || 'XX') + '-' + task.id;

    return (
        <div
            key={task.id}
            draggable
            onDragStart={(event) => onDragStart(event, task)}
            onClick={() => onTaskClick(task)}
            className="p-2 mb-2 border border-gray-300 rounded-md bg-[#3E3C3F] cursor-pointer"
        >
            <div className="text-sm text-gray-100 mb-1">{task.title}</div>
            {task.description && (
                <div className="text-xs text-gray-400 mb-1">{task.description}</div>
            )}
            <div className="flex items-center gap-2 mb-1">
                {task.service && (
                    <span className="bg-purple-700 text-xs text-white px-2 py-0.5 rounded font-semibold">
                        {task.service}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <span className="bg-green-700 text-xs text-white px-2 py-0.5 rounded">
                        {ticketId}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <span>{task.assignees?.length || 0}</span>
                    <img src={userIcon} alt="user" className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export default TicketCard;