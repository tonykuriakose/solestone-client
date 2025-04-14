import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export default function TaskChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

  
interface AIMessageResponse {
    success: boolean;
    response: string;
    error?: string;
    // Add other fields if needed from your backend
  }
  
interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    // Optional metadata if needed
    metadata?: {
      type?: 'task_list' | 'summary' | 'suggestion';
      tasks?: Task[]; // Reference your existing Task type
    };
  }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    

    try {
      // Send to AI service
      const { data } = await axios.post(
        `${import.meta.env.VITE_AI_SERVICE_URL}/ai/chat`,
        { query: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

  
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box sx={{ 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      height: 400,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        p: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6">Task Assistant</Typography>
        <Typography variant="body2" color="text.secondary">
          Ask about your tasks (e.g., "What's due today?")
        </Typography>
      </Box>

      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.default'
      }}>
        <List>
          {messages.map((message) => (
            <ListItem 
              key={message.id}
              sx={{
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {!message.isUser && (
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32
                }}>
                  AI
                </Avatar>
              )}
              
              <Box sx={{
                maxWidth: '70%',
                bgcolor: message.isUser ? 'primary.main' : 'background.paper',
                color: message.isUser ? 'primary.contrastText' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 1
              }}>
                <ListItemText
                  primary={message.content}
                  secondary={message.timestamp.toLocaleTimeString()}
                  secondaryTypographyProps={{
                    color: message.isUser ? 'primary.contrastText' : 'text.secondary'
                  }}
                />
              </Box>

              {message.isUser && (
                <Avatar sx={{ 
                  bgcolor: 'secondary.main',
                  width: 32,
                  height: 32
                }}>
                  U
                </Avatar>
              )}
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <IconButton 
                type="submit" 
                disabled={!input.trim() || isLoading}
              >
                <Send />
              </IconButton>
            )
          }}
        />
      </Box>
    </Box>
  );
}