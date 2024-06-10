import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

// Dummy data for demonstration purposes
const dummyData = {
  title: 'Featured Product',
  description: 'This is a description of the featured product. It provides more details about the product and its features.',
  imageUrl: 'https://via.placeholder.com/150',
  flags: ['New', 'Popular'],
};

const FeaturesCard = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#e6f0ff" // Light sky blue background
    >
      <Card
        sx={{
          width: '70%',
          height: '30vh',
          display: 'flex',
          backgroundColor: '#f5f8fa', // Soft UI background color
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Soft shadow
        }}
      >
        <CardMedia
          component="img"
          src={dummyData.imageUrl}
          alt="Feature Image"
          sx={{ width: '30%', objectFit: 'cover' }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" component="div" gutterBottom>
            {dummyData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dummyData.description}
          </Typography>
          <Box mt={2}>
            {dummyData.flags.map((flag) => (
              <Typography
                key={flag}
                variant="caption"
                component="span"
                sx={{
                  backgroundColor: '#e6f0ff', // Light sky blue flag background
                  color: '#2196f3', // Blue text color
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginRight: '4px',
                }}
              >
                {flag}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeaturesCard;