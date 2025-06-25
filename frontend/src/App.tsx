import React, { useState, useEffect } from 'react';
import './App.css';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus, User } from 'lucide-react';
import { KanbanColumn } from './components/KanbanColumn';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ProfileModal } from './components/ProfileModal';
import { taskApi } from './services/api';
import { Task, Column, TaskStatus, CreateTaskRequest, UpdateTaskRequest, Profile } from './types';

const App: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [profile, setProfile] = useState<Profile>({ name: 'K7', profilePicture: null });
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = async () => {
    try {
      const tasks = await taskApi.getTasks();
      const groupedTasks = groupTasksByStatus(tasks);
      setColumns(groupedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const userProfile = await taskApi.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const groupTasksByStatus = (tasks: Task[]): Column[] => {
    const statusTitles: { [key in TaskStatus]: string } = {
      TODO: 'TODO',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      BLOCKED: 'Blocked',
    };

    const columns = Object.keys(statusTitles).map(status => ({
      id: status,
      title: statusTitles[status as TaskStatus],
      status: status as TaskStatus,
      tasks: [] as Task[],
    }));

    tasks.forEach(task => {
      const column = columns.find(col => col.status === task.status);
      if (column) column.tasks.push(task);
    });

    return columns;
  };

  const handleAddTask = async (taskData: CreateTaskRequest) => {
    try {
      await taskApi.createTask(taskData);
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleEditTask = async (taskId: string, updates: UpdateTaskRequest) => {
    try {
      await taskApi.updateTask(taskId, updates);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(destColumn.tasks);
    destTasks.splice(destination.index, 0, movedTask);

    // Update the columns
    setColumns(columns.map(col => {
      if (col.id === sourceColumn.id) {
        return { ...col, tasks: sourceTasks };
      } else if (col.id === destColumn.id) {
        return { ...col, tasks: destTasks };
      } else {
        return col;
      }
    }));

    // Update task status if changed
    if (sourceColumn.id !== destColumn.id) {
      taskApi.updateTaskStatus(movedTask.id, destColumn.status);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">K7's Kanban</h1>
          <div className="header-actions">
            <div className="profile-info" onClick={() => setProfileModalOpen(true)}>
              {profile.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile" 
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <span className="profile-name">{profile.name}</span>
            </div>
            <button className="add-task-btn" onClick={() => setAddModalOpen(true)}>
              <Plus /> Add Task
            </button>
          </div>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks}
              onEditTask={task => setTaskToEdit(task)}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddTask} />

      {taskToEdit && (
        <EditTaskModal
          isOpen={Boolean(taskToEdit)}
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSave={handleEditTask}
        />
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdate={setProfile}
      />
    </div>
  );
};

export default App;
