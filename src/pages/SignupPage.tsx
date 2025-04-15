import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Paper,
} from '@mui/material';
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
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(to right, #f8f9fa, #e0e0e0)',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h4" align="center" fontWeight="bold">
              Sign Up
            </Typography>

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ textTransform: 'none' }}
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            <Typography align="center" mt={2}>
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Login
              </Button>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
