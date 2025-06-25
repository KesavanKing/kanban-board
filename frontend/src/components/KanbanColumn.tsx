import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { Task } from '../types';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  columnId, 
  title, 
  tasks, 
  onEditTask, 
  onDeleteTask 
}) => {
  const getColumnClass = (title: string) => {
    return title.toLowerCase().replace(' ', '-');
  };
  
  return (
    <div className={`column ${getColumnClass(title)}`}>
      <div className="column-header">
        <div className="column-title">{title}</div>
        <div className="task-count">{tasks.length}</div>
      </div>
      
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`droppable-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
