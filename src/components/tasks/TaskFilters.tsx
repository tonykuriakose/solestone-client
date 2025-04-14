import { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent, 
  Button,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from '../../types';

type TaskFiltersProps = {
  onFilterChange: (filters: TaskFiltersType) => void;
};

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    const filters: TaskFiltersType = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) filters.dueDate = dueDate;
    onFilterChange(filters);
  }, [status, priority, dueDate, onFilterChange]);

  const handleClearFilters = () => {
    setStatus('');
    setPriority('');
    setDueDate(null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e: SelectChangeEvent<TaskStatus | ''>) => 
              setStatus(e.target.value as TaskStatus)
            }
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {Object.values(TaskStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e: SelectChangeEvent<TaskPriority | ''>) => 
              setPriority(e.target.value as TaskPriority)
            }
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {Object.values(TaskPriority).map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
          />

        <Button 
          variant="outlined" 
          onClick={handleClearFilters}
          sx={{ textTransform: 'none' }}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
}