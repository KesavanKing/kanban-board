import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <div className="task-title">{task.title}</div>
          
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          
          <div className="task-meta">
            <span className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            
            <div className="task-date">
              <Clock size={12} />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>
          
          <div className="task-actions">
            <button
              className="task-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit task"
            >
              <Edit2 size={14} />
            </button>
            
            <button
              className="task-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
