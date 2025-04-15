import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTasks, createTask } from '../api/authApi'; 
import { Task, TaskFilters, TaskPriority, TaskStatus } from './types';

interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  addTask: (task: Partial<Task>) => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchTasks(filters);
      setTasks(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    load();
  }, [filters]);

  const addTask = async (task: Partial<Task>) => {
    const newTask = await createTask(task);
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <TaskContext.Provider value={{ tasks, filters, setFilters, addTask, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
