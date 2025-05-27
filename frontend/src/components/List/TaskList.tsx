import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // Import default styles for React Virtualized
import { Task, UserTask } from '../../types/Task';
import TaskCard from '../Card/TaskCard';

interface TaskListProps {
  userTasks: UserTask[];
}

const TaskList: React.FC<TaskListProps> = ({ userTasks }) => {
  // Function to render each row using TaskCard
  const rowRenderer = ({
    key,      // Unique key for each row
    index,    // Index of the row
    style,    // Inline style for positioning
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
  }) => {
    const task = userTasks[index];
    return (
      <div key={key} style={style}>
        <TaskCard task={task} />
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
            rowCount={userTasks.length}
            rowHeight={100} // Adjust row height as needed for TaskCard
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default TaskList;