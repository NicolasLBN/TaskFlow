import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // Import des styles par défaut de React Virtualized
import { Task } from '../../types/Task';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  // Fonction pour rendre chaque ligne (tâche)
  const rowRenderer = ({
    key, // Clé unique pour chaque ligne
    index, // Index de la ligne
    style, // Style pour positionner la ligne
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
  }) => {
    const task = tasks[index];
    return (
      <div key={key} style={style} className="p-4 border-b border-gray-300 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
      </div>
    );
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            width={width}
            height={height}
            rowCount={tasks.length}
            rowHeight={80} // Hauteur de chaque ligne
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default TaskList;