import React, { useEffect, useState } from 'react';
import { Task, TaskFilters, TaskStatus } from '../types';
import { fetchTasks } from '../api';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(filters);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    loadTasks();
  }, [filters]);

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Tasks</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-4 mb-2 rounded shadow-sm bg-white"
        >
          <h3 className="font-semibold">{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
          <p>{task.status === TaskStatus.DONE ? '✔️ Completed' : '❌ Incomplete'}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
