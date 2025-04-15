import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Paper,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Task } from '../../types';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TaskChatProps {
  tasks: Task[];
}

export default function TaskChat({ tasks }: TaskChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'system-1',
      content: "Hi there! I'm your AI assistant. Ask me anything about your tasks, like 'What tasks are due today?' or 'How many high priority tasks do I have?'",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = generateAIResponse(input, tasks);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const generateAIResponse = (question: string, userTasks: Task[]): string => {
    const lowercaseQuestion = question.toLowerCase();

    if (lowercaseQuestion.includes('due today') || lowercaseQuestion.includes('due for today')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueTasks = userTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });
      
      if (dueTasks.length === 0) {
        return "You don't have any tasks due today. Enjoy your day!";
      }

      let response = `You have ${dueTasks.length} task${dueTasks.length === 1 ? '' : 's'} due today:\n\n`;
      dueTasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title}${task.priority ? ` (${task.priority} priority)` : ''}\n`;
      });
      return response;
    }

    if (lowercaseQuestion.includes('high priority') || lowercaseQuestion.includes('important tasks')) {
      const highPriorityTasks = userTasks.filter(task => task.priority === 'high' && !task.completed);
      if (highPriorityTasks.length === 0) {
        return "You don't have any high priority tasks at the moment.";
      }

      let response = `You have ${highPriorityTasks.length} high priority task${highPriorityTasks.length === 1 ? '' : 's'}:\n\n`;
      highPriorityTasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title}${task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleDateString()})` : ''}\n`;
      });
      return response;
    }

    if (lowercaseQuestion.includes('completed') || lowercaseQuestion.includes('finished')) {
      const completedTasks = userTasks.filter(task => task.completed);
      const recentlyCompleted = completedTasks.slice(-5).reverse();
      if (completedTasks.length === 0) {
        return "You haven't completed any tasks yet. Keep going!";
      }

      let response = `You've completed ${completedTasks.length} task${completedTasks.length === 1 ? '' : 's'} in total.\n\nMost recently completed:\n`;
      recentlyCompleted.forEach((task, index) => {
        response += `${index + 1}. ${task.title}\n`;
      });
      return response;
    }

    if (lowercaseQuestion.includes('overdue') || lowercaseQuestion.includes('late')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdueTasks = userTasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
      });

      if (overdueTasks.length === 0) {
        return "Great job! You don't have any overdue tasks.";
      }

      let response = `You have ${overdueTasks.length} overdue task${overdueTasks.length === 1 ? '' : 's'}:\n\n`;
      overdueTasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title} (Due: ${new Date(task.dueDate!).toLocaleDateString()})\n`;
      });
      return response;
    }

    return "Sorry, I couldn't understand your question. Try asking about tasks that are due today, overdue, high priority, or completed.";
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Task Assistant</Typography>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', my: 2 }}>
        {messages.map(msg => (
          <Box key={msg.id} display="flex" alignItems="flex-start" mb={2}>
            <Avatar sx={{ bgcolor: msg.sender === 'ai' ? 'primary.main' : 'secondary.main', mr: 1 }}>
              {msg.sender === 'ai' ? <SmartToyIcon /> : <PersonIcon />}
            </Avatar>
            <Paper elevation={1} sx={{ p: 1.5, maxWidth: '80%' }}>
              <Typography variant="body2">{msg.content}</Typography>
              <Typography variant="caption" color="text.secondary">{msg.timestamp.toLocaleTimeString()}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <Box display="flex" alignItems="center" mt={1}>
        <TextField
          fullWidth
          placeholder="Ask something about your tasks..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
}
