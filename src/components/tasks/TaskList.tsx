import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Stack } from '@mui/material';
import TaskItem from './TaskItem';
import { fetchTasks } from '../../api/tasks';

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
};

type Filters = {
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
};

type TaskListProps = {
  filters?: Filters;
};

export default function TaskList({ filters }: TaskListProps) {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ mt: 3 }}>
      <Stack spacing={2}>
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Stack>
    </Box>
  );
}
