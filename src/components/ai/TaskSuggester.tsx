import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Checkbox,
  Paper,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Task } from '../../types';

interface TaskSuggesterProps {
  onAddTasks: (tasks: Task[]) => void;
}

export default function TaskSuggester({ onAddTasks }: TaskSuggesterProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  
  const handleSuggest = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, call API: /api/ai/suggest-tasks
      // For now, let's simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example generated tasks based on input
      const generatedTasks = generateSampleTasks(input);
      setSuggestedTasks(generatedTasks);
      
      // Auto-select all tasks by default
      const newSelectedTasks = new Set<string>();
      generatedTasks.forEach(task => newSelectedTasks.add(task.id));
      setSelectedTasks(newSelectedTasks);
    } catch (err) {
      setError('Failed to get task suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleTask = (taskId: string) => {
    const newSelectedTasks = new Set(selectedTasks);
    
    if (newSelectedTasks.has(taskId)) {
      newSelectedTasks.delete(taskId);
    } else {
      newSelectedTasks.add(taskId);
    }
    
    setSelectedTasks(newSelectedTasks);
  };
  
  const handleAddSelected = () => {
    const tasksToAdd = suggestedTasks.filter(task => selectedTasks.has(task.id));
    
    if (tasksToAdd.length > 0) {
      onAddTasks(tasksToAdd);
      setSuggestedTasks([]);
      setSelectedTasks(new Set());
      setInput('');
    }
  };
  
  // Simulation function to generate tasks from natural language
  const generateSampleTasks = (input: string): Task[] => {
    // Simple parsing logic - in reality this would come from the AI service
    const lowercaseInput = input.toLowerCase();
    const tasks: Task[] = [];
    
    // Example pattern matching for demo purposes
    if (lowercaseInput.includes('meet') || lowercaseInput.includes('call')) {
      tasks.push({
        id: `task-${Date.now()}-1`,
        title: `Schedule: ${input}`,
        description: 'Setup meeting with calendar invite',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        tags: ['meeting'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    if (lowercaseInput.includes('buy') || lowercaseInput.includes('shop') || lowercaseInput.includes('get')) {
      tasks.push({
        id: `task-${Date.now()}-2`,
        title: `Purchase: ${input.replace(/buy|get|shop for/gi, '').trim()}`,
        description: `Remember to buy ${input.replace(/buy|get|shop for/gi, '').trim()}`,
        completed: false,
        priority: 'low',
        tags: ['shopping'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    if (lowercaseInput.includes('write') || lowercaseInput.includes('create') || lowercaseInput.includes('prepare')) {
      tasks.push({
        id: `task-${Date.now()}-3`,
        title: `Document: ${input}`,
        description: `Create document for ${input.replace(/write|create|prepare/gi, '').trim()}`,
        completed: false,
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        tags: ['work', 'document'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // If no specific patterns match, create a generic task
    if (tasks.length === 0) {
      tasks.push({
        id: `task-${Date.now()}-generic`,
        title: input,
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return tasks;
  };
  
  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        Describe your tasks in natural language, and AI will convert them to structured tasks.
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          label="E.g., Buy groceries, Meet with John next Monday..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSuggest();
            }
          }}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          endIcon={<SendIcon />}
          onClick={handleSuggest}
          disabled={!input.trim() || loading}
          sx={{ ml: 1 }}
        >
          Suggest
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {suggestedTasks.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Suggested tasks:
          </Typography>
          
          <Paper variant="outlined" sx={{ mb: 2 }}>
            <List dense>
              {suggestedTasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedTasks.has(task.id)}
                      onChange={() => handleToggleTask(task.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        {task.description && <div>{task.description}</div>}
                        {task.dueDate && (
                          <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                        )}
                        {task.priority && <div>Priority: {task.priority}</div>}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Button
            variant="contained"
            onClick={handleAddSelected}
            disabled={selectedTasks.size === 0}
            fullWidth
          >
            Add {selectedTasks.size} Task{selectedTasks.size !== 1 ? 's' : ''}
          </Button>
        </Box>
      )}
    </Box>
  );
}