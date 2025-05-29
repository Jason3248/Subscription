import React, { useState, useContext } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper, 
  Container,
  Alert
} from '@mui/material';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/users/register', { name, email, password });
      login(res.data.user, res.data.token);
      navigate('/plans');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            type="text"
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          
          <Typography variant="body1" align="center">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;