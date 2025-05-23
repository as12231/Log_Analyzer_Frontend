// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { Box, Container, TextField, Typography, Button, Paper, Snackbar, Alert } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulated API request
      const response = await fetch('https://api.example.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('If your email exists in our records, we have sent a password reset link.');
        setError('');
      } else {
        setError('Something went wrong. Please try again later.');
        setMessage('');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setMessage('');
    }
    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'url(https://source.unsplash.com/1600x900/?healthcare,security)', backgroundSize: 'cover', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter your email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Send Reset Link
            </Button>
          </form>
        </Paper>
      </Container>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        {message ? (
          <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
            {message}
          </Alert>
        ) : error ? (
          <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
