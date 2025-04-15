import axios from "axios";
import { Task, TaskFilters } from "./types";

const baseURL = import.meta.env.VITE_TODO_URL;
const aiURL = import.meta.env.VITE_AI_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const response = await axios.get(`${baseURL}/api/auth/tasks`, { params: filters });

  console.log('Raw API Response:', response.data); 

  return response.data.tasks; 
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const { data } = await axios.post<Task>(`${baseURL}/tasks`, task, {
    headers: getAuthHeader(),
  });
  return data;
};

export const updateTask = async (
  id: string,
  task: Partial<Task>
): Promise<Task> => {
  const { data } = await axios.put<Task>(`${baseURL}/tasks/${id}`, task, {
    headers: getAuthHeader(),
  });
  return data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const { data } = await axios.delete<{ message: string }>(
    `${baseURL}/tasks/${id}`,
    {
      headers: getAuthHeader(),
    }
  );
  return data;
};

export const suggestTasks = async (input: string): Promise<Task[]> => {
  const { data } = await axios.post<Task[]>(
    `${aiURL}/ai/suggest`,
    { input },
    {
      headers: getAuthHeader(),
    }
  );
  return data;
};

export const getWeeklySummary = async (): Promise<string> => {
  const { data } = await axios.get<string>(`${aiURL}/ai/summary`, {
    headers: getAuthHeader(),
  });
  return data;
};
