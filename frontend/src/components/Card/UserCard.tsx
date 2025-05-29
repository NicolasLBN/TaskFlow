import React from 'react';

interface UserCardProps {
    username: string;
    subtitle?: string;
    time?: string;
}

const COLORS = [
    'bg-blue-900',
    'bg-green-700',
    'bg-purple-800',
    'bg-pink-700',
    'bg-yellow-700',
    'bg-red-800',
    'bg-indigo-800',
];

function getColorClass(letter: string) {
    const index = (letter.charCodeAt(0) - 65) % COLORS.length;
    return COLORS[Math.abs(index)];
}

const UserCard: React.FC<UserCardProps> = ({ username, subtitle, time }) => {
    const firstLetter = username ? username.trim()[0].toUpperCase() : '?';
    const colorClass = getColorClass(firstLetter);

    return (
        <div className="rounded-xl border border-gray-700 bg-[#23272f] p-6 flex flex-col items-center w-50 shadow-md hover:shadow-lg hover:scale-105 transition duration-200">
            <div className={`w-32 h-32 flex items-center justify-center rounded-full ${colorClass} mb-4`}>
                <span className="text-5xl font-bold text-white">{firstLetter}</span>
            </div>
            <div className="text-lg font-semibold text-gray-100">{username}</div>
            {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
            {time && <div className="text-sm text-gray-400">{time}</div>}
        </div>
    );
};

export default UserCard;