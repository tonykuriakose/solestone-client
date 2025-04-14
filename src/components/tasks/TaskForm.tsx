import { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  MenuItem
} from '@mui/material';
import { createTask, updateTask } from '../../api/tasks';

type Task = {
  id?: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
};

type TaskFormProps = {
  open: boolean;
  handleClose: () => void;
  task?: Task;
};

export default function TaskForm({ open, handleClose, task }: TaskFormProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Task>(task || {
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'TODO'
  });

  const mutation = useMutation({
    mutationFn: task?.id ? updateTask : createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleClose();
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{task?.id ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          name="title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Priority"
          name="priority"
          select
          fullWidth
          value={formData.priority}
          onChange={handleChange}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
