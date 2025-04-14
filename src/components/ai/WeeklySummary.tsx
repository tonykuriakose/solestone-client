import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getWeeklySummary } from '../../api/tasks';

export default function WeeklySummary() {
  const [forceRefresh, setForceRefresh] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery<string>({
    queryKey: ['weekly-summary'],
    queryFn: getWeeklySummary,
    staleTime: 1000 * 60 * 5 
  });

  const handleRefresh = () => {
    setForceRefresh(prev => !prev);
    refetch();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Weekly Summary</Typography>
          <IconButton 
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh summary"
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        {isLoading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2">
            Error loading summary: {(error as Error).message}
          </Typography>
        )}

        {!isLoading && !error && data && (
          <Box 
            component="pre" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              backgroundColor: 'background.paper',
              p: 2,
              borderRadius: 1
            }}
          >
            {data}
          </Box>
        )}

        {!isLoading && !error && !data && (
          <Typography variant="body2" color="text.secondary">
            No summary available for this week
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" mt={1}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  );
}