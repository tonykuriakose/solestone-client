import React, { useState } from 'react';
import {Button,Container,TextField,Typography,MenuItem,Paper,Stack} from '@mui/material';
import { useTasks } from '../contexts/TaskContext';
import { TaskPriority, TaskStatus } from '../types/types';

const HomePage: React.FC = () => {
  console.log("home page rendering");
  
  
  const { tasks, filters, setFilters, addTask, loading } = useTasks();
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    tags: ''
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await addTask({
      title: newTask.title,
      description: newTask.description || '',
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      status: newTask.status,
      priority: newTask.priority,
      tags: newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [],
    });
    setNewTask({ title: '', description: '', dueDate: '', priority: TaskPriority.MEDIUM, status: TaskStatus.TODO, tags: '' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Your Tasks</Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Add New Task</Typography>
        <Stack spacing={2} mt={2}>
          <TextField label="Title" fullWidth value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
          <TextField label="Description" multiline rows={3} fullWidth value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
          <TextField label="Due Date" type="date" InputLabelProps={{ shrink: true }} value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
          <TextField label="Priority" select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}>
            {Object.values(TaskPriority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <TextField label="Status" select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}>
            {Object.values(TaskStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Tags (comma separated)" fullWidth value={newTask.tags} onChange={e => setNewTask({ ...newTask, tags: e.target.value })} />
          <Button variant="contained" onClick={handleAddTask}>Add Task</Button>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField label="Search" value={search} onChange={e => {
          setSearch(e.target.value);
          setFilters(prev => ({ ...prev, search: e.target.value }));
        }} />
        <TextField label="Status" select value={filters.status || ''} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as TaskStatus }))}>
          <MenuItem value="">All</MenuItem>
          {Object.values(TaskStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label="Priority" select value={filters.priority || ''} onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}>
          <MenuItem value="">All</MenuItem>
          {Object.values(TaskPriority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
      </Stack>

      {loading ? (
        <Typography>Loading tasks...</Typography>
      ) : (
        <Stack spacing={2}>
          {tasks.map(task => (
            <Paper key={task.id} sx={{ p: 2 }}>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2">{task.description}</Typography>
              <Typography variant="caption">Status: {task.status} | Priority: {task.priority}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default HomePage;
