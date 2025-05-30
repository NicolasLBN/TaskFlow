import React from 'react';

type ActionButtonProps ={
  text: string;
  color?: string; // ex: "bg-blue-500", "bg-green-500"
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  color = "bg-blue-500",
  onClick,
  className = "",
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`${color} text-white px-4 py-2 rounded hover:brightness-110 transition ${className}`}
  >
    {text}
  </button>
);

export default ActionButton;