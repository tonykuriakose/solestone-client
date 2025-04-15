import { useState, FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  Divider,
  Link 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }); // navigate handled in context
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="xs">
      <Stack spacing={3} sx={{ mt: 8 }}>
        <Typography variant="h4" align="center">Login</Typography>
        
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Login
            </Button>
          </Stack>
        </form>

        <Divider>or</Divider>

        <Button 
          variant="outlined" 
          fullWidth
          onClick={googleLogin}
          sx={{ textTransform: 'none' }}
        >
          Continue with Google
        </Button>

        <Typography align="center">
          Don't have an account?{' '}
          <Link 
            component={RouterLink} 
            to="/signup" 
            sx={{ textTransform: 'none' }}
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
}
