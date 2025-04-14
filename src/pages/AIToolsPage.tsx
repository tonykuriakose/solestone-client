import { Container, Typography, Stack } from '@mui/material';
import TaskSuggester from '../components/ai/TaskSuggester';
import WeeklySummary from '../components/ai/WeeklySummary';
import TaskChat from '../components/ai/TaskChat';

export default function AIToolsPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>AI Tools</Typography>
      
      <Stack spacing={4}>
        <TaskSuggester />
        <WeeklySummary />
        <TaskChat />
      </Stack>
    </Container>
  );
}