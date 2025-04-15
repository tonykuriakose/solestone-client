import axios from 'axios';
import { Task, TaskFilters } from '../types/types';
const TODO_URL = import.meta.env.VITE_TODO_URL;

export const fetchTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const params: any = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;

  const response = await axios.get<{ tasks: Task[] }>(`${TODO_URL}/api/auth/tasks`, { params });
  return response.data.tasks;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await axios.post<{ task: Task }>(`${TODO_URL}/api/auth/tasks`, task);
  return response.data.task;
};

