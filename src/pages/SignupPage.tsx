import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password, name });
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Stack spacing={3} sx={{ mt: 8 }}>
        <Typography variant="h4" align="center">Sign Up</Typography>
        
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              Create Account
            </Button>
          </Stack>
        </form>

        <Typography align="center">
          Already have an account?{' '}
          <Button 
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>
        </Typography>
      </Stack>
    </Container>
  );
}