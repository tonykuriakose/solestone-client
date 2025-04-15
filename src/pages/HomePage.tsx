import React, { useEffect, useState } from 'react';
import { Task, TaskFilters, TaskStatus } from '../types';
import { fetchTasks, createTask } from '../api';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(filters);
        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    loadTasks();
  }, [filters]);

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      const newTask = {
        title,
        status: TaskStatus.PENDING,
        priority,
      };

      const created = await createTask(newTask);
      setTasks((prev) => [...prev, created]);
      setTitle('');
      setPriority('Medium');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Tasks</h2>

      {/* Task Creation Form */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Add Task</h3>
        <input
          type="text"
          placeholder="Enter task title"
          className="border px-3 py-2 rounded w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-2"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border p-4 mb-2 rounded shadow-sm bg-white"
          >
            <h3 className="font-semibold">{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>
              Due:{' '}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : 'No due date'}
            </p>
            <p>
              {task.status === TaskStatus.DONE
                ? '✔️ Completed'
                : '❌ Incomplete'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
