import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const FeaturesCard = ({ shopId }) => {
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopId) {
      fetchShopFeatures();
      console.log("HEY");
    }
  }, []);

  const fetchShopFeatures = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/shops/${shopId}`);
      const shopData = response.data;
      console.log(shopData, "shopData");
      if (shopData && shopData.features) {
        try {
          let parsedFeatures = shopData.features;
          if (typeof shopData.features === 'string') {
            parsedFeatures = JSON.parse(shopData.features);
          }
          setFeatures(parsedFeatures);
        } catch (jsonError) {
          console.error('Error parsing features JSON:', jsonError);
          setError('Invalid features data');
        }
      } else {
        setFeatures({});
      }
    } catch (error) {
      console.error('Error fetching shop features:', error);
      setError('Failed to fetch shop features');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = (key) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [key]: !prevFeatures[key],
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/shops/${shopId}`, { features: JSON.stringify(features) });
      console.log('Features saved successfully');
    } catch (error) {
      console.error('Error saving features:', error);
      setError('Failed to save features');
    } finally {
      setLoading(false);
    }
  };

  const renderToggleFields = () => {
    const toggleFields = Object.entries(features).filter(([key, value]) => typeof value === 'boolean');
    console.log(features, "Toggle Fields");

    return (
      <>
        <SectionHeading variant="h5">Toggles</SectionHeading>
        <Grid container spacing={2}>
          {toggleFields.map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" mr={1}>
                  {key}
                </Typography>
                <Switch
                  checked={value}
                  onChange={() => handleToggleChange(key)}
                  name={key}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={4} sx={{ p: 4, mt: 5 }}>
      {renderToggleFields()}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSaveChanges}
          disabled={loading}
          sx={{
            backgroundColor: '#6FC276',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Paper>
  );
};

export default FeaturesCard;