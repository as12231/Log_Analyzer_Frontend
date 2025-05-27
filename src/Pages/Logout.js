// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const Logout = () => {
const navigate = useNavigate();

useEffect(() => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    setTimeout(() => {
navigate('/login');
    }, 1500);
}, [navigate]);

return (
    <Box
sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ece9e6, #ffffff)'
}}
    >
<Typography variant="h5" mb={2}>
        Logging you out securely...
</Typography>
<CircularProgress color="primary" />
    </Box>
);
};

export default Logout;
