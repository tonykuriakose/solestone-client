import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Container, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Container maxWidth="md">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">SmartToDo AI</Typography>
              {user && (
                <Stack direction="row" spacing={2}>
                  <Button color="inherit" href="/">Tasks</Button>
                  <Button color="inherit" href="/ai-tools">AI Tools</Button>
                  <Button color="inherit" onClick={logout}>Logout</Button>
                </Stack>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* This Outlet will render the nested routes */}
        <Outlet />
      </Container>
    </>
  );
}