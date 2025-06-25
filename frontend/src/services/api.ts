import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, Profile, UpdateProfileRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  // Get task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Get user profile
  getProfile: async (): Promise<Profile> => {
    const response = await api.get<Profile>('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.put<Profile>('/profile', profileData);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
