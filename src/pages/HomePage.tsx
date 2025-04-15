import React, { useEffect, useState } from 'react';
import {Button,Container,TextField,Typography,MenuItem,Paper,Stack,} from '@mui/material';
import {Task,TaskFilters,TaskPriority,TaskStatus,} from '../types'; 
import { fetchTasks,createTask } from '../api'; 
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [search, setSearch] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    tags: '',
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetched = await fetchTasks(filters);
        if (Array.isArray(fetched)) {
          setTasks(fetched);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    loadTasks();
  }, [filters]);


  const handleAddTask = async () => {
    console.log("handle task");
    
    if (!newTask.title.trim()) return;
  
    const task: Partial<Task> = {
      title: newTask.title,
      description: newTask.description || '',
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined, 
      status: newTask.status,
      priority: newTask.priority,
      tags: newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [],
    };
  
    try {
      const savedTask = await createTask(task); 
      console.log(savedTask);
      
      setTasks(prev => [savedTask, ...prev]); 
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      tags: '',
    });
  };
  
  

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Tasks
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Add New Task</Typography>
        <Stack spacing={2} mt={2}>
          <TextField
            label="Title"
            fullWidth
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <TextField
            label="Priority"
            select
            value={newTask.priority}
            onChange={e =>
              setNewTask({ ...newTask, priority: e.target.value as TaskPriority })
            }
          >
            {Object.values(TaskPriority).map(p => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Status"
            select
            value={newTask.status}
            onChange={e =>
              setNewTask({ ...newTask, status: e.target.value as TaskStatus })
            }
          >
            {Object.values(TaskStatus).map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tags (comma separated)"
            fullWidth
            value={newTask.tags}
            onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddTask}>
            Add Task
          </Button>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Search by title"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setFilters(prev => ({ ...prev, search: e.target.value }));
          }}
        />
        <TextField
          select
          label="Filter by Status"
          value={filters.status || ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              status: e.target.value as TaskStatus,
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(TaskStatus).map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Priority"
          value={filters.priority || ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              priority: e.target.value as TaskPriority,
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(TaskPriority).map(priority => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        tasks.map(task => (
          <Paper key={task.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Typography>Status: {task.status}</Typography>
            <Typography>Priority: {task.priority}</Typography>
            <Typography>
              Due Date:{' '}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : 'Not set'}
            </Typography>
            <Typography>Tags: {task.tags.join(', ')}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'gray' }}>
              Created: {new Date(task.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default HomePage;
