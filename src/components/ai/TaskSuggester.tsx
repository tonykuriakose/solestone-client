import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { suggestTasks } from '../../api/tasks';
import { TaskPriority } from '../../types';

interface SuggestedTask {
  title: string;
  priority: TaskPriority; 
}

export default function TaskSuggester() {
  const [input, setInput] = useState<string>('');

  
  const { mutate, data, isLoading } = useMutation<SuggestedTask[], Error, string>({
    mutationFn: (inputText: string) => suggestTasks(inputText),
  });

  const handleSubmit = () => {
    mutate(input);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Describe your tasks"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={handleSubmit} 
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Generate Tasks'}
      </Button>

      {data && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Suggested Tasks:</Typography>
          <ul>
            {data.map((task, index) => (
              <li key={index}>
                {task.title} - Priority: {task.priority}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}
