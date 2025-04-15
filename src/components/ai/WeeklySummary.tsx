import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button, 
  Divider,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Task } from '../../types';

interface WeeklySummaryProps {
  tasks: Task[];
}

export default function WeeklySummary({ tasks }: WeeklySummaryProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  
  const generateSummary = async () => {
    if (tasks.length === 0) {
      setSummary("You haven't completed any tasks yet. Complete some tasks to get a summary.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, call API: /api/ai/weekly-summary
      // For now, let's simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedSummary = createMockSummary(tasks);
      setSummary(generatedSummary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    generateSummary();
  }, []);
  
  // Mock function to create a summary of tasks
  const createMockSummary = (completedTasks: Task[]): string => {
    if (completedTasks.length === 0) {
      return "You haven't completed any tasks yet. Complete some tasks to get a summary.";
    }
    
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get recently completed tasks
    const recentTasks = completedTasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate >= lastWeek && taskDate <= today;
    });
    
    // Group tasks by tag
    const tasksByTag: Record<string, Task[]> = {};
    recentTasks.forEach(task => {
      const tags = task.tags || ['untagged'];
      tags.forEach(tag => {
        if (!tasksByTag[tag]) {
          tasksByTag[tag] = [];
        }
        tasksByTag[tag].push(task);
      });
    });
    
    // Create summary text
    let summaryText = `## Weekly Accomplishments\n\n`;
    summaryText += `You've completed ${recentTasks.length} tasks in the past week. Great job!\n\n`;
    
    if (recentTasks.length === 0) {
      summaryText += "No tasks completed this week. Let's focus on completing some tasks in the coming days!\n\n";
    } else {
      // Add summary by category
      summaryText += `### Summary by Category\n\n`;
      
      Object.keys(tasksByTag).forEach(tag => {
        const tasksInTag = tasksByTag[tag];
        summaryText += `**${tag.charAt(0).toUpperCase() + tag.slice(1)}**: Completed ${tasksInTag.length} tasks\n`;
        tasksInTag.forEach(task => {
          summaryText += `- ${task.title}\n`;
        });
        summaryText += '\n';
      });
      
      // Add productivity insights
      const highPriorityCompleted = recentTasks.filter(t => t.priority === 'high').length;
      
      summaryText += `### Productivity Insights\n\n`;
      summaryText += `- You completed ${highPriorityCompleted} high priority tasks\n`;
      summaryText += `- Most productive category: ${getMostProductiveCategory(tasksByTag)}\n`;
      summaryText += `- Average tasks per day: ${(recentTasks.length / 7).toFixed(1)}\n\n`;
      
      // Add next week focus
      summaryText += `### Suggested Focus for Next Week\n\n`;
      summaryText += `Based on your completion patterns, consider focusing on:\n`;
      summaryText += `1. Continue making progress on ${getMostProductiveCategory(tasksByTag)} tasks\n`;
      summaryText += `2. Try to complete more high priority tasks\n`;
      summaryText += `3. Set manageable daily goals to maintain momentum\n`;
    }
    
    return summaryText;
  };
  
  const getMostProductiveCategory = (tasksByTag: Record<string, Task[]>): string => {
    let maxTasks = 0;
    let mostProductiveCategory = 'General';
    
    Object.keys(tasksByTag).forEach(tag => {
      if (tag !== 'untagged' && tasksByTag[tag].length > maxTasks) {
        maxTasks = tasksByTag[tag].length;
        mostProductiveCategory = tag;
      }
    });
    
    return mostProductiveCategory.charAt(0).toUpperCase() + mostProductiveCategory.slice(1);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          AI-generated summary of your completed tasks
        </Typography>
        
        <Button 
          startIcon={<RefreshIcon />}
          size="small"
          onClick={generateSummary}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            backgroundColor: 'background.default',
            whiteSpace: 'pre-wrap'
          }}
        >
          {summary?.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
              return <Typography key={index} variant="h5" gutterBottom>{line.replace('## ', '')}</Typography>;
            }
            if (line.startsWith('### ')) {
              return <Typography key={index} variant="h6" gutterBottom sx={{ mt: 2 }}>{line.replace('### ', '')}</Typography>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <Typography key={index} variant="subtitle1" sx={{ fontWeight: 'bold' }}>{line.replace(/\*\*/g, '')}</Typography>;
            }
            if (line.startsWith('- ')) {
              return <Typography key={index} variant="body2" sx={{ pl: 2 }}>• {line.substring(2)}</Typography>;
            }
            if (line.match(/^\d+\. /)) {
              return <Typography key={index} variant="body2" sx={{ pl: 2 }}>{line}</Typography>;
            }
            return <Typography key={index} variant="body2" paragraph>{line}</Typography>;
          })}
        </Paper>
      )}
    </Box>
  );
}