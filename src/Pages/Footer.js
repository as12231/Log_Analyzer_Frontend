

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        backgroundColor: '#2a2e39', // Darker background color
        padding: isMobile ? '10px 0' : '20px 0',
        color: '#FFFFFF',
        textAlign: 'center',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.3)',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          top: '-30px',
          width: '100%',
        }}
      >
        <ArrowUpwardIcon sx={{ color: '#FFFFFF', cursor: 'pointer' }} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
          }}
        >
          © {currentYear} XNL FULL STACK TASK 02
        </Typography>
       
        
      </Box>
      <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', justifyContent: 'space-between', marginLeft:'30%',width: '43%' }}>
  <span>REG_NO : 21BCE9295</span>
  <span>NAME : KOMMA THARUN SAI</span>
</Typography>

         
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
      </Box>
    </Box>
  );
};

export default Footer;



