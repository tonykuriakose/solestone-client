import { useState } from 'react';
import { Button, Container, Typography, Stack } from '@mui/material';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import { TaskFilters as TaskFiltersType } from '../types';

export default function HomePage() {
  console.log("Home page");
  
  const [openForm, setOpenForm] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersType>({});

  return (
    <Container maxWidth="md">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Tasks</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenForm(true)}
          sx={{ textTransform: 'none' }}
        >
          New Task
        </Button>
      </Stack>

      <TaskFilters onFilterChange={setFilters} />
      <TaskList filters={filters} />

      <TaskForm 
        open={openForm} 
        handleClose={() => setOpenForm(false)}
      />
    </Container>
  );
}