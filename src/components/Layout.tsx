import { AppBar, Toolbar, Container, Box, Typography, Button } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Adjust the import path

export default function Layout() {
  const { logout } = useAuth();  // Get logout function from context

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My App</Typography>
          <Button 
            color="inherit" 
            sx={{ marginLeft: 'auto' }}
            onClick={logout}  // Add onClick handler
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}