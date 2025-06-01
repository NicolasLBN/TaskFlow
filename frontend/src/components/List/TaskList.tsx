import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // Import default styles for React Virtualized
import { UserTask } from '../../types/Task';
import TaskCard from '../Card/TaskCard';
import './TaskList.css'; // Import custom styles for TaskList

interface TaskListProps {
  userTasks: UserTask[];
}

const TaskList: React.FC<TaskListProps> = ({ userTasks }) => {
  const rowRenderer = ({
    key,
    index,
    style,
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
    <div className="custom-scrollbar" style={{ height: '400px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            width={width}
            height={height}
            rowCount={userTasks.length}
            rowHeight={65}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default TaskList;