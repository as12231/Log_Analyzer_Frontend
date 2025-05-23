// src/App.js (or App.tsx if you're using TypeScript)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './Pages/Footer';
import AppRouters from './Routes/AppRouters';
import Box from '@mui/material/Box';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensures the page takes the full viewport height
      }}
    >
      <Router>
        {/* <NavBarMain /> */}
        <Box
          sx={{
            flex: 1, 
          }}
        >
          <AppRouters />
        </Box>
        <Footer />
      </Router>
    </Box>
  );
};

export default App;