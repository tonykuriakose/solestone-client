// Layout.tsx
import { AppBar, Toolbar, Container, Box, Typography, Button } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My App</Typography>
          <Button color="inherit" sx={{ marginLeft: 'auto' }}>Logout</Button>
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
