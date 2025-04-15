import axios from 'axios';
import { Task, TaskFilters } from '../contexts/types';

export const fetchTasks = async (filters: TaskFilters): Promise<Task[]> => {
  try {
    const params: Record<string, any> = {};

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;

    const response = await axios.get('/api/tasks', { params });
    return response.data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};
