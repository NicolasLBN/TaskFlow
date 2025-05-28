import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option: string) => {
    console.log(`Checkbox changed for option: ${option}`);
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  // Fermeture du dropdown lorsque l'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="rounded px-3 py-2 text-grey-800 cursor-pointer hover:bg-gray-500/50 flex items-center justify-between w-full"
      >
        <span>{label ? label : "Select..."}</span>
        <span className="ml-2 text-gray-500">&#x25BC;</span>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-56 bg-[#28242c] rounded shadow-lg z-10">
          {options.map(option => (
            <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-200/50 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;