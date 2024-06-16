// LoadingSpinner.js
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress
        size={80}
        thickness={5}
        style={{
          color: '#3f51b5', 
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;