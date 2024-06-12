import React, { useState } from 'react';
import FeaturesCard from './components/FeaturesCard';
import Header from './components/Header';
import './style.css';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import QuotationCard from './components/QuotationCard';

const Shop = () => {
  const [actionType, setActionType] = useState("Shop Features");

  const handleChange = (event) => {
    setActionType(event.target.value);
  };

  const renderActionComponent = () => {
    switch (actionType) {
      case "Shop Features":
        return <FeaturesCard />;
      case "Quotation Delete":
        return <QuotationCard />;
      case "Products Delete":
        return <div>Products Delete Component</div>;
      case "All Images Delete":
        return <div>All Images Delete Component</div>;
      case "Stale Images Delete":
        return <div>Stale Images Delete Component</div>;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "1rem",
          borderRadius: "2px solid red",
          margin: "5rem",
        }}
      >
        <div className="shop-header">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={actionType}
              defaultValue="Shop Features"
              label="Action Type"
              onChange={handleChange}
              sx={{
                width: 200,
              }}
            >
              <MenuItem value="Shop Features">Shop Features</MenuItem>
              <MenuItem value="Quotation Delete">Quotation Delete</MenuItem>
              <MenuItem value="Products Delete">Products Delete</MenuItem>
              <MenuItem value="All Images Delete">All Images Delete</MenuItem>
              <MenuItem value="Stale Images Delete">Stale Images Delete</MenuItem>
            </Select>
          </FormControl>
        </div>
        {renderActionComponent()}
      </Box>
    </React.Fragment>
  );
};

export default Shop;