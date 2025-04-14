import axios from 'axios';

interface Task {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  completed?: boolean;
}

interface Filters {
  [key: string]: any;
}

export const fetchTasks = async (filters: Filters): Promise<Task[]> => {
  const { data } = await axios.get<Task[]>(
    `${import.meta.env.VITE_TODO_SERVICE_URL}/tasks`,
    {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return data;
};

export const createTask = async (task: Task): Promise<Task> => {
  const { data } = await axios.post<Task>(
    `${import.meta.env.VITE_TODO_SERVICE_URL}/tasks`,
    task,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const { data } = await axios.put<Task>(
    `${import.meta.env.VITE_TODO_SERVICE_URL}/tasks/${id}`,
    task,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const { data } = await axios.delete<{ message: string }>(
    `${import.meta.env.VITE_TODO_SERVICE_URL}/tasks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return data;
};

export const suggestTasks = async (input: string): Promise<Task[]> => {
  const { data } = await axios.post<Task[]>(
    `${import.meta.env.VITE_AI_SERVICE_URL}/ai/suggest`,
    { input },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return data;
};


export const getWeeklySummary = async (): Promise<string> => {
  const { data } = await axios.get<string>(
    `${import.meta.env.VITE_AI_SERVICE_URL}/ai/summary`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return data;
};
