import { useState } from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { Edit, Delete, MoreVert, CheckCircle, Schedule, RadioButtonUnchecked } from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '../../types';
import TaskForm from './TaskForm';
import { format } from 'date-fns';

type TaskItemProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
};

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return 'success';
      case TaskStatus.IN_PROGRESS: return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return 'error';
      case TaskPriority.MEDIUM: return 'warning';
      default: return 'success';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
    handleMenuClose();
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => handleStatusChange(
                  task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE
                )}
                size="small"
              >
                {task.status === TaskStatus.DONE ? (
                  <CheckCircle color="success" />
                ) : (
                  <RadioButtonUnchecked color="disabled" />
                )}
              </IconButton>
              
              <Typography variant="h6" sx={{ 
                textDecoration: task.status === TaskStatus.DONE ? 'line-through' : 'none',
                opacity: task.status === TaskStatus.DONE ? 0.7 : 1
              }}>
                {task.title}
              </Typography>
            </Stack>

            {task.description && (
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={task.status.replace('_', ' ')}
                size="small"
                color={getStatusColor(task.status)}
                variant="outlined"
              />
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority)}
                variant="outlined"
              />
              {task.dueDate && (
                <Chip
                  icon={<Schedule fontSize="small" />}
                  label={format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  size="small"
                  variant="outlined"
                  color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                />
              )}
            </Stack>
          </Stack>

          <Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVert />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => {
                setEditOpen(true);
                handleMenuClose();
              }}>
                <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={() => {
                onDelete(task.id);
                handleMenuClose();
              }}>
                <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
              </MenuItem>
              {task.status !== TaskStatus.DONE && (
                <MenuItem onClick={() => handleStatusChange(TaskStatus.DONE)}>
                  <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Mark Complete
                </MenuItem>
              )}
              {task.status !== TaskStatus.IN_PROGRESS && (
                <MenuItem onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}>
                  <Schedule fontSize="small" sx={{ mr: 1 }} /> Start Progress
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Stack>
      </CardContent>

      <TaskForm
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        task={task}
        onSave={onEdit}
      />
    </Card>
  );
}